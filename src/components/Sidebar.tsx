import { type Folder, type Snippet } from "@/lib/db";
import { Code2, FileCode2, Folder as FolderIcon, FolderOpen as FolderOpenIcon, LayoutGrid, Plus, Search } from "lucide-react";
import { LanguageIcon } from "./LanguageIcon";

interface SidebarProps {
    snippets: Snippet[];
    folders: Folder[];
    selected: Snippet | null;
    activeFolder: number | null;
    setActiveFolder: (id: number | null) => void;
    onSelectSnippet: (s: Snippet) => void;
    onOpenContextMenu: (e: React.MouseEvent, id: number, type: "snippet" | "folder") => void;

    isCreatingSnippet: boolean;
    setIsCreatingSnippet: (v: boolean) => void;
    createSnippetName: string;
    setCreateSnippetName: (v: string) => void;
    onCreateSnippetSubmit: (e: React.KeyboardEvent) => void;
    onCancelCreateSnippet: () => void;

    isCreatingFolder: boolean;
    setIsCreatingFolder: (v: boolean) => void;
    createFolderName: string;
    setCreateFolderName: (v: string) => void;
    onCreateFolderSubmit: (e: React.KeyboardEvent) => void;
    onCancelCreateFolder: () => void;

    renamingId: number | null;
    renameName: string;
    setRenameName: (v: string) => void;
    onRenameSubmit: (e: React.KeyboardEvent, id: number) => void;
    setRenamingId: (v: number | null) => void;
    renamingType: "snippet" | "folder" | null;
}

