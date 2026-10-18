import { LANGUAGES } from "@/lib/constants";
import {
    Check,
    Command,
    Database, Download,
    ExternalLink,
    Eye, EyeOff,
    Folder,
    FolderInput,
    FolderOpen,
    Info,
    Moon,
    Palette,
    RotateCw,
    Settings,
    ShieldCheck,
    Sun,
    Upload,
    X
} from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import { useState } from "react";
import { SiGithub } from "react-icons/si";
import { LanguageIcon } from "./LanguageIcon";

// --- 1. НАСТРОЙКИ ---
interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    fontSize: number;
    setFontSize: (v: number) => void;
    wordWrap: "on" | "off";
    setWordWrap: (v: "on" | "off") => void;
    githubToken: string;
    setGithubToken: (v: string) => void;
    onGistSync: () => void;
    onExport: () => void;
    onImport: () => void; // <-- Теперь без event
}

export function SettingsModal(props: SettingsModalProps) {
    const [showToken, setShowToken] = useState(false);
    const [activeTab, setActiveTab] = useState<"general" | "appearance" | "git" | "data" | "hotkeys" | "about">("general");
    const { theme, setTheme } = useTheme();

    if (!props.isOpen) return null;

    const navItems = [
        { id: "general", label: "Общее", icon: <Settings className="w-4 h-4" /> },
        { id: "appearance", label: "Стиль", icon: <Palette className="w-4 h-4" /> },
        { id: "git", label: "Git & GitHub", icon: <SiGithub className="w-4 h-4" /> },
        { id: "data", label: "Данные (Бэкап)", icon: <Database className="w-4 h-4" /> },
        { id: "hotkeys", label: "Горячие клавиши", icon: <Command className="w-4 h-4" /> },
        { id: "about", label: "Информация", icon: <Info className="w-4 h-4" /> },
    ] as const;

    return (
        <div className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-center justify-center animate-in fade-in p-8">
            <div className="bg-background border border-border rounded-2xl shadow-2xl w-full max-w-5xl h-[650px] flex overflow-hidden relative">

                <button onClick={props.onClose} className="absolute top-4 right-4 z-50 p-2 rounded-lg bg-muted/50 border border-border text-muted-foreground hover:text-red-500 hover:bg-red-500/10 hover:border-red-500/20 transition-all duration-200 shadow-sm">
                    <X className="w-5 h-5" />
                </button>

                <div className="w-64 bg-muted/30 border-r border-border flex flex-col py-6">
                    <div className="px-6 mb-6">
                        <h2 className="text-sm font-bold text-foreground tracking-wide uppercase">Настройки</h2>
                    </div>

                    <div className="space-y-1 px-3">
                        {navItems.map(item => (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all duration-200 ${activeTab === item.id
                                    ? 'bg-primary/10 text-primary shadow-[inset_2px_0_0_0_#3b82f6]'
                                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                    }`}
                            >
                                {item.icon} {item.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex-1 p-10 overflow-y-auto custom-scrollbar bg-background">

                    {activeTab === "general" && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <div>
                                <h3 className="text-xl font-bold text-foreground mb-1">Общие настройки</h3>
                                <p className="text-sm text-muted-foreground">Настройте редактор под себя для максимальной продуктивности.</p>
                            </div>

                            <div className="space-y-6 max-w-lg">
                                <div className="p-5 rounded-xl border border-border bg-card">
                                    <label className="text-sm font-semibold text-foreground mb-3 block">Размер шрифта редактора</label>
                                    <div className="flex items-center gap-4">
                                        <input type="range" min="12" max="24" value={props.fontSize} onChange={(e) => props.setFontSize(Number(e.target.value))} className="flex-1 accent-primary cursor-pointer" />
                                        <span className="text-sm font-mono text-primary bg-primary/10 px-3 py-1 rounded-md border border-primary/20 min-w-[60px] text-center">{props.fontSize}px</span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between p-5 rounded-xl border border-border bg-card">
                                    <div>
                                        <span className="text-sm font-semibold text-foreground block mb-1">Перенос строк</span>
                                        <span className="text-xs text-muted-foreground">Автоматически переносить длинные строки кода</span>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" checked={props.wordWrap === "on"} onChange={(e) => props.setWordWrap(e.target.checked ? "on" : "off")} className="sr-only peer" />
                                        <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                    </label>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "appearance" && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <div>
                                <h3 className="text-xl font-bold text-foreground mb-1">Стиль и темы</h3>
                                <p className="text-sm text-muted-foreground">Выберите оформление интерфейса.</p>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <button onClick={() => setTheme("dark")} className={`relative p-6 rounded-xl border-2 flex flex-col items-center justify-center gap-4 transition-all duration-200 group ${theme === 'dark' ? 'border-primary bg-primary/5' : 'border-border hover:border-muted-foreground/50 bg-card'}`}>
                                    <div className={`p-3 rounded-full ${theme === 'dark' ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground group-hover:text-foreground'}`}><Moon className="w-8 h-8" /></div>
                                    <div className="text-center"><span className="text-sm font-bold text-foreground block mb-1">True Black</span><span className="text-xs text-muted-foreground">Глубокий черный</span></div>
                                    {theme === 'dark' && <div className="absolute top-3 right-3 bg-primary rounded-full p-0.5"><Check className="w-4 h-4 text-primary-foreground" /></div>}
                                </button>
                                <button onClick={() => setTheme("light")} className={`relative p-6 rounded-xl border-2 flex flex-col items-center justify-center gap-4 transition-all duration-200 group ${theme === 'light' ? 'border-orange-500 bg-orange-500/5' : 'border-border hover:border-muted-foreground/50 bg-card'}`}>
                                    <div className={`p-3 rounded-full ${theme === 'light' ? 'bg-orange-500/20 text-orange-500' : 'bg-muted text-muted-foreground group-hover:text-foreground'}`}><Sun className="w-8 h-8" /></div>
                                    <div className="text-center"><span className="text-sm font-bold text-foreground block mb-1">Светлая</span><span className="text-xs text-muted-foreground">Классический белый</span></div>
                                    {theme === 'light' && <div className="absolute top-3 right-3 bg-orange-500 rounded-full p-0.5"><Check className="w-4 h-4 text-white" /></div>}
                                </button>
                            </div>
                        </div>
                    )}

                    {activeTab === "git" && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <div>
                                <h3 className="text-xl font-bold text-foreground mb-1">Синхронизация с GitHub</h3>
                                <p className="text-sm text-muted-foreground">Сохраняйте шаблоны в облако и восстанавливайте на любом устройстве.</p>
                            </div>

                            <div className="space-y-6 max-w-xl">
                                <div className="p-5 rounded-xl border border-border bg-card space-y-4">
                                    <div className="flex items-start justify-between">
                                        <div><label className="text-sm font-semibold text-foreground block mb-1">Personal Access Token</label><p className="text-xs text-muted-foreground">Требуются права доступа к Gists.</p></div>
                                        <a href="https://github.com/settings/tokens/new?scopes=gist&description=Snippet+Manager" target="_blank" rel="noreferrer" className="text-xs font-medium text-primary hover:text-primary/80 flex items-center gap-1.5 bg-primary/10 px-3 py-1.5 rounded-md hover:bg-primary/20 transition-colors">Получить токен <ExternalLink className="w-3.5 h-3.5" /></a>
                                    </div>
                                    <div className="relative">
                                        <input type={showToken ? "text" : "password"} placeholder="ghp_xxxxxxxxxxxxxxxxxxxx" value={props.githubToken} onChange={(e) => props.setGithubToken(e.target.value)} className="w-full bg-background border border-input rounded-lg pl-4 pr-12 py-3 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-mono text-foreground placeholder:text-muted-foreground" />
                                        <button onClick={() => setShowToken(!showToken)} className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors">{showToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>
                                    </div>
                                </div>
                                <button onClick={props.onGistSync} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg py-3 text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary/20 hover:shadow-primary/40"><RotateCw className="w-4 h-4" /> Синхронизировать сейчас</button>
                            </div>
                        </div>
                    )}

                    {activeTab === "data" && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <div>
                                <h3 className="text-xl font-bold text-foreground mb-1">Управление данными</h3>
                                <p className="text-sm text-muted-foreground">Резервное копирование и восстановление вашей базы шаблонов.</p>
                            </div>

                            <div className="grid grid-cols-2 gap-6 max-w-2xl">
                                <div className="p-6 rounded-xl border border-border bg-card flex flex-col items-center text-center gap-4 hover:border-primary/50 transition-colors group">
                                    <div className="p-4 bg-primary/10 rounded-full text-primary group-hover:scale-110 transition-transform"><Download className="w-8 h-8" /></div>
                                    <div>
                                        <h4 className="text-base font-bold text-foreground mb-1">Экспорт данных</h4>
                                        <p className="text-xs text-muted-foreground leading-relaxed">Сохраните все ваши папки и шаблоны в один <code className="bg-muted px-1 py-0.5 rounded text-primary">.json</code> файл.</p>
                                    </div>
                                    <button onClick={props.onExport} className="mt-2 w-full py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg text-sm font-bold transition-all shadow-md">Скачать бэкап</button>
                                </div>

                                <div className="p-6 rounded-xl border border-border bg-card flex flex-col items-center text-center gap-4 hover:border-emerald-500/50 transition-colors group">
                                    <div className="p-4 bg-emerald-500/10 rounded-full text-emerald-500 group-hover:scale-110 transition-transform"><Upload className="w-8 h-8" /></div>
                                    <div>
                                        <h4 className="text-base font-bold text-foreground mb-1">Импорт данных</h4>
                                        <p className="text-xs text-muted-foreground leading-relaxed">Восстановите базу из файла. Текущие данные будут перезаписаны.</p>
                                    </div>
                                    <button onClick={props.onImport} className="mt-2 w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-bold transition-all shadow-md cursor-pointer block">
                                        Загрузить бэкап
                                    </button>
                                </div>
                            </div>

                            <div className="p-4 rounded-lg bg-orange-500/5 border border-orange-500/10 flex items-start gap-3 max-w-2xl mt-4">
                                <ShieldCheck className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                                <p className="text-xs text-orange-500/80 leading-relaxed"><strong>Внимание!</strong> При импорте файла все текущие шаблоны будут удалены и заменены теми, что находятся в файле. Рекомендуется сначала сделать экспорт текущей версии.</p>
                            </div>
                        </div>
                    )}

                    {activeTab === "hotkeys" && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <div><h3 className="text-xl font-bold text-foreground mb-1">Горячие клавиши</h3><p className="text-sm text-muted-foreground">Управляйте приложением, не отрывая рук от клавиатуры.</p></div>
                            <div className="space-y-3 max-w-xl">
                                {[{ keys: "Ctrl + N", action: "Создать новый шаблон" }, { keys: "Ctrl + Shift + N", action: "Создать новую папку" }, { keys: "Ctrl + F", action: "Поиск по шаблонам" }, { keys: "Ctrl + ,", action: "Открыть настройки" }, { keys: "Esc", action: "Закрыть окно / Отменить действие" }].map((hk, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-card border border-border hover:bg-muted/50 transition-colors"><span className="text-sm text-foreground font-medium">{hk.action}</span><kbd className="px-3 py-1.5 bg-background border border-border rounded-md text-xs font-mono text-muted-foreground shadow-sm tracking-widest">{hk.keys}</kbd></div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === "about" && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300 flex flex-col items-center justify-center h-full text-center">
                            <div className="mb-2 shadow-2xl rounded-3xl overflow-hidden animate-in zoom-in duration-500"><Image src="/icon.png" alt="App Icon" width={96} height={96} className="object-cover" /></div>
                            <div><h2 className="text-3xl font-extrabold text-foreground tracking-tight">Snippet Manager</h2><p className="text-sm text-primary font-mono mt-2">v1.0.0 Ultimate Edition</p></div>
                            <p className="text-sm text-muted-foreground max-w-md leading-relaxed">Премиальный менеджер шаблонов кода, созданный для максимальной продуктивности разработчиков. Построен на базе ультрасовременного стека Tauri v2 + Next.js.</p>
                            <div className="flex gap-4 mt-8">
                                <a href="https://t.me/Skvizy_dev" target="_blank" rel="noreferrer" className="flex items-center gap-2 px-6 py-3 bg-card hover:bg-muted border border-border rounded-xl text-sm font-medium text-foreground transition-all shadow-sm"><span className="text-[#2AABEE] font-bold">TG</span> Telegram</a>
                                <a href="https://github.com/SkvizyBoy" target="_blank" rel="noreferrer" className="flex items-center gap-2 px-6 py-3 bg-card hover:bg-muted border border-border rounded-xl text-sm font-medium text-foreground transition-all shadow-sm"><SiGithub className="w-5 h-5" /> GitHub</a>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// --- 2. PLACEHOLDER MODAL ---
interface PlaceholderModalProps {
    isOpen: boolean;
    onClose: () => void;
    placeholders: Record<string, string>;
    setPlaceholders: (v: Record<string, string>) => void;
    onCopy: () => void;
}

export function PlaceholderModal(props: PlaceholderModalProps) {
    if (!props.isOpen) return null;
    return (
        <div className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-center justify-center animate-in fade-in">
            <div className="bg-background border border-border rounded-xl shadow-2xl w-[400px] p-6 space-y-4">
                <h2 className="text-lg font-bold text-foreground">Заполните переменные</h2>
                <p className="text-xs text-muted-foreground">В коде найдены плейсхолдеры. Заполните их перед копированием.</p>
                <div className="space-y-3 max-h-60 overflow-y-auto custom-scrollbar pr-1">
                    {Object.keys(props.placeholders).map((key) => (
                        <div key={key}>
                            <label className="text-[11px] text-primary font-mono font-semibold">{`{{${key}}}`}</label>
                            <input autoFocus value={props.placeholders[key]} onChange={(e) => props.setPlaceholders({ ...props.placeholders, [key]: e.target.value })} className="w-full mt-1 bg-card border border-border rounded-md px-3 py-1.5 text-sm text-foreground outline-none focus:border-primary transition-colors" />
                        </div>
                    ))}
                </div>
                <div className="flex gap-2 justify-end pt-4">
                    <button onClick={props.onClose} className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">Отмена</button>
                    <button onClick={props.onCopy} className="px-4 py-2 text-sm bg-primary hover:bg-primary/90 text-primary-foreground rounded-md transition-colors font-medium">Копировать</button>
                </div>
            </div>
        </div>
    );
}

// --- 3. ICON PICKER MODAL ---
interface IconPickerModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (icon: string) => void;
    currentIcon: string;
}

export function IconPickerModal(props: IconPickerModalProps) {
    if (!props.isOpen) return null;
    return (
        <div className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-center justify-center animate-in fade-in">
            <div className="bg-background border border-border rounded-xl shadow-2xl w-[500px] p-6 space-y-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-lg font-bold text-foreground">Иконка папки</h2>
                    <button onClick={props.onClose} className="text-muted-foreground hover:text-foreground"><X className="w-5 h-5" /></button>
                </div>
                <p className="text-xs text-muted-foreground">Выберите иконку, которая будет отображаться рядом с названием папки.</p>
                <div className="grid grid-cols-5 gap-3 max-h-[300px] overflow-y-auto custom-scrollbar p-1">
                    <button onClick={() => { props.onSelect(""); props.onClose(); }} className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all ${props.currentIcon === "" ? 'bg-primary/20 border-primary' : 'bg-card border-border hover:bg-muted'}`}>
                        <FolderOpen className="w-6 h-6 text-yellow-500 mb-2" /><span className="text-[10px] text-center text-muted-foreground">Папка</span>
                    </button>
                    {LANGUAGES.map((l) => (
                        <button key={l.value} onClick={() => { props.onSelect(l.value); props.onClose(); }} className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all ${props.currentIcon === l.value ? 'bg-primary/20 border-primary' : 'bg-card border-border hover:bg-muted'}`}>
                            <div className="mb-2"><LanguageIcon language={l.value} /></div><span className="text-[10px] text-center text-muted-foreground truncate w-full">{l.label}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

// --- 4. MOVE FOLDER MODAL ---
interface MoveFolderModalProps {
    isOpen: boolean;
    onClose: () => void;
    folders: { id: number, name: string, icon: string }[];
    currentFolderId: number | null;
    onSelect: (id: number | null) => void;
}

export function MoveFolderModal({ isOpen, onClose, folders, currentFolderId, onSelect }: MoveFolderModalProps) {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-center justify-center animate-in fade-in">
            <div className="bg-background border border-border rounded-xl shadow-2xl w-[400px] p-6 space-y-4">
                <div className="flex justify-between items-center mb-2">
                    <h2 className="text-lg font-bold text-foreground flex items-center gap-2"><FolderInput className="w-5 h-5" /> Переместить</h2>
                    <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X className="w-5 h-5" /></button>
                </div>
                <p className="text-xs text-muted-foreground mb-4">Выберите папку, в которую хотите переместить этот шаблон.</p>
                <div className="space-y-1 max-h-[300px] overflow-y-auto custom-scrollbar pr-1">
                    <button onClick={() => onSelect(null)} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all border ${currentFolderId === null ? 'bg-primary/10 border-primary text-primary font-medium' : 'bg-card border-border hover:bg-muted text-foreground'}`}>
                        <Folder className="w-4 h-4" /> Без папки (Корень)
                    </button>
                    {folders.map(f => (
                        <button key={f.id} onClick={() => onSelect(f.id)} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all border ${currentFolderId === f.id ? 'bg-primary/10 border-primary text-primary font-medium' : 'bg-card border-border hover:bg-muted text-foreground'}`}>
                            {f.icon ? <LanguageIcon language={f.icon} /> : <FolderOpen className="w-4 h-4 text-yellow-500" />}
                            <span className="truncate">{f.name}</span>
                        </button>
                    ))}
                </div>
                <div className="flex justify-end pt-4"><button onClick={onClose} className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">Отмена</button></div>
            </div>
        </div>
    );
}
