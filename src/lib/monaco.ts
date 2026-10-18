export const setupMonacoWorkers = () => {
    if (typeof window !== "undefined") {
        (window as unknown as { MonacoEnvironment: unknown }).MonacoEnvironment = {
            getWorker(_: string, label: string) {
                if (label === "json") return new Worker(new URL("monaco-editor/language/json/json.worker.js", import.meta.url));
                if (label === "css" || label === "scss" || label === "less") return new Worker(new URL("monaco-editor/language/css/css.worker.js", import.meta.url));
                if (label === "html" || label === "handlebars" || label === "razor") return new Worker(new URL("monaco-editor/language/html/html.worker.js", import.meta.url));
                if (label === "typescript" || label === "javascript") return new Worker(new URL("monaco-editor/language/typescript/ts.worker.js", import.meta.url));
                return new Worker(new URL("monaco-editor/editor/editor.worker.js", import.meta.url));
            },
        };
    }
};
