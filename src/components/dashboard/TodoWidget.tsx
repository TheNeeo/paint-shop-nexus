
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Edit2, BellRing, Check, X, Calendar, Clock, RotateCcw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Priority = "urgent" | "medium" | "low";

interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority: Priority;
  reminderDate?: string;
  reminderTime?: string;
  isRecurring?: boolean;
  isReminding?: boolean;
}

const STORAGE_KEY = "ncf-dashboard-tasks";

const PRIORITY_CONFIG: Record<Priority, { dot: string; bg: string; border: string; color: string; label: string; emoji: string }> = {
  urgent: { dot: "bg-red-500", bg: "bg-red-50", border: "border-red-200", color: "text-red-600", label: "Urgent", emoji: "🔴" },
  medium: { dot: "bg-amber-500", bg: "bg-amber-50", border: "border-amber-200", color: "text-amber-600", label: "Medium", emoji: "🟡" },
  low: { dot: "bg-emerald-500", bg: "bg-emerald-50", border: "border-emerald-200", color: "text-emerald-600", label: "Low", emoji: "🟢" },
};

function loadTasks(): Task[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw).map((t: any) => ({ ...t, priority: t.priority || "medium" }));
    return [
      { id: "1", title: "Check stock", completed: false, priority: "low" as Priority },
      { id: "2", title: "Call supplier", completed: false, priority: "urgent" as Priority, reminderTime: "16:00" },
      { id: "3", title: "Update product price", completed: true, priority: "medium" as Priority },
      { id: "4", title: "Prepare purchase order", completed: false, priority: "medium" as Priority, isRecurring: true, reminderDate: "Tomorrow" },
    ];
  } catch { return []; }
}

function formatTime(time?: string) {
  if (!time) return null;
  const [h, m] = time.split(":");
  const hr = parseInt(h);
  return `${hr > 12 ? hr - 12 : hr}:${m} ${hr >= 12 ? "PM" : "AM"}`;
}

