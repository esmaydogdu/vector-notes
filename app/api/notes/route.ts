import { singlestore } from '@/db/singlestore';
import { getEmbedding } from '@/utils/embeddings';
import { withAuth } from "@workos-inc/authkit-nextjs";
import { Buffer } from 'buffer';

const vectorToSymmetricColor = (vector: number[]): string => {
  // Split into 3 chunks
  const chunkSize = Math.floor(vector.length / 3);
  const rgb = [0, 1, 2].map(i => {
    const chunk = vector.slice(i * chunkSize, (i + 1) * chunkSize);
    // Average and clamp to [-1, 1]
    let avg = chunk.reduce((sum, v) => sum + v, 0) / chunk.length;
    avg = Math.max(-1, Math.min(1, avg));
    // Map [-1, 1] to [0, 255]
    return Math.round(((avg + 1) / 2) * 255);
  });
  return `#${rgb.map(x => x.toString(16).padStart(2, '0')).join('')}`;
}
const bufferToVector = (buffer: Buffer): number[] => {
  // Use Buffer's built-in methods to read floats, which handles alignment
  const floats: number[] = [];
  for (let i = 0; i < buffer.length; i += 4) {
    floats.push(buffer.readFloatLE(i));
  }
  return floats;
};
const hashColor = async (embedding: number[]): Promise<string> => {
    const encoder = new TextEncoder();
    const data = encoder.encode(JSON.stringify(embedding));
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    return hash
}

const prepareInput = (title: string, description: string): string => {
  return  `${title.trim()} ${description.trim()}`
}

// Create note
export async function POST(request: Request) {
  try {
    const { title, description, group = "random" } = await request.json();
    
    if (!title || !description) {
      return new Response('Title and description are required fields', { status: 400 });
    }

    const embedInput = prepareInput(title, description)
    const embedding = await getEmbedding(embedInput);
    const embeddingJson = JSON.stringify(embedding); 

    const { user } = await withAuth();
    if (!user) return new Response("Unauthorized", { status: 401 });

    const userId = user.id;

    const [result] = await singlestore.execute(
      `INSERT INTO notes (title, description, vector, \`group\`, user_id)
      VALUES (?, ?, JSON_ARRAY_PACK(?), ?, ?)`,
      [title, description, embeddingJson, group, userId]
    );

    const insertId = (result as any).insertId || ((Array.isArray(result) && result[0]?.insertId) ? result[0].insertId : undefined);
    if (!insertId) {
      throw new Error('Could not retrieve insertId from insert result');
    }

    // get the inserted note
    const [rows] = await singlestore.execute(
      `SELECT * FROM notes WHERE id = ?`,
      [insertId]
    );
    
    // get similar notes for the existing note
    const [similarNotes] = await singlestore.execute(
      `select 
        title,
        description,
        dot_product(vector, JSON_ARRAY_PACK(?)) as score
      from notes
      where id != ?
      order by score desc
      limit 3
      `,
      [JSON.stringify(embedding), insertId]
    );


    const hash = await hashColor(embedding)
    const symmetricColor = vectorToSymmetricColor(embedding);

    return new Response(JSON.stringify({note: { ...rows[0], hash, symmetricColor }, similarNotes }), { status: 201 });
  } catch (error: any) {
    console.log('>> error', error)
    return new Response(error.message || 'Error creating note', { status: 500 });
  }
}

