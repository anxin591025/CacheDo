import { useState, useEffect, useRef } from "react";
import { X, Save, Calendar, Tag, Bell, Flag, FileText } from "lucide-react";
import type { Todo, Priority } from "@/types/todo";
import { DEFAULT_TAGS, PRIORITY_LABELS } from "@/types/todo";
import { getDateInputValue, getDateTimeInputValue } from "@/utils/date";

interface TodoEditorProps {
  open: boolean;
  editingTodo: Todo | null;
  onSave: (data: Partial<Omit<Todo, "id" | "createdAt" | "updatedAt" | "order">>, id?: string) => void;
  onClose: () => void;
}

export default function TodoEditor({ open, editingTodo, onSave, onClose }: TodoEditorProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState<Priority>("none");
  const [tags, setTags] = useState<string[]>([]);
  const [customTag, setCustomTag] = useState("");
  const [reminderAt, setReminderAt] = useState("");
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      if (editingTodo) {
        setTitle(editingTodo.title);
        setDescription(editingTodo.description ?? "");
        setDueDate(getDateInputValue(editingTodo.dueDate));
        setPriority(editingTodo.priority);
        setTags(editingTodo.tags);
        setReminderAt(getDateTimeInputValue(editingTodo.reminderAt));
      } else {
        setTitle("");
        setDescription("");
        setDueDate("");
        setPriority("none");
        setTags([]);
        setReminderAt("");
      }
      setCustomTag("");
      setTimeout(() => titleRef.current?.focus(), 100);
    }
  }, [open, editingTodo]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
        handleSave();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  });

  const handleSave = () => {
    if (!title.trim()) return;
    onSave(
      {
        title: title.trim(),
        description: description.trim() || undefined,
        dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
        priority,
        tags,
        reminderAt: reminderAt ? new Date(reminderAt).toISOString() : undefined,
      },
      editingTodo?.id
    );
  };

  const toggleTag = (tag: string) => {
    setTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  };

  const addCustomTag = () => {
    const tag = customTag.trim();
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag]);
    }
    setCustomTag("");
  };

  if (!open) return null;

  const isEditing = !!editingTodo;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/40 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="card w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-5 py-4 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
          <h2 className="text-base font-semibold">{isEditing ? "编辑任务" : "新建任务"}</h2>
          <button onClick={onClose} className="btn-ghost p-1.5">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-4 space-y-4">
          {/* Title */}
          <div>
            <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              <FileText className="w-4 h-4" /> 任务名称 <span className="text-red-500">*</span>
            </label>
            <input
              ref={titleRef}
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.metaKey && !e.ctrlKey) {
                  e.preventDefault();
                  handleSave();
                }
              }}
              className="input-field"
              placeholder="输入任务名称..."
            />
          </div>

          {/* Description */}
          <div>
            <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              <FileText className="w-4 h-4" /> 备注
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="input-field min-h-[80px] resize-y"
              placeholder="添加详细描述..."
            />
          </div>

          {/* Date & Priority row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Due Date */}
            <div>
              <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                <Calendar className="w-4 h-4" /> 截止日期
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="input-field"
              />
            </div>

            {/* Priority */}
            <div>
              <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                <Flag className="w-4 h-4" /> 优先级
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="input-field cursor-pointer"
              >
                {(Object.keys(PRIORITY_LABELS) as Priority[]).map((p) => (
                  <option key={p} value={p}>
                    {PRIORITY_LABELS[p]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Reminder */}
          <div>
            <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              <Bell className="w-4 h-4" /> 提醒时间
            </label>
            <input
              type="datetime-local"
              value={reminderAt}
              onChange={(e) => setReminderAt(e.target.value)}
              className="input-field"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              <Tag className="w-4 h-4" /> 标签
            </label>
            <div className="flex flex-wrap gap-2">
              {DEFAULT_TAGS.map((tag) => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                    tags.includes(tag)
                      ? "bg-primary-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                  }`}
                >
                  {tag}
                </button>
              ))}
              {tags.filter((t) => !DEFAULT_TAGS.includes(t)).map((tag) => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className="px-3 py-1 rounded-full text-xs font-medium bg-primary-600 text-white"
                >
                  {tag} ✕
                </button>
              ))}
            </div>
            <div className="flex gap-2 mt-2">
              <input
                type="text"
                value={customTag}
                onChange={(e) => setCustomTag(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addCustomTag();
                  }
                }}
                className="input-field flex-1 text-sm"
                placeholder="自定义标签..."
              />
              <button onClick={addCustomTag} className="btn btn-secondary text-sm px-3">
                添加
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 flex gap-3 px-5 py-4 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700">
          <button onClick={onClose} className="btn btn-secondary flex-1">
            取消
          </button>
          <button
            onClick={handleSave}
            disabled={!title.trim()}
            className={`btn btn-primary flex-1 ${!title.trim() ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <Save className="w-4 h-4" /> 保存
          </button>
        </div>
      </div>
    </div>
  );
}
