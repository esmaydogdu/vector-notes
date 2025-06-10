# Vector Notes
Originally started as a ticketing app, this project evolved into a simple note-taking app focused on exploring semantic relationships between notes. 

Vector Notes uses OpenAI embedding APIs to generate vector representations of notes, which are then stored in SingleStore for fast semantic search and similarity features.

## Does

- CRUD
- Semantic search using OpenAI embedding endpoints
- Shows semantically similar notes 
- Supports category separation for notes

## Uses

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- OpenAI Embeddings API
- SingleStore (vector database)

## Getting Started

1. **Clone the repository:**
   ```sh
   git clone https://github.com/YOUR_USERNAME/vector-notes.git
   cd vector-notes
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Set up environment variables:**
   - Create an .env file with these variables:
    - `OPENAI_API_KEY` – Your OpenAI API key for embeddings
    - `SINGLESTORE_HOST`, `SINGLESTORE_PASSWORD` – Your SingleStore connection details

4. **Run the development server:**
   ```sh
   npm run dev
   ```

5. **Open [http://localhost:3000](http://localhost:3000) in your browser.**

    Enjoy!

## License

MIT