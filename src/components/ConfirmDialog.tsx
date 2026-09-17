import { useEffect, useRef } from "react";
import { AlertTriangle, X } from "lucide-react";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "default";
  onConfirm: () => void;
  onCancel: () => void;
  requireText?: string;
}

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmText = "确认",
  cancelText = "取消",
  variant = "danger",
  onConfirm,
  onCancel,
  requireText,
}: ConfirmDialogProps) {
  const confirmInputRef = useRef<HTMLInputElement>(null);
  const confirmBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onCancel();
      } else if (e.key === "Enter" && (!requireText || (confirmInputRef.current?.value === requireText))) {
        onConfirm();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, requireText, onConfirm, onCancel]);

  if (!open) return null;

  const isDanger = variant === "danger";
  const requireTextMatched = !requireText || confirmInputRef.current?.value === requireText;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in"
      onClick={onCancel}
    >
      <div
        className="card w-full max-w-md p-6 animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-4">
          <div
            className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
              isDanger ? "bg-red-100 dark:bg-red-900/30" : "bg-primary-100 dark:bg-primary-900/30"
            }`}
          >
            <AlertTriangle className={`w-5 h-5 ${isDanger ? "text-red-600 dark:text-red-400" : "text-primary-600 dark:text-primary-400"}`} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{message}</p>
          </div>
          <button onClick={onCancel} className="btn-ghost p-1.5 -mr-2 -mt-2">
            <X className="w-4 h-4" />
          </button>
        </div>

        {requireText && (
          <div className="mt-4">
            <input
              ref={confirmInputRef}
              type="text"
              className="input-field"
              placeholder={`请输入 ${requireText} 以确认`}
              onChange={() => {
                const btn = confirmBtnRef.current;
                if (btn) {
                  btn.disabled = confirmInputRef.current?.value !== requireText;
                }
              }}
            />
          </div>
        )}

        <div className="mt-6 flex gap-3 justify-end">
          <button onClick={onCancel} className="btn btn-secondary">
            {cancelText}
          </button>
          <button
            ref={confirmBtnRef}
            onClick={onConfirm}
            disabled={!requireTextMatched}
            className={`btn ${isDanger ? "btn-danger" : "btn-primary"} ${!requireTextMatched ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
