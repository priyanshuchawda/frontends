import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';
import { Task, Priority, Column, TeamMember, Document, Comment, SubTask } from '../types'; // Removed Status, Added Comment
import { getInitialTasks, createTask as createNewTask, generateId } from '../utils/taskUtils'; // Added generateId

export interface TaskContextProps {
  tasks: Task[];
  columns: Column[];
  isLoading: boolean;
  assignSubtask: (taskId: string, subtaskId: string, assignee: TeamMember) => void;  addTask: (
    title: string,
    description: string,
    status: string,
    priority: Priority,
    deadline: string,
    assignees: TeamMember[], 
    documents: Document[],
    comments?: Comment[],
    labels?: string[],
    subtasks?: SubTask[]
  ) => void;
  updateTask: (task: Task) => void;
  deleteTask: (id: string) => void;
  moveTask: (taskId: string, targetColumnId: string) => void; // Changed targetStatus to targetColumnId (string)
  searchTasks: (term: string) => Task[];
  filterTasks: (status?: string, priority?: Priority, deadline?: string) => Task[]; // Changed Status to string
  activeFilters: {
    status?: string; // Changed Status to string
    priority?: Priority;
    deadline?: string;
  };
  setActiveFilters: React.Dispatch<React.SetStateAction<{
    status?: string; // Changed Status to string
    priority?: Priority;
    deadline?: string;
  }>>;
  addComment: (taskId: string, authorId: string, text: string) => void; // Added
  addLabel: (taskId: string, label: string) => void; // Added
  removeLabel: (taskId: string, label: string) => void; // Added
  addColumn: (title: string) => void;
  deleteColumn: (columnId: string) => void;
  renameColumn: (columnId: string, newTitle: string, icon?: string) => void;
  // Add new subtask operations
  addSubtask: (taskId: string, title: string) => void;
  toggleSubtask: (taskId: string, subtaskId: string) => void;
  deleteSubtask: (taskId: string, subtaskId: string) => void;
}

export const TaskContext = createContext<TaskContextProps | undefined>(undefined);

// Initial columns - will become dynamic later
const INITIAL_COLUMNS: Column[] = [
  { id: 'col-1', title: 'To Do', tasks: [] }, // Example using different IDs
  { id: 'col-2', title: 'In Progress', tasks: [] },
  { id: 'col-3', title: 'Review', tasks: [] },
  { id: 'col-4', title: 'Done', tasks: [] },
];

const getDeadlineCategory = (deadline: string): string => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const deadlineDate = new Date(deadline);
  deadlineDate.setHours(0, 0, 0, 0);

  if (deadlineDate < today) return 'overdue';
  
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  if (deadlineDate <= tomorrow) return 'today';
  
  const nextWeek = new Date(today);
  nextWeek.setDate(today.getDate() + 7);
  if (deadlineDate <= nextWeek) return 'week';
  
  return 'future';
};

