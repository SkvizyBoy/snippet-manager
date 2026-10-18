import { Search, Settings } from "lucide-react";
import Image from "next/image"; // <-- ДОБАВЛЕН ИМПОРТ
import { WindowControls } from "@/components/window-controls";

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  onOpenSettings: () => void;
}

export function Header({ searchQuery, setSearchQuery, onOpenSettings }: HeaderProps) {
  return (
    <header className="flex items-center justify-between h-12 bg-background border-b border-border px-4 z-50 shrink-0">
      <div data-tauri-drag-region className="flex items-center gap-2.5 font-semibold text-sm w-1/3 text-foreground">
        <Image
          src="/icon.png"
          alt="Logo"
          width={24}
          height={24}
          className="rounded-md shadow-sm"
        />
        <span>Snippet Manager</span>
      </div>

      <div className="w-1/3 flex justify-center" data-tauri-drag-region>
        <div className="relative w-full max-w-[320px] group">
          <Search className="absolute left-2.5 top-1.5 h-3.5 w-3.5 text-muted-foreground" />
          <input
            id="global-search"
            placeholder="Поиск (Ctrl+F)..."
            className="w-full bg-muted/50 text-foreground text-xs rounded-md px-2.5 py-1.5 pl-8 outline-none border border-border focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-muted-foreground"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="flex items-center justify-end h-full w-1/3 gap-2">
        <button onClick={onOpenSettings} className="p-1.5 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors" title="Настройки (Ctrl+,)">
          <Settings className="w-4 h-4" />
        </button>
        <WindowControls />
      </div>
    </header>
  );
}