export function Sidebar(props: SidebarProps) {
    return (
        <div className="flex flex-col bg-muted/30 border-r border-border h-full min-w-0 text-sm">

            {/* СЕКЦИЯ: ПАПКИ */}
            <div className="flex flex-col shrink-0">
                <div className="flex items-center justify-between px-4 pt-5 pb-2 text-[11px] font-bold tracking-widest text-muted-foreground uppercase group">
                    <span className="flex items-center gap-2">Папки</span>
                    <button
                        onClick={() => props.setIsCreatingFolder(true)}
                        className="opacity-0 group-hover:opacity-100 hover:bg-accent p-1 rounded-md transition-all duration-200"
                        title="Новая папка (Ctrl+Shift+N)"
                    >
                        <Plus className="w-3.5 h-3.5" />
                    </button>
                </div>

                <div className="px-2 space-y-0.5 max-h-[30vh] overflow-y-auto custom-scrollbar">
                    <div
                        onClick={() => props.setActiveFolder(null)}
                        className={`group flex items-center px-3 py-2 cursor-pointer rounded-lg text-[13px] font-medium transition-all duration-200 ${props.activeFolder === null
                                ? 'bg-accent text-accent-foreground shadow-sm ring-1 ring-border/50'
                                : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'
                            }`}
                    >
                        <LayoutGrid className={`w-4 h-4 mr-2.5 shrink-0 transition-colors ${props.activeFolder === null ? 'text-primary' : 'text-muted-foreground/70 group-hover:text-foreground'}`} />
                        Все шаблоны
                    </div>

                    {props.isCreatingFolder && (
                        <div className="flex items-center px-2.5 py-1.5 bg-background rounded-lg border border-primary/50 shadow-[0_0_10px_rgba(59,130,246,0.1)] my-1 mx-1 animate-in fade-in zoom-in-95">
                            <FolderIcon className="w-3.5 h-3.5 mr-2 text-primary" />
                            <input
                                autoFocus
                                className="bg-transparent outline-none text-[13px] w-full text-foreground placeholder:text-muted-foreground"
                                placeholder="Имя папки..."
                                value={props.createFolderName}
                                onChange={(e) => props.setCreateFolderName(e.target.value)}
                                onKeyDown={props.onCreateFolderSubmit}
                                onBlur={props.onCancelCreateFolder}
                            />
                        </div>
                    )}

                    {props.folders.map((f) => (
                        <div
                            key={f.id}
                            onClick={() => props.setActiveFolder(f.id)}
                            onContextMenu={(e) => { e.preventDefault(); e.stopPropagation(); props.onOpenContextMenu(e, f.id, "folder"); }}
                            className={`custom-context-trigger group flex items-center justify-between px-3 py-2 cursor-pointer rounded-lg text-[13px] font-medium transition-all duration-200 ${props.activeFolder === f.id
                                    ? 'bg-accent text-accent-foreground shadow-sm ring-1 ring-border/50'
                                    : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'
                                }`}
                        >
                            {props.renamingId === f.id && props.renamingType === "folder" ? (
                                <input
                                    autoFocus
                                    className="bg-transparent border-none outline-none text-[13px] w-full text-foreground"
                                    value={props.renameName}
                                    onChange={(e) => props.setRenameName(e.target.value)}
                                    onKeyDown={(e) => props.onRenameSubmit(e, f.id)}
                                    onBlur={() => props.setRenamingId(null)}
                                    onClick={(e) => e.stopPropagation()}
                                />
                            ) : (
                                <div className="flex items-center truncate">
                                    {f.icon ? (
                                        <div className="mr-2.5 shrink-0 flex items-center justify-center filter group-hover:brightness-110">
                                            <LanguageIcon language={f.icon} />
                                        </div>
                                    ) : (
                                        <FolderOpenIcon className={`w-4 h-4 mr-2.5 shrink-0 transition-colors ${props.activeFolder === f.id ? 'text-yellow-500' : 'text-muted-foreground/70 group-hover:text-yellow-500/70'}`} />
                                    )}
                                    <span className="truncate">{f.name}</span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div className="px-4 py-3">
                <div className="h-px bg-border/50 w-full" />
            </div>

            {/* СЕКЦИЯ: ШАБЛОНЫ */}
            <div className="flex flex-col flex-1 min-h-0">
                <div className="flex items-center justify-between px-4 pb-2 text-[11px] font-bold tracking-widest text-muted-foreground uppercase group shrink-0">
                    <span className="flex items-center gap-2">Шаблоны <span className="bg-muted px-1.5 py-0.5 rounded-full text-[9px] text-muted-foreground">{props.snippets.length}</span></span>
                    <button
                        onClick={() => props.setIsCreatingSnippet(true)}
                        className="opacity-0 group-hover:opacity-100 hover:bg-accent p-1 rounded-md transition-all duration-200"
                        title="Новый шаблон (Ctrl+N)"
                    >
                        <Plus className="w-3.5 h-3.5" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-2 pb-4 space-y-0.5 custom-scrollbar">
                    {props.isCreatingSnippet && (
                        <div className="flex items-center px-2.5 py-1.5 bg-background rounded-lg border border-primary/50 shadow-[0_0_10px_rgba(59,130,246,0.1)] shrink-0 mb-2 mx-1 animate-in fade-in zoom-in-95">
                            <FileCode2 className="w-3.5 h-3.5 mr-2 text-primary" />
                            <input
                                autoFocus
                                className="bg-transparent outline-none text-[13px] w-full text-foreground placeholder:text-muted-foreground"
                                placeholder="Имя файла..."
                                value={props.createSnippetName}
                                onChange={(e) => props.setCreateSnippetName(e.target.value)}
                                onKeyDown={props.onCreateSnippetSubmit}
                                onBlur={props.onCancelCreateSnippet}
                            />
                        </div>
                    )}

                    {props.snippets.map((s) => (
                        <div
                            key={s.id}
                            onClick={() => props.onSelectSnippet(s)}
                            onContextMenu={(e) => { e.preventDefault(); e.stopPropagation(); props.onOpenContextMenu(e, s.id, "snippet"); }}
                            className={`custom-context-trigger group relative flex flex-col px-3 py-2 cursor-pointer rounded-lg text-[13px] transition-all duration-200 ${props.selected?.id === s.id
                                    ? 'bg-accent text-accent-foreground shadow-sm ring-1 ring-border/50'
                                    : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'
                                }`}
                        >
                            <div className="flex items-center w-full">
                                <div className="mr-2.5 shrink-0 flex items-center justify-center filter group-hover:brightness-110">
                                    <LanguageIcon language={s.language} />
                                </div>
                                {props.renamingId === s.id && props.renamingType === "snippet" ? (
                                    <input
                                        autoFocus
                                        className="bg-transparent border-none outline-none text-[13px] w-full text-foreground"
                                        value={props.renameName}
                                        onChange={(e) => props.setRenameName(e.target.value)}
                                        onKeyDown={(e) => props.onRenameSubmit(e, s.id)}
                                        onBlur={() => props.setRenamingId(null)}
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                ) : (
                                    <div className="flex flex-col min-w-0 w-full">
                                        <span className="truncate font-medium">{s.title}</span>
                                        <span className="text-[10px] text-muted-foreground/70 uppercase tracking-wider truncate mt-0.5">
                                            {s.language}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}

                    {props.snippets.length === 0 && !props.isCreatingSnippet && (
                        <div className="text-center px-4 py-8">
                            <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-muted/50 mb-3">
                                <Code2 className="w-5 h-5 text-muted-foreground/50" />
                            </div>
                            <p className="text-xs text-muted-foreground">Нет шаблонов в этой папке</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="p-3 bg-transparent border-t border-border/50 shrink-0">
                <div className="flex items-center justify-center gap-1.5 text-[10px] text-muted-foreground/70 font-medium">
                    <Search className="w-3 h-3" />
                    <span>Поиск: <kbd className="font-sans">Ctrl+F</kbd></span>
                </div>
            </div>

        </div>
    );
}
