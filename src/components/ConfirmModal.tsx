import { AlertTriangle } from "lucide-react";

interface ConfirmModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
}

export function ConfirmModal({ isOpen, title, message, onConfirm, onCancel }: ConfirmModalProps) {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-center justify-center animate-in fade-in">
            <div className="bg-[#18181b] border border-zinc-800 rounded-xl shadow-2xl w-96 p-6 space-y-4">
                <div className="flex items-center gap-3 text-red-500">
                    <div className="p-2 bg-red-500/10 rounded-full">
                        <AlertTriangle className="w-6 h-6" />
                    </div>
                    <h2 className="text-lg font-bold text-white">{title}</h2>
                </div>
                <p className="text-sm text-zinc-400">{message}</p>
                <div className="flex gap-2 justify-end pt-2">
                    <button onClick={onCancel} className="px-4 py-2 text-sm text-zinc-400 hover:text-white transition-colors">Отмена</button>
                    <button onClick={onConfirm} className="px-4 py-2 text-sm bg-red-600 hover:bg-red-500 text-white rounded-md transition-colors">Удалить</button>
                </div>
            </div>
        </div>
    );
}
