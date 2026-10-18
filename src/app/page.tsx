"use client";

import { open, save } from '@tauri-apps/plugin-dialog'; // <-- НАТИВНЫЕ ОКНА
import { readTextFile, writeTextFile } from '@tauri-apps/plugin-fs'; // <-- НАТИВНАЯ ФС
import { Plus, Settings } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { Group, Panel, Separator } from "react-resizable-panels";
import { toast, Toaster } from "sonner";

import { detectLanguage } from "@/lib/constants";
import { addFolder, addSnippet, deleteFolder, deleteSnippet, getAllFolders, getAllSnippets, updateFolderIcon, updateSnippet, type Folder, type Snippet } from "@/lib/db";
import { setupMonacoWorkers } from "@/lib/monaco";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { writeText } from "@tauri-apps/plugin-clipboard-manager";
import { fetch } from '@tauri-apps/plugin-http';

import { ConfirmModal } from "@/components/ConfirmModal";
import { ContextMenu } from "@/components/ContextMenu";
import { EditorPanel } from "@/components/EditorPanel";
import { Header } from "@/components/Header";
import { IconPickerModal, MoveFolderModal, PlaceholderModal, SettingsModal } from "@/components/Modals";
import { Sidebar } from "@/components/Sidebar";

setupMonacoWorkers();