export const TaskProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  // Initialize columns state - potentially load from localStorage later
  const [columns, setColumns] = useState<Column[]>(INITIAL_COLUMNS);
  const [activeFilters, setActiveFilters] = useState<{
    status?: string; // Changed Status to string
    priority?: Priority;
    deadline?: string;
  }>({});
  const [isLoading, setIsLoading] = useState(true);

  // Effect for loading initial tasks ONCE on mount
  useEffect(() => {
    console.log("[TaskProvider] Initializing tasks...");
    setIsLoading(true);
    const initialTasks = getInitialTasks();
    // No need to check tasks.length here, just set them on first load
    setTasks(initialTasks);
    console.log("[TaskProvider] Initial tasks loaded:", initialTasks.length);
    // Set loading to false *after* tasks are set
    setIsLoading(false); 
    console.log("[TaskProvider] Initialization complete. isLoading set to false.");
  // Run only once on mount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Effect for recalculating columns when tasks change
  useEffect(() => {
    if (!isLoading) {
      console.log("[TaskProvider] Recalculating columns...");
      console.log("[TaskProvider] Current tasks:", tasks);

      // Update columns with current tasks
      setColumns(currentColumns => 
        currentColumns.map(column => ({
          ...column,
          tasks: tasks.filter(task => task.status === column.id)
        }))
      );
    }
  }, [tasks, isLoading]);

  // --- Column Management Functions ---

  const addColumn = (title: string) => {
    const newColumn: Column = {
      id: generateId(), // Use the existing ID generator
      title,
      tasks: [], // New columns start empty
    };
    setColumns(prevColumns => [...prevColumns, newColumn]);
    toast.success(`Column "${title}" added`);
  };

  const deleteColumn = (columnId: string) => {
    // Prevent deleting the last column? Or handle task migration?
    // For now, let's assume tasks in the deleted column are lost or need manual reassignment.
    // A safer approach would be to move tasks to a default column first.
    // Let's add a confirmation for now.
    if (columns.length <= 1) {
      toast.error("Cannot delete the last column.");
      return;
    }

    const columnToDelete = columns.find(c => c.id === columnId);
    if (!columnToDelete) return;

    // Simple deletion for now:
    setColumns(prevColumns => prevColumns.filter(col => col.id !== columnId));
    // Also update tasks that belonged to this column - set their status to null or move to first column?
    // Let's move them to the first column for safety.
    setTasks(prevTasks => {
       // Filter to get remaining columns, then get the ID of the first one
       const remainingColumns = columns.filter(c => c.id !== columnId);
       const firstRemainingColumnId = remainingColumns.length > 0 ? remainingColumns[0].id : null;
       return prevTasks.map(task =>
         task.status === columnId ? { ...task, status: firstRemainingColumnId || '' } : task
       );
    });

    toast.success(`Column "${columnToDelete.title}" deleted`);
     // Consider adding logic to handle tasks within the deleted column
  };

  const renameColumn = (columnId: string, newTitle: string, icon?: string) => {
    setColumns(prevColumns => {
      const updatedColumns = prevColumns.map(col =>
        col.id === columnId ? { ...col, title: newTitle, icon: icon } : col
      );
      toast.success(`Column renamed to "${newTitle}"`);
      return updatedColumns;
    });
  };

  // --- End Column Management ---


  const addTask = (
    title: string,
    description: string,
    status: string,
    priority: Priority,
    deadline: string,
    assignees: TeamMember[] = [],
    documents: Document[] = [],
    comments: Comment[] = [],
    labels: string[] = [],
    subtasks: SubTask[] = []
  ) => {
    const newTask: Task = {
      id: generateId(),
      title,
      description,
      status,
      priority,
      deadline: new Date(deadline).toISOString(),
      createdAt: new Date().toISOString(),
      assignees,
      documents,
      comments,
      labels,
      subtasks
    };

    setTasks(prevTasks => {
      const updatedTasks = [...prevTasks, newTask];
      console.log("[TaskProvider] Task added to column:", status);
      toast.success('Task created successfully');
      return updatedTasks;
    });
  };

  const updateTask = (taskToUpdate: Task) => {
    setTasks(prevTasks => {
      const existingTaskIndex = prevTasks.findIndex(t => t.id === taskToUpdate.id);
      if (existingTaskIndex !== -1) {
        // Update existing task
        const updatedTasks = [...prevTasks];
        updatedTasks[existingTaskIndex] = taskToUpdate;
        return updatedTasks;
      } else {
        // Add new task
        return [...prevTasks, taskToUpdate];
      }
    });
    toast.success(taskToUpdate.id ? 'Task updated successfully' : 'Task created successfully');
  };

  const deleteTask = (id: string) => {
    setTasks(prevTasks => {
      const tasks = prevTasks.filter(task => task.id !== id);
      toast.success('Task deleted successfully');
      return tasks;
    });
  };

  const moveTask = (taskId: string, targetColumnId: string) => { // Changed targetStatus to targetColumnId
    console.log(`[TaskProvider] moveTask called: TaskId=${taskId}, TargetColumnId=${targetColumnId}`);
    console.log("[TaskProvider]   Current activeFilters:", activeFilters);

    setTasks(prevTasks => {
      const oldTask = prevTasks.find(t => t.id === taskId);
      const newTasks = prevTasks.map(task =>
        task.id === taskId ? { ...task, status: targetColumnId } : task // Use targetColumnId
      );
      const movedTask = newTasks.find(t => t.id === taskId);
      const targetColumn = columns.find(c => c.id === targetColumnId); // Find target column for title

      if (oldTask && movedTask && targetColumn) {
        const sourceColumn = columns.find(c => c.id === oldTask.status);
        toast.success(
          `Task moved from "${sourceColumn?.title || oldTask.status}" to "${targetColumn.title}"` // Use column titles
        );
      } else if (oldTask && movedTask) {
         toast.success(`Task status updated to ${targetColumnId}`); // Fallback if column title not found
      }

      console.log("[TaskProvider]   Moved task details:", {
        id: movedTask?.id,
        oldStatus: oldTask?.status,
        newStatus: movedTask?.status
      });
      return newTasks;
    });
  };

  // --- Comment and Label Functions ---

  const addComment = (taskId: string, authorId: string, text: string) => {
    const newComment: Comment = {
      id: generateId(),
      taskId,
      authorId, // Assuming you have a way to get the current user's ID
      text,
      createdAt: new Date().toISOString(),
    };

    setTasks(prevTasks => {
      const updatedTasks = prevTasks.map(task => {
        if (task.id === taskId) {
          return {
            ...task,
            comments: [...task.comments, newComment],
          };
        }
        return task;
      });
      toast.success('Comment added');
      return updatedTasks;
    });
  };

  const addLabel = (taskId: string, label: string) => {
    setTasks(prevTasks => {
      const updatedTasks = prevTasks.map(task => {
        if (task.id === taskId && !task.labels.includes(label)) {
          return {
            ...task,
            labels: [...task.labels, label],
          };
        }
        return task;
      });
      // Only show toast if label was actually added (prevent duplicates)
      if (prevTasks.find(t => t.id === taskId)?.labels.includes(label) === false) {
         toast.info(`Label "${label}" added`);
      }
      return updatedTasks;
    });
  };

  const removeLabel = (taskId: string, labelToRemove: string) => {
    setTasks(prevTasks => {
      const updatedTasks = prevTasks.map(task => {
        if (task.id === taskId) {
          return {
            ...task,
            labels: task.labels.filter(label => label !== labelToRemove),
          };
        }
        return task;
      });
      toast.info(`Label "${labelToRemove}" removed`);
      return updatedTasks;
    });
  };

  // --- End Comment and Label Functions ---

  // New Subtask Functions

  const addSubtask = (taskId: string, title: string) => {
    const newSubtask = {
      id: generateId(),
      title,
      completed: false,
      createdAt: new Date().toISOString()
    };

    setTasks(current =>
      current.map(task => {
        if (task.id === taskId) {
          const updatedTask = {
            ...task,
            subtasks: [...(task.subtasks || []), newSubtask]
          };
          return updatedTask;
        }
        return task;
      })
    );
    return newSubtask; // Return the new subtask for immediate UI update
  };

  const toggleSubtask = (taskId: string, subtaskId: string) => {
    setTasks(current =>
      current.map(task => {
        if (task.id === taskId) {
          return {
            ...task,
            subtasks: task.subtasks.map(st =>
              st.id === subtaskId ? { ...st, completed: !st.completed } : st
            )
          };
        }
        return task;
      })
    );
  };

  const deleteSubtask = (taskId: string, subtaskId: string) => {
    setTasks(current =>
      current.map(task => {
        if (task.id === taskId) {
          return {
            ...task,
            subtasks: task.subtasks.filter(st => st.id !== subtaskId)
          };
        }
        return task;
      })
    );
  };

  const assignSubtask = (taskId: string, subtaskId: string, assignee: TeamMember) => {
    setTasks(current =>
      current.map(task => {
        if (task.id === taskId) {
          return {
            ...task,
            subtasks: task.subtasks.map(st =>
              st.id === subtaskId ? { ...st, assignee } : st
            )
          };
        }
        return task;
      })
    );
  };

  const searchTasks = (term: string): Task[] => {
    if (!term.trim()) return tasks; // Return all tasks if search term is empty
    const lowerTerm = term.toLowerCase();
    return tasks.filter(
      task =>
        task.title.toLowerCase().includes(lowerTerm) ||
        task.description.toLowerCase().includes(lowerTerm)
    );
  };

  // Note: This filterTasks function might not be directly used if filtering is handled by activeFilters state
  // Keeping it for potential direct use cases
  const filterTasks = (
    status?: string, // Changed Status to string
    priority?: Priority,
    deadline?: string
  ): Task[] => {
    return tasks.filter(task => {
      const statusMatch = !status || task.status === status; // Logic remains the same
      const priorityMatch = !priority || task.priority === priority;
      const deadlineMatch = !deadline || getDeadlineCategory(task.deadline) === deadline;
      return statusMatch && priorityMatch && deadlineMatch;
    });
  };
  const contextValue = {
    tasks,
    columns,
    isLoading,
    addTask,
    updateTask,
    deleteTask,
    moveTask,
    searchTasks,
    filterTasks,
    activeFilters,
    setActiveFilters,
    addComment,
    addLabel,
    removeLabel,
    addColumn,
    deleteColumn,
    renameColumn,
    addSubtask,
    toggleSubtask,
    deleteSubtask,
    assignSubtask,
  };

  return (
    <TaskContext.Provider value={contextValue}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTaskContext = () => {
  const context = React.useContext(TaskContext);
  if (!context) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
};
