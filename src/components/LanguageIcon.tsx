import { FileCode2 } from "lucide-react";
import {
    SiCplusplus,
    SiCss,
    SiDocker,
    SiGnubash,
    SiGo,
    SiHtml5,
    SiJavascript,
    SiJson,
    SiKotlin,
    SiMarkdown, SiMysql,
    SiPhp,
    SiPython,
    SiRuby,
    SiRust,
    SiSharp,
    SiSwift,
    SiTypescript,
    SiYaml
} from "react-icons/si";

export const LanguageIcon = ({ language }: { language: string }) => {
    switch (language) {
        case "python": return <SiPython className="w-4 h-4 text-[#3776AB]" />;
        case "html": return <SiHtml5 className="w-4 h-4 text-[#E34F26]" />;
        case "css": return <SiCss className="w-4 h-4 text-[#1572B6]" />;
        case "javascript": return <SiJavascript className="w-4 h-4 text-[#F7DF1E]" />;
        case "typescript": return <SiTypescript className="w-4 h-4 text-[#3178C6]" />;
        case "rust": return <SiRust className="w-4 h-4 text-[#CE422B]" />;
        case "cpp": return <SiCplusplus className="w-4 h-4 text-[#00599C]" />;
        case "csharp": return <SiSharp className="w-4 h-4 text-[#239120]" />;
        case "go": return <SiGo className="w-4 h-4 text-[#00ADD8]" />;
        case "php": return <SiPhp className="w-4 h-4 text-[#777BB4]" />;
        case "ruby": return <SiRuby className="w-4 h-4 text-[#CC342D]" />;
        case "swift": return <SiSwift className="w-4 h-4 text-[#F05138]" />;
        case "kotlin": return <SiKotlin className="w-4 h-4 text-[#7F52FF]" />;
        case "json": return <SiJson className="w-4 h-4 text-[#FAF0E6]" />;
        case "yaml": return <SiYaml className="w-4 h-4 text-[#CB171E]" />;
        case "markdown": return <SiMarkdown className="w-4 h-4 text-[#FFFFFF]" />;
        case "sql": return <SiMysql className="w-4 h-4 text-[#4479A1]" />;
        case "bash": return <SiGnubash className="w-4 h-4 text-[#4EAA25]" />;
        case "dockerfile": return <SiDocker className="w-4 h-4 text-[#2496ED]" />;
        default: return <FileCode2 className="w-4 h-4 text-zinc-500" />;
    }
};
