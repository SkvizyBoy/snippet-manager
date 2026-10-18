import { LANGUAGES } from "@/lib/constants";
import { type Snippet } from "@/lib/db";
import { ChevronDown, Code, Copy, Eye, FileText } from "lucide-react";
import { useTheme } from "next-themes";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { LanguageIcon } from "./LanguageIcon";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

interface EditorPanelProps {
    selected: Snippet;
    code: string;
    setCode: (v: string) => void;
    lang: string;
    setLang: (v: string) => void;
    tags: string;
    setTags: (v: string) => void;
    description: string;
    setDescription: (v: string) => void;
    activeTab: "code" | "preview" | "description";
    setActiveTab: (v: "code" | "preview" | "description") => void;
    isSaved: boolean;
    onCopy: () => void;
    fontSize: number;
    wordWrap: "on" | "off";
}

export function EditorPanel(props: EditorPanelProps) {
    const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
    const langMenuRef = useRef<HTMLDivElement>(null);
    const { resolvedTheme } = useTheme();

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (langMenuRef.current && !langMenuRef.current.contains(e.target as Node)) {
                setIsLangMenuOpen(false);
            }
        };
        window.addEventListener("click", handleClick);
        return () => window.removeEventListener("click", handleClick);
    }, []);

    return (
        <div className="flex flex-col h-full animate-in fade-in duration-200 bg-background">
            <div className="flex items-center justify-between px-3 py-2 border-b border-border shrink-0">
                <div className="flex gap-2 items-center flex-wrap">

                    <div className="relative" ref={langMenuRef}>
                        <button
                            onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                            className="flex items-center h-8 px-3 rounded-md bg-muted/50 hover:bg-muted border border-border transition-all text-[12px] font-medium shadow-sm text-foreground"
                        >
                            <div className="mr-2 flex items-center justify-center">
                                <LanguageIcon language={props.lang} />
                            </div>
                            <span className="mr-2">
                                {LANGUAGES.find(l => l.value === props.lang)?.label || props.lang}
                            </span>
                            <ChevronDown className={`w-3.5 h-3.5 text-muted-foreground transition-transform duration-200 ${isLangMenuOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {isLangMenuOpen && (
                            <div className="absolute top-full left-0 mt-1 w-48 max-h-64 overflow-y-auto bg-popover border border-border rounded-lg shadow-xl py-1 z-50 animate-in fade-in zoom-in-95 duration-100 custom-scrollbar">
                                {LANGUAGES.map((l) => (
                                    <button
                                        key={l.value}
                                        onClick={() => { props.setLang(l.value); setIsLangMenuOpen(false); }}
                                        className={`w-full text-left px-3 py-1.5 text-[12px] transition-colors flex items-center justify-between ${props.lang === l.value ? 'bg-accent text-accent-foreground font-medium' : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'
                                            }`}
                                    >
                                        <div className="flex items-center gap-2">
                                            <LanguageIcon language={l.value} />
                                            {l.label}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="flex bg-muted/30 rounded-lg p-1 border border-border/50 ml-2">
                        <button onClick={() => props.setActiveTab("code")} className={`px-3 py-1 rounded-md text-[12px] font-medium flex items-center gap-1.5 transition-colors ${props.activeTab === 'code' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}><Code className="w-3.5 h-3.5" /> Код</button>
                        <button onClick={() => props.setActiveTab("description")} className={`px-3 py-1 rounded-md text-[12px] font-medium flex items-center gap-1.5 transition-colors ${props.activeTab === 'description' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}><FileText className="w-3.5 h-3.5" /> Описание</button>
                        {props.lang === "markdown" && (
                            <button onClick={() => props.setActiveTab("preview")} className={`px-3 py-1 rounded-md text-[12px] font-medium flex items-center gap-1.5 transition-colors ${props.activeTab === 'preview' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}><Eye className="w-3.5 h-3.5" /> Превью</button>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 ml-2">
                    <button onClick={props.onCopy} className="text-[12px] font-medium text-primary hover:text-primary/80 flex items-center gap-1.5 transition-colors"><Copy className="w-3.5 h-3.5" /> Копировать</button>
                    <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">{props.isSaved ? 'Сохранено' : 'Сохранение...'}</div>
                </div>
            </div>

            <div className="flex-1 relative min-h-0">
                {props.activeTab === "code" && (
                    <MonacoEditor
                        height="100%"
                        language={props.lang}
                        theme={resolvedTheme === "dark" ? "true-dark" : "light"}
                        value={props.code}
                        onChange={(val) => props.setCode(val || "")}
                        beforeMount={(monaco) => {
                            monaco.editor.defineTheme("true-dark", { base: "vs-dark", inherit: true, rules: [], colors: { "editor.background": "#09090b", "editor.lineHighlightBackground": "#18181b", "editorLineNumber.foreground": "#3f3f46" } });
                        }}
                        options={{
                            minimap: { enabled: false }, fontSize: props.fontSize, wordWrap: props.wordWrap, padding: { top: 16 }, automaticLayout: true, autoIndent: "full", tabSize: 4,
                            contextmenu: false
                        }}
                    />
                )}

                {props.activeTab === "description" && (
                    <div className="w-full h-full p-8 overflow-y-auto custom-scrollbar bg-background">
                        <div className="max-w-3xl mx-auto space-y-4">
                            <h3 className="text-xl font-bold text-foreground mb-2">Заметки к шаблону</h3>
                            <textarea
                                value={props.description}
                                onChange={(e) => props.setDescription(e.target.value)}
                                placeholder="Опишите, для чего нужен этот код, какие есть зависимости..."
                                className="w-full h-[500px] bg-transparent text-foreground outline-none resize-none text-base leading-relaxed font-sans placeholder:text-muted-foreground"
                            />
                        </div>
                    </div>
                )}

                {props.activeTab === "preview" && props.lang === "markdown" && (
                    <div className="w-full h-full p-8 overflow-y-auto prose dark:prose-invert max-w-none bg-background">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{props.code}</ReactMarkdown>
                    </div>
                )}
            </div>
        </div>
    );
}
