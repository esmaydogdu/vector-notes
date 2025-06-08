import { singlestore } from '@/db/singlestore';
import { getEmbedding } from '@/utils/embeddings';
import { createHash } from 'crypto'

const vectorToHash = (vector: number[]): string => {
  const hash = createHash("md5").update(JSON.stringify(vector)).digest("hex")

  return `#${hash.slice(0, 6)}`
}

// Create note
export async function POST(request: Request) {
  try {
    const { title, description } = await request.json();
    
    if (!title || !description) {
      return new Response('Title and description are required fields', { status: 400 });
    }
    const embedding = await getEmbedding(`${description || ""}`);
    console.log('embedding?', embedding)
    const embeddingJson = JSON.stringify(embedding); 
    const [result] = await singlestore.execute(
      `INSERT INTO notes (title, description, vector)
      VALUES (?, ?, JSON_ARRAY_PACK(?))`,
      [title, description, embeddingJson]
    );

    console.log('>>> POST result', result)
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

    console.log('>>> similar notes after insert:', similarNotes)
    return new Response(JSON.stringify({note: rows[0], similarNotes }), { status: 201 });
  } catch (error) {
    return new Response(error.message || 'Error creating note', { status: 500 });
  }
}

// Get note(s)
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const noteId = url.searchParams.get('noteId');
    const query = url.searchParams.get('query') || '';

    // Single note
    if (noteId) {
    
      const [noterow] = await singlestore.execute(
        `select * from notes
        where id = ?
        `,
        [noteId]
      );

      const note = noterow?.[0]
      if (!note) {
        return new Response(
          JSON.stringify({ error: "Note not found" }),
          { status: 404 }
        );
      }

      // retrieve similiar notes
      const embedding = await getEmbedding(`${note.title} ${note.description || ""}`);

      const [similarNotes] = await singlestore.execute(
        `select 
          id,
          createdAt,
          title,
          description,
          dot_product(vector, JSON_ARRAY_PACK(?)) as score
        from notes
        where id != ?
        order by score desc
        limit 3
        `,
        [JSON.stringify(embedding), noteId]
      );
      console.log('>> embedding', embedding)
      const hash = createHash("md5").update(JSON.stringify(embedding)).digest("hex");
      console.log('>>> hash', hash)
      

      console.log('>>> Similar notes:', similarNotes);

      return new Response(JSON.stringify({ note: {...note, hash}, similarNotes }), { status: 200 });
    }

    if (!query) {
      const [rows] = await singlestore.execute(
        `select * from notes
        `
      );
      return new Response(JSON.stringify(rows), { status: 200 });
    } else {
      const embedding = await getEmbedding(query);
      const [rows] = await singlestore.execute(
        `select 
          title,
          description,
          id,
          createdAt,
          dot_product(vector, JSON_ARRAY_PACK(?)) as score
        from notes
        order by score desc
        limit 10
        `,
        [JSON.stringify(embedding)]
      );
      return new Response(JSON.stringify(rows), { status: 200 });
    }


  } catch (error: any) {
    return new Response(error.message || 'Error fetching notes', { status: 500 });
  }
}

// Update note
export async function PATCH(request: Request) {
  try {
    const url = new URL(request.url);
    const noteId = url.searchParams.get('noteId');
    const { title, description, labels, status } = await request.json();
    
    if (!noteId) {
      return new Response('Note ID is required', { status: 400 });
    }

    const updateData: Record<string, any> = {}
    if (title?.trim()) updateData.title = title
    if (description?.trim()) updateData.description = description
    if (description?.trim()) updateData.status = status

  
      const embedding = await getEmbedding(description);
      const embeddingJson = JSON.stringify(embedding);

      const [result] = await singlestore.execute(
        `UPDATE notes
        SET title = ?, description = ?, vector = JSON_ARRAY_PACK(?)
        WHERE id = ?`,
        [title, description, embeddingJson, noteId]
      );
      console.log('>> patch result:', result);
    
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

    if (!noteId) {
      return new Response('Note ID is required', { status: 400 });
    }

    const [result] = await singlestore.execute(
      `DELETE FROM notes WHERE id = ?`,
      [noteId]
    );

    if (result?.affectedRows && result.affectedRows > 0) {
      return new Response('Note deleted', { status: 200 });
    }

  }
  catch (error: any) {
    return new Response(error.message || 'Error deleting note', { status: 500 });
  }
}
