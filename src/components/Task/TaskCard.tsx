import React from 'react';
import { Task } from '../../types';
import { Calendar, User2, Paperclip } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, taskId: string) => void;
  onDragEnd: () => void;
}

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onEdit,
  onDragStart,
  onDragEnd,
}) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const isOverdue = new Date(task.deadline) < new Date();
  const deadlineDate = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
  }).format(new Date(task.deadline));

  return (
    <motion.div
      layout
      className="task-card bg-card border border-border rounded-lg p-4 cursor-pointer"
      onClick={() => onEdit(task)}
      draggable
      // @ts-expect-error - motion.div's onDragStart type conflicts with native draggable, prioritize native
      onDragStart={(e) => onDragStart(e, task.id)} 
      onDragEnd={onDragEnd}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-medium text-card-foreground line-clamp-2">
            {task.title}
          </h3>
          <span
            className={cn(
              'px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap',
              getPriorityColor(task.priority)
            )}
          >
            {task.priority}
          </span>
        </div>

        {task.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {task.description}
          </p>
        )}

        {/* Labels Section - Added */}
        {task.labels && task.labels.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-1">
            {task.labels.map((label) => (
              <span
                key={label}
                className="px-2 py-0.5 rounded-md bg-accent text-accent-foreground text-xs font-medium"
              >
                {label}
              </span>
            ))}
          </div>
        )}
        {/* End Labels Section */}

        <div className="flex items-center justify-between pt-2 text-muted-foreground">
          <div className="flex items-center gap-3 text-sm">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span className={cn(
                'text-xs',
                isOverdue && 'text-red-500 dark:text-red-400'
              )}>
                {deadlineDate}
              </span>
            </div>

            {task.documents.length > 0 && (
              <div className="flex items-center gap-1">
                <Paperclip className="w-4 h-4" />
                <span className="text-xs">{task.documents.length}</span>
              </div>
            )}
          </div>

          {task.assignees.length > 0 && (
            <div className="flex -space-x-2">
              {task.assignees.length <= 3 ? (
                task.assignees.map((assignee) => ( // Remove unused _index
                  <div
                    key={assignee.id}
                    className="w-6 h-6 rounded-full border-2 border-background bg-primary/10 flex items-center justify-center"
                    title={assignee.name}
                  >
                    {assignee.avatar ? (
                      <img
                        src={assignee.avatar}
                        alt={assignee.name}
                        className="w-full h-full rounded-full"
                      />
                    ) : (
                      <User2 className="w-3 h-3 text-primary" />
                    )}
                  </div>
                ))
              ) : (
                <>
                  {task.assignees.slice(0, 2).map((assignee) => ( // Remove unused _index
                    <div
                      key={assignee.id}
                      className="w-6 h-6 rounded-full border-2 border-background bg-primary/10 flex items-center justify-center"
                      title={assignee.name}
                    >
                      {assignee.avatar ? (
                        <img
                          src={assignee.avatar}
                          alt={assignee.name}
                          className="w-full h-full rounded-full"
                        />
                      ) : (
                        <User2 className="w-3 h-3 text-primary" />
                      )}
                    </div>
                  ))}
                  <div
                    className="w-6 h-6 rounded-full border-2 border-background bg-primary/10 flex items-center justify-center text-xs font-medium text-primary"
                    title={`${task.assignees.length - 2} more`}
                  >
                    +{task.assignees.length - 2}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default TaskCard;
