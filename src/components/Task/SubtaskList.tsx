import React, { useState } from 'react';
import { SubTask, TeamMember } from '../../types';
import { CheckSquare, Square, Trash, Plus, User } from 'lucide-react';
import { cn } from '../../utils/cn';

interface SubtaskListProps {
  subtasks: SubTask[];
  onToggle: (subtaskId: string) => void;
  onAdd: (title: string, assigneeId?: string) => void;
  onDelete: (subtaskId: string) => void;
  onAssign?: (subtaskId: string, assignee: TeamMember) => void;
  availableAssignees?: TeamMember[];
}

const SubtaskList: React.FC<SubtaskListProps> = ({ 
  subtasks, 
  onToggle, 
  onAdd, 
  onDelete,
  onAssign,
  availableAssignees = []
}) => {
  const [newSubtask, setNewSubtask] = useState('');
  const [selectedAssignee, setSelectedAssignee] = useState<string>('');
  const completedCount = subtasks.filter(st => st.completed).length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSubtask.trim()) {
      onAdd(newSubtask.trim(), selectedAssignee || undefined);
      setNewSubtask('');
      setSelectedAssignee('');
    }
  };

  return (
    <div className="space-y-3">
      {/* Progress header */}
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-gray-700">
          Subtasks ({completedCount}/{subtasks.length})
        </h4>
        <div className="h-1.5 w-24 rounded-full bg-gray-200">
          <div
            className="h-1.5 rounded-full bg-primary transition-all"
            style={{
              width: `${subtasks.length ? (completedCount / subtasks.length) * 100 : 0}%`
            }}
          />
        </div>
      </div>

      {/* Subtasks list */}
      <div className="space-y-2">
        {subtasks.map((subtask) => (
          <div
            key={subtask.id}
            className="group flex items-center gap-2 rounded-md p-2 hover:bg-gray-50"
          >
            <button
              onClick={() => onToggle(subtask.id)}
              className={cn(
                "flex items-center gap-2 flex-1 text-sm transition-colors",
                subtask.completed && "text-gray-400"
              )}
            >
              {subtask.completed ? (
                <CheckSquare className="h-4 w-4 text-primary" />
              ) : (
                <Square className="h-4 w-4" />
              )}
              <span className={cn(
                "flex-1",
                subtask.completed && "line-through"
              )}>
                {subtask.title}
              </span>
            </button>

            {/* Assignee display/selector */}
            {availableAssignees?.length > 0 && (
              <select
                value={subtask.assignee?.id || ''}
                onChange={(e) => {
                  const assignee = availableAssignees.find(a => a.id === e.target.value);
                  if (assignee && onAssign) {
                    onAssign(subtask.id, assignee);
                  }
                }}
                className="text-xs border border-gray-200 rounded px-2 py-1 bg-white"
              >
                <option value="">Assign to...</option>
                {availableAssignees.map(assignee => (
                  <option key={assignee.id} value={assignee.id}>
                    {assignee.name}
                  </option>
                ))}
              </select>
            )}

            <button
              onClick={() => onDelete(subtask.id)}
              className="invisible text-gray-400 hover:text-red-500 group-hover:visible"
            >
              <Trash className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Add new subtask form */}
      <form onSubmit={handleSubmit} className="space-y-2">
        <div className="flex gap-2">
          <input
            type="text"
            value={newSubtask}
            onChange={(e) => setNewSubtask(e.target.value)}
            placeholder="Add a subtask..."
            className="flex-1 rounded-md border border-gray-300 px-3 py-1.5 text-sm placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
          {availableAssignees?.length > 0 && (
            <select
              value={selectedAssignee}
              onChange={(e) => setSelectedAssignee(e.target.value)}
              className="rounded-md border border-gray-300 px-3 py-1.5 text-sm bg-white"
            >
              <option value="">Assign to...</option>
              {availableAssignees.map(assignee => (
                <option key={assignee.id} value={assignee.id}>
                  {assignee.name}
                </option>
              ))}
            </select>
          )}
          <button 
            type="submit"
            className="inline-flex items-center gap-1 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-white hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" />
            Add
          </button>
        </div>
      </form>
    </div>
  );
};

export default SubtaskList;
