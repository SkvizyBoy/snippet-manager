import { FileCode2, Folder, FolderInput, Image as ImageIcon, Pencil, Trash2 } from "lucide-react";

interface ContextMenuProps {
    contextMenu: { x: number; y: number; id: number; type: "snippet" | "folder" } | null;
    onRename: (id: number) => void;
    onDelete: (id: number) => void;
    onChangeIcon: (id: number) => void;
    onMove: (id: number) => void; // <-- НОВОЕ
}

export function ContextMenu({ contextMenu, onRename, onDelete, onChangeIcon, onMove }: ContextMenuProps) {
    if (!contextMenu) return null;

    const isFolder = contextMenu.type === "folder";

    return (
        <div
            className="custom-context-menu fixed z-[100] bg-[#18181b]/95 backdrop-blur-md border border-zinc-800 rounded-lg shadow-2xl py-1 w-48 animate-in fade-in zoom-in-95 duration-100"
            style={{ top: contextMenu.y, left: contextMenu.x }}
            onClick={(e) => e.stopPropagation()}
        >
            <div className="px-3 py-1.5 text-[10px] font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-2 select-none">
                {isFolder ? <Folder className="w-3 h-3" /> : <FileCode2 className="w-3 h-3" />}
                {isFolder ? "Папка" : "Шаблон"}
            </div>
            <div className="h-px bg-zinc-800/50 my-1 mx-2" />

            {isFolder && (
                <button className="w-full text-left px-3 py-1.5 text-[13px] text-zinc-300 hover:bg-blue-600 hover:text-white flex items-center gap-2 transition-colors" onClick={() => onChangeIcon(contextMenu.id)}>
                    <ImageIcon className="w-3.5 h-3.5" /> Сменить иконку
                </button>
            )}

            {/* 🔥 КНОПКА ПЕРЕМЕЩЕНИЯ (Только для сниппетов) */}
            {!isFolder && (
                <button className="w-full text-left px-3 py-1.5 text-[13px] text-zinc-300 hover:bg-blue-600 hover:text-white flex items-center gap-2 transition-colors" onClick={() => onMove(contextMenu.id)}>
                    <FolderInput className="w-3.5 h-3.5" /> Переместить в...
                </button>
            )}

            <button className="w-full text-left px-3 py-1.5 text-[13px] text-zinc-300 hover:bg-blue-600 hover:text-white flex items-center gap-2 transition-colors" onClick={() => onRename(contextMenu.id)}>
                <Pencil className="w-3.5 h-3.5" /> Переименовать
            </button>
            <button className="w-full text-left px-3 py-1.5 text-[13px] text-red-400 hover:bg-red-500/10 flex items-center gap-2 transition-colors" onClick={() => onDelete(contextMenu.id)}>
                <Trash2 className="w-3.5 h-3.5" /> Удалить
            </button>
        </div>
    );
}