export function TodoWidget() {
  const [tasks, setTasks] = useState<Task[]>(loadTasks);
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");
  const [newRecurring, setNewRecurring] = useState(false);
  const [newPriority, setNewPriority] = useState<Priority>("medium");

  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks)); }, [tasks]);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setTasks(prev => prev.map(t => {
        if (t.completed || !t.reminderDate || !t.reminderTime) return t;
        const reminderDt = new Date(`${t.reminderDate}T${t.reminderTime}`);
        if (now >= reminderDt && !t.isReminding) return { ...t, isReminding: true };
        return t;
      }));
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const completedCount = tasks.filter(t => t.completed).length;

  const addTask = () => {
    if (!newTitle.trim()) return;
    setTasks(prev => [...prev, { id: Date.now().toString(), title: newTitle.trim(), completed: false, priority: newPriority, reminderDate: newDate || undefined, reminderTime: newTime || undefined, isRecurring: newRecurring }]);
    resetForm(); setShowAdd(false);
  };

  const resetForm = () => { setNewTitle(""); setNewDate(""); setNewTime(""); setNewRecurring(false); setNewPriority("medium"); };
  const toggleTask = (id: string) => setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed, isReminding: false } : t));
  const deleteTask = (id: string) => setTasks(prev => prev.filter(t => t.id !== id));

  const startEdit = (task: Task) => {
    setEditingId(task.id); setNewTitle(task.title); setNewDate(task.reminderDate || ""); setNewTime(task.reminderTime || ""); setNewRecurring(task.isRecurring || false); setNewPriority(task.priority);
  };

  const saveEdit = () => {
    if (!editingId || !newTitle.trim()) return;
    setTasks(prev => prev.map(t => t.id === editingId ? { ...t, title: newTitle.trim(), priority: newPriority, reminderDate: newDate || undefined, reminderTime: newTime || undefined, isRecurring: newRecurring } : t));
    setEditingId(null); resetForm();
  };

  const PrioritySelector = ({ value, onChange }: { value: Priority; onChange: (p: Priority) => void }) => (
    <div className="flex gap-1.5">
      {(["urgent", "medium", "low"] as Priority[]).map(p => (
        <button key={p} type="button" onClick={() => onChange(p)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-semibold border transition-all duration-200 ${value === p ? `${PRIORITY_CONFIG[p].bg} ${PRIORITY_CONFIG[p].border} ${PRIORITY_CONFIG[p].color} shadow-sm` : "bg-muted/50 border-border text-muted-foreground hover:bg-muted"}`}
        >
          <span>{PRIORITY_CONFIG[p].emoji}</span>
          {PRIORITY_CONFIG[p].label}
        </button>
      ))}
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-3xl bg-card border border-border p-5 shadow-xl hover:shadow-2xl hover:scale-[1.005] transition-all duration-300 flex flex-col"
      style={{ minHeight: 420 }}
    >
      {/* Decorative blurs */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-100/30 rounded-full blur-3xl" />
      <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-violet-100/20 rounded-full blur-3xl" />

      <div className="relative z-10 flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-lg font-bold text-foreground">Today's Tasks</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              <span className="font-bold text-purple-600">{completedCount}</span> / {tasks.length} completed
            </p>
          </div>
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
            <Check className="h-5 w-5 text-white" />
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full h-2 bg-purple-100/60 rounded-full mb-4 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-purple-500 to-violet-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: tasks.length ? `${(completedCount / tasks.length) * 100}%` : "0%" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        </div>

        {/* Task list */}
        <div className="flex-1 overflow-y-auto space-y-2 max-h-[250px] pr-1">
          <AnimatePresence>
            {tasks.map((task) => {
              const pConfig = PRIORITY_CONFIG[task.priority];
              return (
                <motion.div
                  key={task.id}
                  layout
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: task.completed ? 0.5 : 1, x: 0 }}
                  exit={{ opacity: 0, x: 10, height: 0 }}
                  className={`group flex items-start gap-3 p-3 rounded-2xl transition-all duration-200 border ${
                    task.isReminding ? "bg-yellow-50 border-yellow-300 animate-pulse"
                    : task.completed ? "bg-muted/20 border-border/40"
                    : "hover:bg-accent/30 border-transparent hover:border-purple-100 hover:shadow-md"
                  }`}
                >
                  {editingId === task.id ? (
                    <div className="flex-1 space-y-2">
                      <Input value={newTitle} onChange={e => setNewTitle(e.target.value)} className="h-8 text-sm rounded-xl" autoFocus />
                      <PrioritySelector value={newPriority} onChange={setNewPriority} />
                      <div className="flex gap-2">
                        <Input type="date" value={newDate} onChange={e => setNewDate(e.target.value)} className="h-7 text-xs flex-1 rounded-lg" />
                        <Input type="time" value={newTime} onChange={e => setNewTime(e.target.value)} className="h-7 text-xs flex-1 rounded-lg" />
                      </div>
                      <div className="flex items-center justify-between">
                        <label className="flex items-center gap-1.5 text-xs text-muted-foreground cursor-pointer">
                          <input type="checkbox" checked={newRecurring} onChange={e => setNewRecurring(e.target.checked)} className="rounded" />
                          <RotateCcw className="h-3 w-3" /> Monthly
                        </label>
                        <div className="flex gap-1">
                          <Button size="sm" variant="ghost" onClick={() => { setEditingId(null); resetForm(); }} className="h-6 px-2 text-xs rounded-lg"><X className="h-3 w-3" /></Button>
                          <Button size="sm" onClick={saveEdit} className="h-6 px-2 text-xs bg-purple-600 hover:bg-purple-700 text-white rounded-lg"><Check className="h-3 w-3" /></Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* Checkbox */}
                      <div className="flex flex-col items-center gap-1 pt-0.5">
                        <button
                          onClick={() => toggleTask(task.id)}
                          className={`h-6 w-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                            task.completed
                              ? "bg-gradient-to-br from-purple-500 to-violet-500 border-purple-500 shadow-sm shadow-purple-400/30"
                              : `border-2 ${pConfig.dot.replace('bg-', 'border-')} hover:scale-110`
                          }`}
                        >
                          <motion.div
                            initial={false}
                            animate={{ scale: task.completed ? 1 : 0 }}
                            transition={{ type: "spring", stiffness: 400, damping: 15 }}
                          >
                            <Check className="h-3.5 w-3.5 text-white" />
                          </motion.div>
                        </button>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs">{pConfig.emoji}</span>
                          <p className={`text-sm transition-all duration-300 ${task.completed ? "line-through text-muted-foreground/60" : "text-foreground font-medium"}`}>
                            {task.title}
                          </p>
                        </div>
                        {/* Time / Date badges */}
                        <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                          {task.reminderTime && !task.completed && (
                            <span className="text-[10px] text-muted-foreground flex items-center gap-1 bg-muted/40 rounded-lg px-2 py-0.5">
                              <Clock className="h-2.5 w-2.5" /> {formatTime(task.reminderTime)}
                            </span>
                          )}
                          {task.reminderDate && !task.completed && (
                            <span className="text-[10px] text-muted-foreground flex items-center gap-1 bg-muted/40 rounded-lg px-2 py-0.5">
                              <Calendar className="h-2.5 w-2.5" /> {task.reminderDate}
                            </span>
                          )}
                          {task.isRecurring && !task.completed && (
                            <span className="text-[10px] text-purple-500 flex items-center gap-1 bg-purple-50 rounded-lg px-2 py-0.5">
                              <RotateCcw className="h-2.5 w-2.5" /> Monthly
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pt-0.5">
                        {task.isReminding && <BellRing className="h-4 w-4 text-yellow-500 animate-bounce" />}
                        <button onClick={() => startEdit(task)} className="p-1.5 hover:bg-accent rounded-xl transition-colors">
                          <Edit2 className="h-3.5 w-3.5 text-muted-foreground" />
                        </button>
                        <button onClick={() => deleteTask(task.id)} className="p-1.5 hover:bg-destructive/10 rounded-xl transition-colors">
                          <Trash2 className="h-3.5 w-3.5 text-destructive/60" />
                        </button>
                      </div>
                    </>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Add task form */}
        <AnimatePresence>
          {showAdd && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
              <div className="pt-3 space-y-2.5 border-t border-border mt-3">
                <Input placeholder="Task name..." value={newTitle} onChange={e => setNewTitle(e.target.value)} className="h-9 text-sm rounded-xl" autoFocus onKeyDown={e => e.key === "Enter" && addTask()} />
                <PrioritySelector value={newPriority} onChange={setNewPriority} />
                <div className="flex gap-2">
                  <Input type="date" value={newDate} onChange={e => setNewDate(e.target.value)} className="h-8 text-xs flex-1 rounded-lg" />
                  <Input type="time" value={newTime} onChange={e => setNewTime(e.target.value)} className="h-8 text-xs flex-1 rounded-lg" />
                </div>
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-1.5 text-xs text-muted-foreground cursor-pointer">
                    <input type="checkbox" checked={newRecurring} onChange={e => setNewRecurring(e.target.checked)} className="rounded" />
                    <RotateCcw className="h-3 w-3" /> Repeat monthly
                  </label>
                  <div className="flex gap-1">
                    <Button size="sm" variant="ghost" onClick={() => { setShowAdd(false); resetForm(); }} className="h-7 text-xs rounded-lg">Cancel</Button>
                    <Button size="sm" onClick={addTask} className="h-7 text-xs bg-purple-600 hover:bg-purple-700 text-white rounded-lg">Add</Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating add button */}
        {!showAdd && !editingId && (
          <div className="flex justify-end mt-3">
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowAdd(true)}
              className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-600 to-violet-600 text-white flex items-center justify-center shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 transition-all duration-300"
            >
              <Plus className="h-5 w-5" />
            </motion.button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
