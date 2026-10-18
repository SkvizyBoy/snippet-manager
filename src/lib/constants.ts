export const LANGUAGES = [
    { value: "typescript", label: "TypeScript" }, { value: "javascript", label: "JavaScript" },
    { value: "python", label: "Python" }, { value: "rust", label: "Rust" },
    { value: "html", label: "HTML" }, { value: "css", label: "CSS" },
    { value: "cpp", label: "C++" }, { value: "csharp", label: "C#" },
    { value: "java", label: "Java" }, { value: "go", label: "Go" },
    { value: "php", label: "PHP" }, { value: "ruby", label: "Ruby" },
    { value: "swift", label: "Swift" }, { value: "kotlin", label: "Kotlin" },
    { value: "json", label: "JSON" }, { value: "yaml", label: "YAML" },
    { value: "xml", label: "XML" }, { value: "markdown", label: "Markdown" },
    { value: "sql", label: "SQL" }, { value: "bash", label: "Bash/Shell" },
    { value: "dockerfile", label: "Dockerfile" },
];

export const detectLanguage = (filename: string) => {
    const lower = filename.toLowerCase();
    if (lower.includes("python") || lower.endsWith(".py")) return "python";
    if (lower.includes("rust") || lower.endsWith(".rs")) return "rust";
    if (lower.includes("html") || lower.endsWith(".html")) return "html";
    if (lower.includes("css") || lower.endsWith(".css")) return "css";
    if (lower.includes("js") || lower.endsWith(".js")) return "javascript";
    if (lower.includes("ts") || lower.endsWith(".ts")) return "typescript";
    return "typescript";
};
