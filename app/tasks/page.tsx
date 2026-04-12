"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { ActionButton } from "@/components/ui/action-button";
import { Panel } from "@/components/ui/panel";
import { StatusBadge } from "@/components/ui/status-badge";
import { getTasks, createTask, updateTask, deleteTask } from "@/lib/mock-storage";
import { formatDateTime } from "@/lib/format";
import { Plus, Pencil, Trash2, Check, X } from "lucide-react";
import { Task, TaskStatus } from "@/types";

export default function TasksPage() {
  const [tasks, setTasks] = useState(getTasks());
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newTask, setNewTask] = useState({ taskName: "", assignedTo: "", status: "pending" as TaskStatus });
  const [editTask, setEditTask] = useState<Partial<Task>>({});

  function refresh() {
    setTasks(getTasks());
  }

  function handleAdd() {
    if (!newTask.taskName || !newTask.assignedTo) return;
    createTask({
      taskName: newTask.taskName,
      assignedTo: newTask.assignedTo,
      status: newTask.status
    });
    setNewTask({ taskName: "", assignedTo: "", status: "pending" });
    setShowAdd(false);
    refresh();
  }

  function handleDelete(id: string) {
    deleteTask(id);
    refresh();
  }

  function startEdit(task: Task) {
    setEditingId(task.id);
    setEditTask({ ...task });
  }

  function saveEdit() {
    if (!editingId) return;
    updateTask(editingId, {
      taskName: editTask.taskName,
      assignedTo: editTask.assignedTo,
      status: editTask.status
    });
    setEditingId(null);
    setEditTask({});
    refresh();
  }

  function cancelEdit() {
    setEditingId(null);
    setEditTask({});
  }

  function cycleStatus(id: string, current: TaskStatus) {
    const next: Record<TaskStatus, TaskStatus> = {
      pending: "in_progress",
      in_progress: "completed",
      completed: "pending"
    };
    updateTask(id, { status: next[current] });
    refresh();
  }

  return (
    <AppShell
      title="Tasks"
      description="To-do list and task monitoring. Track task name and person assigned."
      actions={
        <ActionButton onClick={() => setShowAdd(!showAdd)} variant={showAdd ? "ghost" : "primary"}>
          <Plus className="mr-2 h-4 w-4" />
          {showAdd ? "Cancel" : "Add task"}
        </ActionButton>
      }
    >
      {showAdd && (
        <Panel eyebrow="New" title="Add task" description="Create a new task with name and assignee.">
          <div className="grid gap-4 md:grid-cols-4">
            <input
              value={newTask.taskName}
              onChange={(e) => setNewTask((c) => ({ ...c, taskName: e.target.value }))}
              placeholder="Task name"
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
            />
            <input
              value={newTask.assignedTo}
              onChange={(e) => setNewTask((c) => ({ ...c, assignedTo: e.target.value }))}
              placeholder="Assigned to"
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
            />
            <select
              value={newTask.status}
              onChange={(e) => setNewTask((c) => ({ ...c, status: e.target.value as TaskStatus }))}
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
            >
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
            <ActionButton onClick={handleAdd} variant="primary">Save task</ActionButton>
          </div>
        </Panel>
      )}

      <Panel
        eyebrow="Monitoring"
        title="Task list"
        description="All tasks with assignment and status tracking."
      >
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="grid grid-cols-[1fr_0.6fr_0.4fr_0.4fr_auto] border-b border-slate-200 bg-brand-50 px-5 py-4 text-xs uppercase tracking-[0.22em] text-brand-800">
            <div>Task</div>
            <div>Assigned To</div>
            <div>Status</div>
            <div>Updated</div>
            <div>Actions</div>
          </div>

          {tasks.map((task) => (
            <div
              key={task.id}
              className="grid grid-cols-[1fr_0.6fr_0.4fr_0.4fr_auto] items-center border-b border-slate-100 px-5 py-4 last:border-b-0"
            >
              {editingId === task.id ? (
                <>
                  <input
                    value={editTask.taskName || ""}
                    onChange={(e) => setEditTask((c) => ({ ...c, taskName: e.target.value }))}
                    className="rounded-2xl border border-slate-200 px-3 py-2 text-sm outline-none"
                  />
                  <input
                    value={editTask.assignedTo || ""}
                    onChange={(e) => setEditTask((c) => ({ ...c, assignedTo: e.target.value }))}
                    className="rounded-2xl border border-slate-200 px-3 py-2 text-sm outline-none"
                  />
                  <select
                    value={editTask.status || "pending"}
                    onChange={(e) => setEditTask((c) => ({ ...c, status: e.target.value as TaskStatus }))}
                    className="rounded-2xl border border-slate-200 px-3 py-2 text-sm outline-none"
                  >
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                  <div />
                  <div className="flex gap-2">
                    <button onClick={saveEdit} className="rounded-full p-2 text-brand-600 hover:bg-brand-50"><Check className="h-4 w-4" /></button>
                    <button onClick={cancelEdit} className="rounded-full p-2 text-slate-500 hover:bg-slate-100"><X className="h-4 w-4" /></button>
                  </div>
                </>
              ) : (
                <>
                  <div className="font-medium text-slate-900">{task.taskName}</div>
                  <div className="text-sm text-slate-600">{task.assignedTo}</div>
                  <div>
                    <button onClick={() => cycleStatus(task.id, task.status)}>
                      <StatusBadge status={task.status} />
                    </button>
                  </div>
                  <div className="text-xs text-slate-500">{formatDateTime(task.updatedAt)}</div>
                  <div className="flex gap-1">
                    <button onClick={() => startEdit(task)} className="rounded-full p-2 text-brand-600 hover:bg-brand-50" title="Edit"><Pencil className="h-4 w-4" /></button>
                    <button onClick={() => handleDelete(task.id)} className="rounded-full p-2 text-red-500 hover:bg-red-50" title="Remove"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </>
              )}
            </div>
          ))}

          {tasks.length === 0 && (
            <div className="px-5 py-10 text-center text-sm text-slate-500">No tasks yet. Add one above.</div>
          )}
        </div>
      </Panel>
    </AppShell>
  );
}
