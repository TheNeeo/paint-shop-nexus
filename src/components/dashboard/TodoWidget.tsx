
import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Edit2, Bell, BellRing, Check, X, Calendar, Clock, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Task {
  id: string;
  title: string;
  completed: boolean;
  reminderDate?: string;
  reminderTime?: string;
  isRecurring?: boolean;
  isReminding?: boolean;
}

const STORAGE_KEY = "ncf-dashboard-tasks";

function loadTasks(): Task[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [
      { id: "1", title: "Check stock", completed: false },
      { id: "2", title: "Call supplier", completed: false },
      { id: "3", title: "Update product price", completed: true },
      { id: "4", title: "Prepare purchase order", completed: false, reminderDate: "", reminderTime: "", isRecurring: true },
    ];
  } catch {
    return [];
  }
}

export function TodoWidget() {
  const [tasks, setTasks] = useState<Task[]>(loadTasks);
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");
  const [newRecurring, setNewRecurring] = useState(false);

  // Persist
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  // Reminder checker
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
    setTasks(prev => [...prev, {
      id: Date.now().toString(),
      title: newTitle.trim(),
      completed: false,
      reminderDate: newDate || undefined,
      reminderTime: newTime || undefined,
      isRecurring: newRecurring,
    }]);
    setNewTitle(""); setNewDate(""); setNewTime(""); setNewRecurring(false); setShowAdd(false);
  };

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed, isReminding: false } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const startEdit = (task: Task) => {
    setEditingId(task.id);
    setNewTitle(task.title);
    setNewDate(task.reminderDate || "");
    setNewTime(task.reminderTime || "");
    setNewRecurring(task.isRecurring || false);
  };

  const saveEdit = () => {
    if (!editingId || !newTitle.trim()) return;
    setTasks(prev => prev.map(t => t.id === editingId ? {
      ...t, title: newTitle.trim(),
      reminderDate: newDate || undefined,
      reminderTime: newTime || undefined,
      isRecurring: newRecurring,
    } : t));
    setEditingId(null); setNewTitle(""); setNewDate(""); setNewTime(""); setNewRecurring(false);
  };

  const cancelEdit = () => {
    setEditingId(null); setNewTitle(""); setNewDate(""); setNewTime(""); setNewRecurring(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl bg-white border border-purple-100 p-6 min-h-[340px] shadow-xl hover:shadow-2xl transition-shadow duration-300 flex flex-col"
    >
      {/* Decorative */}
      <div className="absolute -top-8 -right-8 w-32 h-32 bg-purple-100/40 rounded-full blur-2xl" />

      <div className="relative z-10 flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-gray-800">Today's Tasks</h3>
            <p className="text-xs text-gray-400 mt-0.5">{completedCount}/{tasks.length} completed</p>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
              <Check className="h-4 w-4 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full h-1.5 bg-purple-100 rounded-full mb-4 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-purple-500 to-violet-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: tasks.length ? `${(completedCount / tasks.length) * 100}%` : "0%" }}
            transition={{ duration: 0.5 }}
          />
        </div>

        {/* Task list */}
        <div className="flex-1 overflow-y-auto space-y-2 max-h-[200px] pr-1 scrollbar-thin">
          <AnimatePresence>
            {tasks.map((task) => (
              <motion.div
                key={task.id}
                layout
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className={`group flex items-center gap-3 p-2.5 rounded-xl transition-all duration-200 ${
                  task.isReminding
                    ? "bg-yellow-50 border border-yellow-300 animate-pulse"
                    : "hover:bg-purple-50/60"
                }`}
              >
                {editingId === task.id ? (
                  <div className="flex-1 space-y-2">
                    <Input
                      value={newTitle}
                      onChange={e => setNewTitle(e.target.value)}
                      className="h-8 text-sm"
                      autoFocus
                    />
                    <div className="flex gap-2">
                      <Input type="date" value={newDate} onChange={e => setNewDate(e.target.value)} className="h-7 text-xs flex-1" />
                      <Input type="time" value={newTime} onChange={e => setNewTime(e.target.value)} className="h-7 text-xs flex-1" />
                    </div>
                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-1.5 text-xs text-gray-500 cursor-pointer">
                        <input type="checkbox" checked={newRecurring} onChange={e => setNewRecurring(e.target.checked)} className="rounded" />
                        <RotateCcw className="h-3 w-3" /> Monthly
                      </label>
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost" onClick={cancelEdit} className="h-6 px-2 text-xs"><X className="h-3 w-3" /></Button>
                        <Button size="sm" onClick={saveEdit} className="h-6 px-2 text-xs bg-purple-600 hover:bg-purple-700 text-white"><Check className="h-3 w-3" /></Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <button
                      onClick={() => toggleTask(task.id)}
                      className={`h-5 w-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                        task.completed
                          ? "bg-gradient-to-br from-purple-500 to-violet-500 border-purple-500"
                          : "border-gray-300 hover:border-purple-400"
                      }`}
                    >
                      {task.completed && <Check className="h-3 w-3 text-white" />}
                    </button>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm truncate ${task.completed ? "line-through text-gray-400" : "text-gray-700"}`}>
                        {task.title}
                      </p>
                      {(task.reminderDate || task.isRecurring) && (
                        <div className="flex items-center gap-2 mt-0.5">
                          {task.reminderDate && (
                            <span className="text-[10px] text-gray-400 flex items-center gap-0.5">
                              <Calendar className="h-2.5 w-2.5" /> {task.reminderDate}
                            </span>
                          )}
                          {task.reminderTime && (
                            <span className="text-[10px] text-gray-400 flex items-center gap-0.5">
                              <Clock className="h-2.5 w-2.5" /> {task.reminderTime}
                            </span>
                          )}
                          {task.isRecurring && (
                            <span className="text-[10px] text-purple-400 flex items-center gap-0.5">
                              <RotateCcw className="h-2.5 w-2.5" /> Monthly
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {task.isReminding && <BellRing className="h-4 w-4 text-yellow-500 animate-bounce" />}
                      <button onClick={() => startEdit(task)} className="p-1 hover:bg-purple-100 rounded-lg transition-colors">
                        <Edit2 className="h-3.5 w-3.5 text-gray-400" />
                      </button>
                      <button onClick={() => deleteTask(task.id)} className="p-1 hover:bg-red-100 rounded-lg transition-colors">
                        <Trash2 className="h-3.5 w-3.5 text-red-400" />
                      </button>
                    </div>
                  </>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Add task */}
        <AnimatePresence>
          {showAdd && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="pt-3 space-y-2 border-t border-purple-100 mt-3">
                <Input
                  placeholder="Task name..."
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="h-9 text-sm"
                  autoFocus
                  onKeyDown={e => e.key === "Enter" && addTask()}
                />
                <div className="flex gap-2">
                  <Input type="date" value={newDate} onChange={e => setNewDate(e.target.value)} className="h-8 text-xs flex-1" />
                  <Input type="time" value={newTime} onChange={e => setNewTime(e.target.value)} className="h-8 text-xs flex-1" />
                </div>
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-1.5 text-xs text-gray-500 cursor-pointer">
                    <input type="checkbox" checked={newRecurring} onChange={e => setNewRecurring(e.target.checked)} className="rounded" />
                    <RotateCcw className="h-3 w-3" /> Repeat monthly
                  </label>
                  <div className="flex gap-1">
                    <Button size="sm" variant="ghost" onClick={() => { setShowAdd(false); setNewTitle(""); }} className="h-7 text-xs">Cancel</Button>
                    <Button size="sm" onClick={addTask} className="h-7 text-xs bg-purple-600 hover:bg-purple-700 text-white">Add</Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Add button */}
        {!showAdd && (
          <button
            onClick={() => setShowAdd(true)}
            className="mt-3 w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-violet-500 text-white text-sm font-semibold flex items-center justify-center gap-2 hover:from-purple-600 hover:to-violet-600 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
          >
            <Plus className="h-4 w-4" /> New Task
          </button>
        )}
      </div>
    </motion.div>
  );
}