export default function SnippetManager() {
  const [isAppReady, setIsAppReady] = useState(false);

  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [selected, setSelected] = useState<Snippet | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [activeFolder, setActiveFolder] = useState<number | null>(null);

  const [code, setCode] = useState("");
  const [lang, setLang] = useState("typescript");
  const [tags, setTags] = useState("");
  const [description, setDescription] = useState("");
  const [activeTab, setActiveTab] = useState<"code" | "preview" | "description">("code");

  const [fontSize, setFontSize] = useState(14);
  const [wordWrap, setWordWrap] = useState<"on" | "off">("on");
  const [githubToken, setGithubToken] = useState("");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; id: number; type: "snippet" | "folder" } | null>(null);
  const [placeholders, setPlaceholders] = useState<Record<string, string>>({});
  const [isPlaceholderModalOpen, setIsPlaceholderModalOpen] = useState(false);
  const [pendingCopyCode, setPendingCopyCode] = useState("");

  const [isCreatingSnippet, setIsCreatingSnippet] = useState(false);
  const [createSnippetName, setCreateSnippetName] = useState("");
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [createFolderName, setCreateFolderName] = useState("");

  const [renamingId, setRenamingId] = useState<number | null>(null);
  const [renameName, setRenameName] = useState("");
  const [renamingType, setRenamingType] = useState<"snippet" | "folder" | null>(null);

  const [folderToDelete, setFolderToDelete] = useState<number | null>(null);
  const [snippetToDelete, setSnippetToDelete] = useState<number | null>(null);
  const [iconPickerFolderId, setIconPickerFolderId] = useState<number | null>(null);
  const [snippetToMoveId, setSnippetToMoveId] = useState<number | null>(null);

  const isSaved = selected ? (
    code === selected.code && lang === selected.language && tags === selected.tags && description === selected.description
  ) : true;

  useEffect(() => {
    if (typeof window !== "undefined") {
      // @ts-expect-error Отключаем системный поиск WebView2
      window.find = () => false;
    }
  }, []);

  useEffect(() => {
    const handleClick = () => setContextMenu(null);
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFontSize(Number(localStorage.getItem("fontSize")) || 14);
      setWordWrap((localStorage.getItem("wordWrap") as "on" | "off") || "on");
      setGithubToken(localStorage.getItem("githubToken") || "");
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("fontSize", fontSize.toString());
      localStorage.setItem("wordWrap", wordWrap);
      localStorage.setItem("githubToken", githubToken);
    }
  }, [fontSize, wordWrap, githubToken]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const appWindow = getCurrentWindow();
    const unlisten = appWindow.onCloseRequested(async (event) => {
      event.preventDefault();
      await appWindow.hide();
    });
    return () => { unlisten.then((f) => f()); };
  }, []);

  const handleSelect = useCallback((snippet: Snippet) => {
    setSelected(snippet);
    setCode(snippet.code);
    setLang(snippet.language);
    setTags(snippet.tags || "");
    setDescription(snippet.description || "");
    setActiveTab("code");
  }, []);

  const refreshData = useCallback(async () => {
    const s = await getAllSnippets();
    const f = await getAllFolders();
    setSnippets(s);
    setFolders(f);
  }, []);

  useEffect(() => {
    let isMounted = true;
    const initData = async () => {
      try {
        const s = await getAllSnippets();
        const f = await getAllFolders();
        if (isMounted) {
          setSnippets(s);
          setFolders(f);
          if (s.length > 0) handleSelect(s[0]);
        }
      } catch (e) {
        console.error(e);
      } finally {
        if (isMounted) {
          setTimeout(() => setIsAppReady(true), 300);
        }
      }
    };
    initData();
    return () => { isMounted = false; };
  }, [handleSelect]);

  useEffect(() => {
    if (!selected || isSaved) return;
    const timer = setTimeout(async () => {
      await updateSnippet(selected.id, selected.title, code, lang, tags, description, selected.folder_id || null);
      const updated = await getAllSnippets();
      setSnippets(updated);
      setSelected(prev => prev ? { ...prev, code, language: lang, tags, description } : null);
    }, 1000);
    return () => clearTimeout(timer);
  }, [code, lang, tags, description, selected, isSaved]);

  useEffect(() => {
    const handleGlobalKeys = (e: KeyboardEvent) => {
      const isMac = typeof navigator !== 'undefined' && navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const mod = isMac ? e.metaKey : e.ctrlKey;

      if (mod && ['KeyC', 'KeyV', 'KeyX', 'KeyZ', 'KeyA'].includes(e.code)) return;

      if (mod) {
        e.preventDefault();
        e.stopPropagation();
        if (e.code === "KeyF") setTimeout(() => document.getElementById("global-search")?.focus(), 10);
        else if (e.code === "KeyN" && !e.shiftKey) setIsCreatingSnippet(true);
        else if (e.code === "KeyN" && e.shiftKey) setIsCreatingFolder(true);
        else if (e.code === "Comma") setIsSettingsOpen(true);
        return;
      }

      if (e.key.startsWith('F') && !isNaN(Number(e.key.replace('F', '')))) {
        e.preventDefault(); e.stopPropagation(); return;
      }

      if (e.code === "Escape") {
        setIsSettingsOpen(false);
        setIsPlaceholderModalOpen(false);
        setFolderToDelete(null);
        setSnippetToDelete(null);
        setContextMenu(null);
        setIconPickerFolderId(null);
        setSnippetToMoveId(null);
      }
    };

    window.addEventListener("keydown", handleGlobalKeys, { capture: true });
    document.addEventListener("keydown", handleGlobalKeys, { capture: true });
    return () => {
      window.removeEventListener("keydown", handleGlobalKeys, { capture: true });
      document.removeEventListener("keydown", handleGlobalKeys, { capture: true });
    };
  }, []);

  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.custom-context-trigger') && !target.closest('.custom-context-menu')) e.preventDefault();
    };
    document.addEventListener("contextmenu", handleContextMenu, { capture: true });
    return () => document.removeEventListener("contextmenu", handleContextMenu, { capture: true });
  }, []);

  const cancelCreateFolder = () => { setIsCreatingFolder(false); setCreateFolderName(""); };
  const cancelCreateSnippet = () => { setIsCreatingSnippet(false); setCreateSnippetName(""); };

  const handleCreateFolderSubmit = async (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && createFolderName.trim()) {
      await addFolder(createFolderName);
      cancelCreateFolder();
      refreshData();
      toast.success("Папка создана");
    }
  };

  const confirmDeleteFolder = async () => {
    if (folderToDelete !== null) {
      await deleteFolder(folderToDelete);
      if (activeFolder === folderToDelete) setActiveFolder(null);
      refreshData();
      toast.error("Папка удалена");
      setFolderToDelete(null);
    }
  };

  const confirmDeleteSnippet = async () => {
    if (snippetToDelete !== null) {
      await deleteSnippet(snippetToDelete);
      if (selected?.id === snippetToDelete) setSelected(null);
      refreshData();
      toast.error("Шаблон удален");
      setSnippetToDelete(null);
    }
  };

  const handleCreateSnippetSubmit = async (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && createSnippetName.trim()) {
      const detectedLang = detectLanguage(createSnippetName);
      const res = await addSnippet(createSnippetName, "", detectedLang, "", "", activeFolder);
      const data = await getAllSnippets();
      setSnippets(data);
      cancelCreateSnippet();
      const newSnippet = data.find((s) => s.id === res.lastInsertId);
      if (newSnippet) handleSelect(newSnippet);
      toast.success("Шаблон создан");
    }
  };

  const handleRenameSubmit = async (e: React.KeyboardEvent, id: number) => {
    if (e.key === "Enter" && renameName.trim()) {
      if (renamingType === "snippet") {
        const snippet = snippets.find((s) => s.id === id);
        if (snippet) {
          await updateSnippet(id, renameName, snippet.code, snippet.language, snippet.tags || "", snippet.description || "", snippet.folder_id);
          const updated = await getAllSnippets();
          setSnippets(updated);
          if (selected?.id === id) setSelected({ ...selected, title: renameName });
        }
      } else if (renamingType === "folder") {
        const db = await import("@/lib/db").then(m => m.getDb());
        await db.execute("UPDATE folders SET name = $1 WHERE id = $2", [renameName, id]);
        refreshData();
      }
      toast.success("Имя изменено");
      setRenamingId(null);
      setRenamingType(null);
    } else if (e.key === "Escape") {
      setRenamingId(null);
      setRenamingType(null);
    }
  };

  const handleUpdateFolderIcon = async (icon: string) => {
    if (iconPickerFolderId !== null) {
      await updateFolderIcon(iconPickerFolderId, icon);
      refreshData();
      toast.success("Иконка папки обновлена");
      setIconPickerFolderId(null);
    }
  };

  const handleMoveSnippetSubmit = async (folderId: number | null) => {
    if (snippetToMoveId === null) return;
    const snippet = snippets.find(s => s.id === snippetToMoveId);
    if (snippet) {
      await updateSnippet(snippet.id, snippet.title, snippet.code, snippet.language, snippet.tags, snippet.description, folderId);
      refreshData();
      if (selected?.id === snippet.id) {
        setSelected({ ...selected, folder_id: folderId });
      }
      toast.success("Шаблон перемещен");
    }
    setSnippetToMoveId(null);
  };

  // 🔥 НАТИВНЫЙ ЭКСПОРТ
  const handleExport = async () => {
    try {
      const filePath = await save({
        filters: [{ name: 'JSON Backup', extensions: ['json'] }],
        defaultPath: `snippet_manager_backup_${new Date().toISOString().split('T')[0]}.json`
      });

      if (!filePath) return;

      const dataToExport = { snippets, folders };
      const jsonString = JSON.stringify(dataToExport, null, 2);

      await writeTextFile(filePath, jsonString);
      toast.success("Бэкап успешно сохранен!");
    } catch (err) {
      console.error(err);
      toast.error("Ошибка при сохранении файла");
    }
  };

  // 🔥 НАТИВНЫЙ ИМПОРТ
  const handleImport = async () => {
    try {
      const filePath = await open({
        multiple: false,
        filters: [{ name: 'JSON Backup', extensions: ['json'] }]
      });

      if (!filePath) return;

      const fileContent = await readTextFile(filePath as string);
      const parsedData = JSON.parse(fileContent);

      if (!parsedData.snippets || !parsedData.folders) throw new Error("Неверный формат файла");

      const db = await import("@/lib/db").then(m => m.getDb());
      await db.execute("DELETE FROM snippets");
      await db.execute("DELETE FROM folders");

      for (const folder of parsedData.folders) {
        await db.execute("INSERT INTO folders (id, name, icon) VALUES ($1, $2, $3)", [folder.id, folder.name, folder.icon || ""]);
      }
      for (const snippet of parsedData.snippets) {
        await db.execute("INSERT INTO snippets (id, title, code, language, tags, description, folder_id) VALUES ($1, $2, $3, $4, $5, $6, $7)", [snippet.id, snippet.title, snippet.code, snippet.language, snippet.tags || "", snippet.description || "", snippet.folder_id || null]);
      }

      await refreshData();
      setSelected(null);
      toast.success("Импорт успешно завершен!");
    } catch (err) {
      console.error(err);
      toast.error("Ошибка при импорте. Проверьте файл.");
    }
  };

  const handleCopy = () => {
    const matches = [...code.matchAll(/\{\{(.*?)\}\}/g)];
    if (matches.length > 0) {
      const uniqueKeys = [...new Set(matches.map(m => m[1].trim()))];
      const initialPlaceholders: Record<string, string> = {};
      uniqueKeys.forEach(k => initialPlaceholders[k] = "");
      setPlaceholders(initialPlaceholders);
      setPendingCopyCode(code);
      setIsPlaceholderModalOpen(true);
    } else {
      writeText(code);
      toast.success("Скопировано в буфер!");
    }
  };

  const handleCopyWithPlaceholders = () => {
    let finalCode = pendingCopyCode;
    Object.entries(placeholders).forEach(([key, value]) => {
      finalCode = finalCode.replaceAll(`{{${key}}}`, value || `{{${key}}}`);
    });
    writeText(finalCode);
    toast.success("Скопировано с подстановками!");
    setIsPlaceholderModalOpen(false);
  };

  const handleGistSync = async () => {
    if (!githubToken) return toast.error("Введите токен в настройках!");
    toast.loading("Синхронизация...", { id: "gist" });
    try {
      const dataToSync = { snippets, folders };
      const res = await fetch("https://api.github.com/gists", {
        method: "POST",
        headers: { "Accept": "application/vnd.github+json", "Authorization": `Bearer ${githubToken}`, "X-GitHub-Api-Version": "2022-11-28" },
        body: JSON.stringify({ description: "Snippet Manager Backup", public: false, files: { "snippets_backup.json": { content: JSON.stringify(dataToSync, null, 2) } } })
      });
      if (res.ok) toast.success("Успешно сохранено в Gist!", { id: "gist" });
      else toast.error("Ошибка GitHub. Проверьте токен.", { id: "gist" });
    } catch {
      toast.error("Ошибка сети", { id: "gist" });
    }
  };

  const filteredSnippets = snippets.filter((s) => {
    const matchesFolder = activeFolder === null || s.folder_id === activeFolder;
    const matchesSearch = s.title.toLowerCase().includes(searchQuery.toLowerCase()) || (s.tags && s.tags.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFolder && matchesSearch;
  });

  if (!isAppReady) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-[#09090b] text-white select-none">
        <div className="relative">
          <div className="absolute inset-0 bg-blue-500/30 blur-3xl rounded-full" />
          <Image src="/icon.png" alt="Logo" width={96} height={96} className="relative w-24 h-24 rounded-2xl shadow-[0_0_30px_rgba(59,130,246,0.3)] animate-pulse" />
        </div>
        <h1 className="mt-6 text-xl font-bold tracking-widest uppercase text-zinc-300">Snippet Manager</h1>
        <div className="mt-2 text-xs text-zinc-500 font-mono animate-pulse">Загрузка базы данных...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-background text-foreground overflow-hidden font-sans select-none">
      <Toaster position="bottom-right" theme="system" toastOptions={{ style: { background: 'var(--background)', border: '1px solid var(--border)', color: 'var(--foreground)' } }} />

      <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} onOpenSettings={() => setIsSettingsOpen(true)} />

      <Group orientation="horizontal" className="flex-1 min-h-0">
        <Panel defaultSize="20%" minSize="15%" maxSize="30%">
          <Sidebar
            snippets={filteredSnippets}
            folders={folders}
            selected={selected}
            activeFolder={activeFolder}
            setActiveFolder={setActiveFolder}
            onSelectSnippet={handleSelect}
            onOpenContextMenu={(e, id, type) => { e.preventDefault(); e.stopPropagation(); setContextMenu({ x: e.clientX, y: e.clientY, id, type }); }}

            isCreatingSnippet={isCreatingSnippet}
            setIsCreatingSnippet={setIsCreatingSnippet}
            createSnippetName={createSnippetName}
            setCreateSnippetName={setCreateSnippetName}
            onCreateSnippetSubmit={handleCreateSnippetSubmit}
            onCancelCreateSnippet={cancelCreateSnippet}

            isCreatingFolder={isCreatingFolder}
            setIsCreatingFolder={setIsCreatingFolder}
            createFolderName={createFolderName}
            setCreateFolderName={setCreateFolderName}
            onCreateFolderSubmit={handleCreateFolderSubmit}
            onCancelCreateFolder={cancelCreateFolder}

            renamingId={renamingId}
            renameName={renameName}
            setRenameName={setRenameName}
            onRenameSubmit={handleRenameSubmit}
            setRenamingId={setRenamingId}
            renamingType={renamingType}
          />
        </Panel>

        <Separator className="w-[1px] bg-border hover:bg-primary transition-colors cursor-col-resize" />

        <Panel className="flex flex-col min-w-0">
          {selected ? (
            <EditorPanel
              selected={selected} code={code} setCode={setCode} lang={lang} setLang={setLang}
              tags={tags} setTags={setTags} description={description} setDescription={setDescription}
              activeTab={activeTab} setActiveTab={setActiveTab} isSaved={isSaved}
              onCopy={handleCopy} fontSize={fontSize} wordWrap={wordWrap}
            />
          ) : (
            <div className="flex-1 relative flex flex-col items-center justify-center overflow-hidden bg-background">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
              <div className="relative z-10 flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="relative group">
                  <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-[2rem] blur-2xl opacity-30 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
                  <div className="relative animate-bounce drop-shadow-[0_0_20px_rgba(59,130,246,0.5)]" style={{ animationDuration: '3s' }}>
                    <Image src="/icon.png" alt="App Icon" width={120} height={120} className="rounded-3xl" />
                  </div>
                </div>
                <div className="mt-8 text-center space-y-3">
                  <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-br from-foreground to-muted-foreground bg-clip-text text-transparent">Добро пожаловать!</h2>
                  <p className="text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">Это ваш личный менеджер шаблонов кода. Создайте первый файл, чтобы начать работать.</p>
                </div>
                <div className="mt-8 flex items-center gap-3">
                  <button onClick={() => setIsCreatingSnippet(true)} className="px-6 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg text-sm font-bold transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] flex items-center gap-2 hover:-translate-y-0.5">
                    <Plus className="w-4 h-4" /> Создать шаблон
                  </button>
                  <button onClick={() => setIsSettingsOpen(true)} className="px-6 py-2.5 bg-muted hover:bg-muted/80 text-foreground rounded-lg text-sm font-semibold transition-all flex items-center gap-2 border border-border hover:-translate-y-0.5">
                    <Settings className="w-4 h-4" /> Настройки
                  </button>
                </div>
              </div>
            </div>
          )}
        </Panel>
      </Group>

      <SettingsModal
        isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)}
        fontSize={fontSize} setFontSize={setFontSize} wordWrap={wordWrap} setWordWrap={setWordWrap}
        githubToken={githubToken} setGithubToken={setGithubToken} onGistSync={handleGistSync}
        onExport={handleExport} onImport={handleImport}
      />

      <PlaceholderModal isOpen={isPlaceholderModalOpen} onClose={() => setIsPlaceholderModalOpen(false)} placeholders={placeholders} setPlaceholders={setPlaceholders} onCopy={handleCopyWithPlaceholders} />

      <IconPickerModal isOpen={iconPickerFolderId !== null} onClose={() => setIconPickerFolderId(null)} onSelect={handleUpdateFolderIcon} currentIcon={folders.find(f => f.id === iconPickerFolderId)?.icon || ""} />

      <MoveFolderModal isOpen={snippetToMoveId !== null} onClose={() => setSnippetToMoveId(null)} folders={folders} currentFolderId={snippets.find(s => s.id === snippetToMoveId)?.folder_id || null} onSelect={handleMoveSnippetSubmit} />

      <ConfirmModal isOpen={folderToDelete !== null} title="Удалить папку?" message="Вы уверены, что хотите удалить эту папку? Все шаблоны внутри неё останутся в разделе 'Все шаблоны'." onConfirm={confirmDeleteFolder} onCancel={() => setFolderToDelete(null)} />

      <ConfirmModal isOpen={snippetToDelete !== null} title="Удалить шаблон?" message="Вы уверены, что хотите безвозвратно удалить этот шаблон?" onConfirm={confirmDeleteSnippet} onCancel={() => setSnippetToDelete(null)} />

      <ContextMenu
        contextMenu={contextMenu}
        onRename={(id) => {
          if (contextMenu?.type === "folder") {
            const f = folders.find(x => x.id === id);
            if (f) { setRenameName(f.name); setRenamingId(id); setRenamingType("folder"); }
          } else {
            const s = snippets.find(x => x.id === id);
            if (s) { setRenameName(s.title); setRenamingId(id); setRenamingType("snippet"); }
          }
          setContextMenu(null);
        }}
        onDelete={(id) => {
          if (contextMenu?.type === "folder") setFolderToDelete(id);
          else setSnippetToDelete(id);
          setContextMenu(null);
        }}
        onChangeIcon={(id) => { setIconPickerFolderId(id); setContextMenu(null); }}
        onMove={(id) => { setSnippetToMoveId(id); setContextMenu(null); }}
      />
    </div>
  );
}
