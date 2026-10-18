import Database from "@tauri-apps/plugin-sql";

export interface Folder {
    id: number;
    name: string;
    icon: string; // <-- НОВОЕ ПОЛЕ
}

export interface Snippet {
    id: number;
    title: string;
    code: string;
    language: string;
    tags: string;
    description: string;
    folder_id: number | null;
    created_at: string;
}

let db: Database | null = null;

export async function getDb() {
    if (!db) {
        db = await Database.load("sqlite:snippet-manager.db");

        await db.execute(`
      CREATE TABLE IF NOT EXISTS folders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        icon TEXT DEFAULT '' -- <-- НОВАЯ КОЛОНКА
      );
    `);

        await db.execute(`
      CREATE TABLE IF NOT EXISTS snippets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        code TEXT NOT NULL,
        language TEXT NOT NULL,
        tags TEXT DEFAULT '',
        description TEXT DEFAULT '',
        folder_id INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(folder_id) REFERENCES folders(id) ON DELETE CASCADE
      );
    `);

        // Миграции для старых баз
        try { await db.execute("ALTER TABLE snippets ADD COLUMN tags TEXT DEFAULT ''"); } catch { }
        try { await db.execute("ALTER TABLE snippets ADD COLUMN description TEXT DEFAULT ''"); } catch { }
        try { await db.execute("ALTER TABLE snippets ADD COLUMN folder_id INTEGER"); } catch { }
        try { await db.execute("ALTER TABLE folders ADD COLUMN icon TEXT DEFAULT ''"); } catch { } // Миграция для папок
    }
    return db;
}

// --- СНИППЕТЫ ---
export async function getAllSnippets(): Promise<Snippet[]> {
    const database = await getDb();
    return await database.select<Snippet[]>("SELECT * FROM snippets ORDER BY id DESC");
}

export async function addSnippet(title: string, code: string, language: string, tags: string = "", description: string = "", folder_id: number | null = null) {
    const database = await getDb();
    return await database.execute(
        "INSERT INTO snippets (title, code, language, tags, description, folder_id) VALUES ($1, $2, $3, $4, $5, $6)",
        [title, code, language, tags, description, folder_id]
    );
}

export async function updateSnippet(id: number, title: string, code: string, language: string, tags: string = "", description: string = "", folder_id: number | null = null) {
    const database = await getDb();
    return await database.execute(
        "UPDATE snippets SET title = $1, code = $2, language = $3, tags = $4, description = $5, folder_id = $6 WHERE id = $7",
        [title, code, language, tags, description, folder_id, id]
    );
}

export async function deleteSnippet(id: number) {
    const database = await getDb();
    return await database.execute("DELETE FROM snippets WHERE id = $1", [id]);
}

// --- ПАПКИ ---
export async function getAllFolders(): Promise<Folder[]> {
    const database = await getDb();
    return await database.select<Folder[]>("SELECT * FROM folders ORDER BY name ASC");
}

export async function addFolder(name: string, icon: string = "") {
    const database = await getDb();
    return await database.execute("INSERT INTO folders (name, icon) VALUES ($1, $2)", [name, icon]);
}

export async function updateFolderIcon(id: number, icon: string) {
    const database = await getDb();
    return await database.execute("UPDATE folders SET icon = $1 WHERE id = $2", [icon, id]);
}

export async function deleteFolder(id: number) {
    const database = await getDb();
    await database.execute("UPDATE snippets SET folder_id = NULL WHERE folder_id = $1", [id]);
    return await database.execute("DELETE FROM folders WHERE id = $1", [id]);
}