// Get note(s)
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const noteId = url.searchParams.get('noteId');
    const query = url.searchParams.get('query') || '';
    const group = url.searchParams.get('group') || '';

    const { user } = await withAuth();
    if (!user) return new Response("Unauthorized", { status: 401 });
    const userId = user.id;

    if (noteId) {
      // Fetch a single note for the user
      const [noterow] = await singlestore.execute(
        `SELECT * FROM notes WHERE id = ? AND user_id = ?`,
        [noteId, userId]
      );

      // const [noterow] = await singlestore.execute(
      //   `SELECT *, JSON_UNQUOTE(JSON_EXTRACT(vector, '$')) as vector_str FROM notes WHERE id = ? AND user_id = ?`,
      //   [noteId, userId]
      // );
      const note = noterow?.[0];

      console.log('>>> what is note? baby dont hurt me', note)
      if (!note) {
        return new Response(
          JSON.stringify({ error: "Note not found" }),
          { status: 404 }
        );
      }

      // Fetch similar notes for the existing note
      
      const embedding = bufferToVector(note.vector)
      const [similarNotes] = await singlestore.execute(
        `SELECT 
            id,
            createdAt,
            title,
            description,
            dot_product(vector, JSON_ARRAY_PACK(?)) as score
          FROM notes
          WHERE id != ? AND user_id = ?
          ORDER BY score DESC
          LIMIT 3
        `,
        [JSON.stringify(embedding), noteId, userId]
      );

      const hash = await hashColor(embedding)
      const symmetricColor = vectorToSymmetricColor(embedding);

      return new Response(
        JSON.stringify({ note: { ...note, hash, symmetricColor }, similarNotes }),
        { status: 200 }
      );
    } else if (query) {
      // Search notes for the user
      const embedding = await getEmbedding(query);
      let sql = `
        SELECT 
          title,
          description,
          id,
          createdAt,
          dot_product(vector, JSON_ARRAY_PACK(?)) as score
        FROM notes
        WHERE user_id = ?
      `;
      const params = [JSON.stringify(embedding), userId];
      if (group) {
        sql += ` AND \`group\` = ?`;
        params.push(group);
      }
      sql += ` ORDER BY score DESC LIMIT 10`;
      const [rows] = await singlestore.execute(sql, params);
      return new Response(JSON.stringify(rows), { status: 200 });
    } else {
      // List all notes for the user
      let sql = `SELECT * FROM notes WHERE user_id = ?`;
      const params = [userId];
      if (group) {
        sql += ` AND \`group\` = ?`;
        params.push(group);
      }
      sql += ` ORDER BY createdAt DESC`;
      const [rows] = await singlestore.execute(sql, params);
      return new Response(JSON.stringify(rows), { status: 200 });
    }
  } catch (error: any) {
    console.error("Error in GET /api/notes:", error);
    return new Response(error.message || 'Error fetching notes', { status: 500 });
  }
}

// Update note
export async function PATCH(request: Request) {
  try {
    const url = new URL(request.url);
    const noteId = url.searchParams.get('noteId');

    const { user } = await withAuth();
    if (!user) return new Response("Unauthorized", { status: 401 });

    const userId = user.id;
    const { title, description, status, group } = await request.json();

    if (!noteId) {
      return new Response('Note ID is required', { status: 400 });
    }

    const updateData: Record<string, any> = {}
    if (title?.trim()) updateData.title = title
    if (description?.trim()) updateData.description = description
    if (status?.trim()) updateData.status = status
    if (group?.trim()) updateData.group = group

    let setClause = Object.keys(updateData).map(key => `\`${key}\` = ?`).join(', ');
    const values = Object.values(updateData);
    // If description is updated, update embedding as well

    if (title?.trim() || description?.trim()) {
      // Use the updated title/description, or fallback to existing values if not provided
      const [existingRow] = await singlestore.execute(
        `SELECT title, description FROM notes WHERE id = ? AND user_id = ?`,
        [noteId, userId]
      );
      const existing = existingRow?.[0] || {};
      const newTitle = title?.trim() ?? existing.title;
      const newDescription = description?.trim() ?? existing.description;
      const embedInput = prepareInput(newTitle, newDescription)
      const embedding = await getEmbedding(embedInput);
      setClause += setClause ? ', vector = JSON_ARRAY_PACK(?)' : 'vector = JSON_ARRAY_PACK(?)';
      values.push(JSON.stringify(embedding));
    }

    // const hash = await hashColor(embedding)

    // Add noteId and userId to the end of the values array
    values.push(noteId, userId);

    const [result] = await singlestore.execute(
      `UPDATE notes
      SET ${setClause}
      WHERE id = ? AND user_id = ?`,
      values
    );

    // Optionally check if a row was actually updated
    if ((result as any).affectedRows === 0) {
      return new Response('Note not found or not authorized', { status: 404 });
    }

    return new Response(JSON.stringify(noteId), { status: 200 });
  } catch (error: any) {
    return new Response(error.message || 'Error updating note', { status: 500 });
  }
}

// Delete note
export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const noteId = url.searchParams.get('noteId');

    const { user } = await withAuth();
    if (!user) return new Response("Unauthorized", { status: 401 });

    const userId = user.id;

    if (!noteId) {
      return new Response('Note ID is required', { status: 400 });
    }

    const [result] = await singlestore.execute(
      `DELETE FROM notes WHERE id = ? AND user_id = ?`,
      [noteId, userId]
    );

    if ((result as any).affectedRows && (result as any).affectedRows > 0) {
      return new Response('Note deleted', { status: 200 });
    }

    return new Response('Note not found or not authorized', { status: 404 });
  }
  catch (error: any) {
    return new Response(error.message || 'Error deleting note', { status: 500 });
  }
}
