import { useRef, useState } from "react";
import { X, Download, Upload, Trash2, Sun, Moon, Monitor, AlertTriangle } from "lucide-react";
import type { AppSettings } from "@/types/todo";
import ConfirmDialog from "./ConfirmDialog";

interface SettingsPanelProps {
  open: boolean;
  settings: AppSettings;
  onClose: () => void;
  onSettingsChange: (settings: Partial<AppSettings>) => void;
  onExport: () => void;
  onImport: (jsonString: string) => { success: boolean; count: number; message: string };
  onClearAll: () => void;
}

export default function SettingsPanel({
  open,
  settings,
  onClose,
  onSettingsChange,
  onExport,
  onImport,
  onClearAll,
}: SettingsPanelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importResult, setImportResult] = useState<{ success: boolean; message: string } | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [clearInput, setClearInput] = useState("");

  if (!open) return null;

  const themeOptions: { value: AppSettings["theme"]; label: string; icon: React.ReactNode }[] = [
    { value: "system", label: "跟随系统", icon: <Monitor className="w-4 h-4" /> },
    { value: "light", label: "浅色", icon: <Sun className="w-4 h-4" /> },
    { value: "dark", label: "深色", icon: <Moon className="w-4 h-4" /> },
  ];

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = onImport(event.target?.result as string);
      setImportResult(result);
      setTimeout(() => setImportResult(null), 3000);
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const handleClear = () => {
    onClearAll();
    setShowClearConfirm(false);
    setClearInput("");
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/40 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="card w-full max-w-md max-h-[90vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-5 py-4 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
          <h2 className="text-base font-semibold">设置</h2>
          <button onClick={onClose} className="btn-ghost p-1.5">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-5 py-4 space-y-6">
          {/* Theme */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">外观</h3>
            <div className="grid grid-cols-3 gap-2">
              {themeOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => onSettingsChange({ theme: opt.value })}
                  className={`flex flex-col items-center gap-1.5 py-3 rounded-xl border-2 transition-all ${
                    settings.theme === opt.value
                      ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400"
                      : "border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-500"
                  }`}
                >
                  {opt.icon}
                  <span className="text-xs">{opt.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Data management */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">数据管理</h3>
            <div className="space-y-2">
              <button
                onClick={onExport}
                className="w-full flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm"
              >
                <Download className="w-4 h-4" />
                导出数据
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm"
              >
                <Upload className="w-4 h-4" />
                导入数据
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
              {importResult && (
                <p className={`text-xs px-2 py-1.5 rounded ${importResult.success ? "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20" : "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20"}`}>
                  {importResult.message}
                </p>
              )}
            </div>
          </div>

          {/* Danger zone */}
          <div>
            <h3 className="text-sm font-medium text-red-600 dark:text-red-400 mb-3">危险操作</h3>
            <button
              onClick={() => setShowClearConfirm(true)}
              className="w-full flex items-center gap-2 px-4 py-2.5 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors text-sm"
            >
              <Trash2 className="w-4 h-4" />
              清空所有任务
            </button>
          </div>

          {/* About */}
          <div className="text-center text-xs text-gray-400 dark:text-gray-600 border-t border-gray-100 dark:border-gray-700 pt-4">
            <p>待办 App Demo v1.0</p>
            <p className="mt-1">数据存储于浏览器本地</p>
          </div>
        </div>
      </div>

      {/* Clear all confirm */}
      <ConfirmDialog
        open={showClearConfirm}
        title="确定清空所有任务？"
        message="此操作将删除浏览器中保存的全部 Todo 数据。输入 DELETE 以确认。"
        confirmText="确定清空"
        cancelText="取消"
        requireText="DELETE"
        onConfirm={handleClear}
        onCancel={() => {
          setShowClearConfirm(false);
          setClearInput("");
        }}
      />
    </div>
  );
}
