import React, { useState } from 'react';
import { Task } from '../../types';
import Column from './Column';
import TaskModal from '../Task/TaskModal';
import { useTaskContext } from '../../contexts/TaskContext';
import { toast } from 'sonner';
import ColumnSkeleton from './ColumnSkeleton';

interface BoardProps {
  activeStatus: string | null; // Changed Status to string
}

const Board: React.FC<BoardProps> = ({ activeStatus }) => {
  const { columns, moveTask, deleteTask, addColumn, isLoading } = useTaskContext(); // Removed unused context functions
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState<Task | undefined>(undefined);
  const [isDragging, setIsDragging] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState(''); // State for new column title

  // Log state received from context
  const columnDetails = columns.map(c => ({
    id: c.id,
    count: c.tasks.length,
    taskIds: c.tasks.map(t => t.id)
  }));
  console.log("[Board] Received columns from context:", JSON.stringify(columnDetails, null, 2));

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, taskId: string) => {
    console.log(`[Board] handleDragStart: taskId=${taskId}`);
    setIsDragging(true);
    e.dataTransfer.setData('taskId', taskId);
    e.dataTransfer.effectAllowed = 'move';

    // Create a custom drag image
    const dragPreview = e.currentTarget.cloneNode(true) as HTMLElement;
    dragPreview.style.position = 'absolute';
    dragPreview.style.top = '-1000px';
    dragPreview.style.opacity = '0.8';
    dragPreview.style.transform = 'scale(0.8)';
    document.body.appendChild(dragPreview);
    e.dataTransfer.setDragImage(dragPreview, 20, 20);
    
    requestAnimationFrame(() => {
      document.body.removeChild(dragPreview);
    });
  };

  const handleDragEnd = () => {
    console.log('[Board] handleDragEnd');
    setIsDragging(false);
    toast.success('Task moved!');
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetColumnId: string) => { // Changed Status to string
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    console.log(`[Board] handleDrop: taskId=${taskId}, targetColumnId=${targetColumnId}`);
    
    if (taskId) {
      moveTask(taskId, targetColumnId);
      toast.success('Task moved!');
    }
    setIsDragging(false);
  };

  // Calculate filtered columns based on activeStatus prop
  const filteredColumns = activeStatus
    ? columns.filter((column) => column.id === activeStatus)
    : columns;

  // Log filtered columns for debugging
  console.log("[Board] After filtering:", {
    activeStatus,
    totalColumns: columns.length,
    filteredCount: filteredColumns.length,
    filteredColumns: filteredColumns.map(c => ({
      id: c.id,
      taskCount: c.tasks.length
    }))
  });

  const handleAddTaskClick = () => {
    setCurrentTask(undefined);
    setIsModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    console.log(`[Board] handleEditTask: taskId=${task.id}`);
    setCurrentTask(task);
    setIsModalOpen(true);
  };

  const handleAddColumn = () => {
    const title = newColumnTitle.trim();
    if (title) {
      addColumn(title);
      setNewColumnTitle('');
    } else {
      toast.error('Column title cannot be empty.');
    }
  };

  return (
    <div className="flex-1 overflow-hidden flex flex-col items-center">
      {/* Add Column Section */}
      <div className="flex items-center justify-center p-4">
        <input
          type="text"
          placeholder="Enter column title"
          value={newColumnTitle}
          onChange={(e) => setNewColumnTitle(e.target.value)}
          className="px-4 py-2 border rounded-md mr-2 focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
        <button
          onClick={handleAddColumn}
          className="bg-[#6F42C1] hover:bg-[#5e35b1] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Add Column
        </button>
      </div>

      <div className="flex-1 overflow-x-auto overflow-y-auto pb-4"> {/* Keep vertical padding */}
        {/* Removed px-4 from the div below, added flex-wrap and justify-center */}
        <div className={`flex flex-wrap justify-center h-full pb-4 pt-2 ${ // Added justify-center
            filteredColumns.length === 1 ? 'justify-center' : '' // This might be redundant now but harmless
          }`}>
          {filteredColumns.map((column) => (
            <Column
              key={column.id}
              column={column}
              onEditTask={handleEditTask}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              isDragging={isDragging}
              isLoading={isLoading}
            />
          ))}
          {isLoading ? <ColumnSkeleton /> : filteredColumns.length === 0 && (
            <div className="flex items-center justify-center h-full w-full text-gray-500">
              No columns to display.
            </div>
          )}
        </div>
      </div>

      <button
        onClick={handleAddTaskClick}
        className="flex items-center gap-2 bg-[#6F42C1] text-white rounded-full px-6 py-3 mt-4 hover:bg-[#5e35b1] focus:outline-none focus:ring-2 focus:ring-[#6F42C1]/20 focus:ring-offset-2 shadow-lg hover:shadow-xl transition-all duration-200 font-medium"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
        Add New Task
      </button>

      <TaskModal
        task={currentTask}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setCurrentTask(undefined);
        }}
        onDelete={(id) => {
          deleteTask(id);
          setIsModalOpen(false);
          setCurrentTask(undefined);
          toast.success('Task deleted successfully');
        }}
      />
    </div>
  );
};

export default Board;
