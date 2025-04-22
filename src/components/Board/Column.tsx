import React, { useState } from 'react';
import { Column as ColumnType, Task } from '../../types'; // Removed Status
import TaskCard from '../Task/TaskCard';
import ColumnSkeleton from './ColumnSkeleton';
import { useTaskContext } from '../../contexts/useTaskContext'; // Added context import
import { toast } from 'sonner'; // Added toast import
import { Star, Circle, Square, Triangle } from 'lucide-react';

const getIconComponent = (iconName: string | undefined) => {
  switch (iconName) {
    case 'star':
      return <Star />;
    case 'circle':
      return <Circle />;
    case 'square':
      return <Square />;
    case 'triangle':
      return <Triangle />;
    default:
      return null;
  }
};

interface ColumnProps {
  column: ColumnType;
  onEditTask: (task: Task) => void;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, taskId: string) => void;
  onDragEnd: () => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>, columnId: string) => void; // Changed status to columnId (string)
  isDragging?: boolean;
  isLoading?: boolean,
}

const Column: React.FC<ColumnProps> = ({
  column,
  onEditTask,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDrop,
  isDragging,
  isLoading = false,
}) => {
  const [isOver, setIsOver] = useState(false);
  const [isHovered, setIsHovered] = useState(false); // Track hover state
  const [isRenameInputVisible, setIsRenameInputVisible] = useState(false); // Track rename input visibility
  const [renameTitle, setRenameTitle] = useState(column.title); // Track rename input value
  const [selectedIcon, setSelectedIcon] = useState<string | undefined>(column.icon); // Track selected icon
  const { deleteColumn, renameColumn } = useTaskContext(); // Get context functions

  // Simplified header styles - consider adding color property to ColumnType later
  const getColumnHeaderStyles = () => { // Removed unused _columnId parameter
    const baseStyle = 'bg-gradient-to-br backdrop-blur-md border-t-4';
    // Return a default style for all columns now
    return `${baseStyle} from-slate-400/10 to-slate-400/5 border-slate-400`;
  };

  const handleDeleteColumn = () => {
    if (window.confirm(`Are you sure you want to delete column "${column.title}"?`)) {
      deleteColumn(column.id);
    }
  };

  const handleRenameColumn = () => {
    if (renameTitle.trim()) {
      renameColumn(column.id, renameTitle, selectedIcon);
      setIsRenameInputVisible(false); // Hide input after rename
    } else {
      toast.error('Column title cannot be empty.');
    }
  };

  if (isLoading) {
    return <ColumnSkeleton />;
  }

  return (
    <div
      className={`flex flex-col w-full sm:w-[300px] sm:min-w-[300px] glass-effect rounded-lg shadow-soft-xl mx-1 mb-4 overflow-hidden relative ${ // Changed mx-2 to mx-1, added mb-4
        isDragging ? 'ring-1 ring-primary/20' : ''
      } ${isOver ? 'shadow-lg scale-[1.02] transition-transform duration-200' : ''}`} // Removed ring-2 ring-primary/40
      onDragOver={(e) => {
        e.preventDefault();
        setIsOver(true);
        onDragOver(e);
      }}
      onDragLeave={() => setIsOver(false)}
      onDrop={(e) => {
        setIsOver(false);
        onDrop(e, column.id); // Pass column.id directly (it's a string)
      }}
      onMouseEnter={() => setIsHovered(true)} // Track hover
      onMouseLeave={() => setIsHovered(false)} // Track hover
    >
      <div className={`p-3 font-semibold ${getColumnHeaderStyles()}`}> {/* Removed parameter from call site */}
        <div
          className="flex items-center justify-between"
        >
          {isRenameInputVisible ? (
            <div>
              <input
                type="text"
                value={renameTitle}
                onChange={(e) => setRenameTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleRenameColumn();
                  }
                }}
                onBlur={() => setIsRenameInputVisible(false)} // Hide input on blur
                className="px-2 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 mb-2"
              />
              <select
                value={selectedIcon || ''}
                onChange={(e) => setSelectedIcon(e.target.value)}
                className="px-2 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="">No Icon</option>
                <option value="star">Star</option>
                <option value="circle">Circle</option>
                <option value="square">Square</option>
                <option value="triangle">Triangle</option>
              </select>
            </div>
          ) : (
            <span className="text-foreground">
              {column.icon && (
                <span className="mr-2">{getIconComponent(column.icon)}</span>
              )}
              {column.title}
            </span>
          )}
          <span className="ml-2 bg-background/50 backdrop-blur-sm text-primary text-xs font-medium px-2.5 py-0.5 rounded-full">
            {column.tasks.length}
          </span>
        </div>
      </div>
      
      {/* Column Actions (Rename/Delete) - Show on Hover */}

      {/* Column Actions (Rename/Delete) - Show on Hover */}
      {isHovered && (
        <div className="absolute top-2 right-2 flex space-x-2 bg-background/80 backdrop-blur-sm rounded-md p-1">
          <button
            className="p-1 text-gray-500 hover:text-blue-500 transition-colors"
            aria-label="Rename Column"
            onClick={() => {
              setIsRenameInputVisible(true);
            }}
          >
            {/* Replace with actual rename icon */}
            Rename
          </button>
          <button
            className="p-1 text-gray-500 hover:text-red-500 transition-colors"
            aria-label="Delete Column"
            onClick={handleDeleteColumn}
          >
            {/* Replace with actual delete icon */}
            Delete
          </button>
        </div>
      )}

      
        <div 
          className={`flex-1 p-3 space-y-3 overflow-y-auto max-h-[calc(100vh-250px)] scrollbar-custom transition-all duration-200`} // Removed isOver && isDragging ? 'bg-primary/5' : ''
        >
            {column.tasks.length > 0 ? (
              <div className="space-y-3">
                {column.tasks.map((task) => (
                  <div
                    key={task.id}
                  >
                    <TaskCard
                      task={task}
                      onEdit={onEditTask}
                      onDragStart={(e) => onDragStart(e, task.id)}
                      onDragEnd={onDragEnd}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div
                className={`flex flex-col items-center justify-center h-24 border-2 border-dashed ${ // Removed isOver && isDragging ? 'border-primary/30 bg-primary/5 scale-105' : ...
                  isOver && isDragging
                    ? 'border-border/50 bg-background/30 scale-105' // Keep scale effect, use default border/bg
                    : 'border-border/50 bg-background/30'
                } rounded-lg m-2 text-center p-4 backdrop-blur-sm transition-all duration-300`}
              >
                <p
                  className="text-muted-foreground text-sm"
                >
                  Drag tasks here
                </p>
                <p
                  className="text-muted-foreground text-sm"
                >
                  or use 'Add Task'
                </p>
              </div>
            )}
        </div>
    </div>
  );
};

export default Column;
