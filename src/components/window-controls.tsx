"use client";

import { useState, useEffect } from "react";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { Minus, Square, Copy, X } from "lucide-react";

export function WindowControls() {
  const [isMaximized, setIsMaximized] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const appWindow = getCurrentWindow();
    appWindow.isMaximized().then(setIsMaximized);
    const unlisten = appWindow.onResized(async () => setIsMaximized(await appWindow.isMaximized()));
    return () => { unlisten.then((f) => f()); };
  }, []);

  const minimize = () => typeof window !== "undefined" && getCurrentWindow().minimize();
  const toggleMaximize = () => typeof window !== "undefined" && getCurrentWindow().toggleMaximize();
  const close = () => typeof window !== "undefined" && getCurrentWindow().close();

  return (
    <div className="flex items-center h-full gap-1 ml-2">
      <button
        onClick={minimize}
        className="h-7 w-8 flex items-center justify-center rounded-md text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 transition-all duration-150"
        title="Свернуть"
      >
        <Minus className="w-3.5 h-3.5" />
      </button>

      <button
        onClick={toggleMaximize}
        className="h-7 w-8 flex items-center justify-center rounded-md text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 transition-all duration-150"
        title={isMaximized ? "Восстановить" : "Развернуть"}
      >
        {isMaximized ? <Copy className="w-3 h-3" /> : <Square className="w-3 h-3" />}
      </button>

      <button
        onClick={close}
        className="h-7 w-8 flex items-center justify-center rounded-md text-zinc-400 hover:bg-red-500/90 hover:text-white transition-all duration-150"
        title="Закрыть"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
