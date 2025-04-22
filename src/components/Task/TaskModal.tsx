import React, { useState, useEffect } from 'react';
import { Task, Priority, TeamMember, Document, Comment, SubTask } from '../../types';
import { X, Trash2, Calendar, UserPlus, Paperclip, MessageSquare, Plus, CheckSquare } from 'lucide-react';
import { toast } from "sonner";
import { useTaskContext } from '../../contexts/TaskContext';
import SubtaskList from './SubtaskList';

interface TaskModalProps {
  task?: Task;
  isOpen: boolean;
  onClose: () => void;
  onDelete?: (id: string) => void;
}

const TaskModal: React.FC<TaskModalProps> = ({
  task,
  isOpen,
  onClose,
  onDelete,
}) => {  const { 
    columns,
    updateTask, 
    addComment, 
    addLabel, 
    removeLabel
  } = useTaskContext();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');  const [status, setStatus] = useState<string>('col-1'); // Default to first column (To Do)
  const [priority, setPriority] = useState<Priority>('medium');
  const [deadline, setDeadline] = useState('');
  const [assignees, setAssignees] = useState<TeamMember[]>([]);
  const [newAssigneeName, setNewAssigneeName] = useState('');
  const [documents, setDocuments] = useState<Document[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [labels, setLabels] = useState<string[]>([]);
  const [newLabel, setNewLabel] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [localSubtasks, setLocalSubtasks] = useState<SubTask[]>([]);
  // Subtask operations are now handled directly in the SubtaskList handlers

  const handleAssignSubtask = (subtaskId: string, assignee: TeamMember) => {
    if (task) {
      // For existing task, update in context
      const updatedTask = {
        ...task,
        subtasks: task.subtasks.map(st =>
          st.id === subtaskId ? { ...st, assignee } : st
        )
      };
      updateTask(updatedTask);
    } else {
      // For new task, update local state
      setLocalSubtasks(prev =>
        prev.map(st =>
          st.id === subtaskId ? { ...st, assignee } : st
        )
      );
    }
  };

  // Toast style configurations
  const toastStyles = {
    success: {
      style: {
        background: '#059669',
        color: '#ffffff',
        border: 'none',
      }
    },
    error: {
      style: {
        background: '#dc2626',
        color: '#ffffff',
        border: 'none',
      }
    },
    warning: {
      style: {
        background: '#d97706',
        color: '#ffffff',
        border: 'none',
      }
    }
  };

  // Update handleSubmit to include subtasks
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        const deadlineISO = new Date(deadline).toISOString();
      
        if (task) {
          // Update existing task
          const updatedTask = {
            ...task,
            title,
            description,
            status,
            priority,
            deadline: deadlineISO,
            assignees,
            documents,
            comments,
            labels,
            subtasks: localSubtasks // Use localSubtasks for both new and existing tasks
          };
          updateTask(updatedTask);
          toast.success('Task updated successfully!', toastStyles.success);
        } else {
          // Create new task
          const newTask: Task = {
            id: crypto.randomUUID(),
            title,
            description,
            status: columns[0]?.id || 'col-1',
            priority,
            deadline: deadlineISO,
            createdAt: new Date().toISOString(),
            assignees,
            documents,
            comments,
            labels,
            subtasks: localSubtasks
          };
          updateTask(newTask);
          toast.success('Task created successfully!', toastStyles.success);
        }
        onClose();
      } catch (error) {
        toast.error('Failed to save task. Please try again.', toastStyles.error);
        console.error('Task save error:', error);
      }
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    
    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!deadline) {
      newErrors.deadline = 'Deadline is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddAssignee = () => {
    const name = newAssigneeName.trim();
    if (name && !assignees.some(a => a.name.toLowerCase() === name.toLowerCase())) { // Prevent duplicates (case-insensitive)
      const newAssignee: TeamMember = {
        id: `temp-${Date.now()}-${name.replace(/\s+/g, '-')}`, // Temporary unique ID
        name: name,
        role: 'Member', // Default role
        email: `${name.toLowerCase().replace(/\s+/g, '.')}@example.com`, // Placeholder email
        avatar: null, // Use null instead of undefined
      };
      setAssignees([...assignees, newAssignee]);
      setNewAssigneeName(''); // Clear input
    } else if (!name) {      toast.error("Please enter an assignee name.", toastStyles.error);
    } else {
      toast.warning(`Assignee "${name}" already added.`, toastStyles.warning);
    }
  };

  const handleRemoveAssignee = (assigneeId: string) => {
    console.log("Remove assignee logic goes here", assigneeId);
    // Example: setAssignees(assignees.filter(a => a.id !== assigneeId));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      console.log("File upload logic goes here", files);
      // Example: Upload file, get URL/details, then:
      // const newDocument: Document = { id: 'temp-doc-id', name: files[0].name, type: files[0].type, url: 'temp-url', uploadedBy: 'current-user', uploadedAt: new Date().toISOString() };
      // setDocuments([...documents, newDocument]);
    }
  };

  const handleRemoveDocument = (documentId: string) => {
     console.log("Remove document logic goes here", documentId);
     // Example: setDocuments(documents.filter(d => d.id !== documentId));
  };

  // --- Label Handlers ---
  const handleAddLabel = () => {
    const labelToAdd = newLabel.trim();
    if (!labelToAdd) {      toast.error("Please enter a label name.", toastStyles.error);
      return;
    }
    if (labels.includes(labelToAdd)) {
      toast.warning(`Label "${labelToAdd}" already exists.`, toastStyles.warning);
      return;
    }

    // Update local state regardless of whether it's a new or existing task
    setLabels([...labels, labelToAdd]); 
    setNewLabel(''); 

    // Call context function only if it's an existing task
    if (task) {
      addLabel(task.id, labelToAdd); 
    }
  };

  const handleRemoveLabel = (labelToRemove: string) => {
    // Update local state
    setLabels(labels.filter(l => l !== labelToRemove)); 

    // Call context function only if it's an existing task
    if (task) {
      removeLabel(task.id, labelToRemove); 
    }
  };

  // --- Comment Handlers ---
  const handleAddComment = () => {
    const commentText = newComment.trim();
    if (!commentText) {      toast.error("Please enter a comment.", toastStyles.error);
      return;
    }

    // TODO: Replace 'current-user-id' with actual logged-in user ID
    const authorId = 'current-user-id'; 
    const tempCommentId = `temp-comment-${Date.now()}`; // Temporary ID for local state

    const newCommentObject: Comment = {
      id: tempCommentId,
      taskId: task ? task.id : 'new-task', // Use placeholder if new task
      authorId: authorId,
      text: commentText,
      createdAt: new Date().toISOString(),
    };

    // Update local state immediately
    setComments([...comments, newCommentObject]);
    setNewComment(''); 

    // Call context function only if it's an existing task
    if (task) {
      addComment(task.id, authorId, commentText); 
      // Note: The comment added via context will have a real ID, 
      // the local state update is mainly for immediate UI feedback.
      // The useEffect will sync state when the task prop updates.
    }
  };

  // Helper to format comment date
  const formatCommentDate = (isoString: string) => {
    return new Date(isoString).toLocaleString('en-US', {
      dateStyle: 'short',
      timeStyle: 'short',
    });
  };

  // Helper to format ISO string to YYYY-MM-DDTHH:mm for datetime-local input
  const formatDateTimeLocal = (isoString: string): string => {
    const date = new Date(isoString);
    // Adjust for timezone offset to display local time correctly in the input
    const timezoneOffset = date.getTimezoneOffset() * 60000; // offset in milliseconds
    const localISOTime = new Date(date.getTime() - timezoneOffset).toISOString().slice(0, 16);
    return localISOTime;
  };

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      if (task) {
        // Load existing task data
        setTitle(task.title);
        setDescription(task.description);
        setStatus(task.status);
        setPriority(task.priority);
        setDeadline(task.deadline ? formatDateTimeLocal(task.deadline) : '');
        setAssignees(task.assignees || []);
        setDocuments(task.documents || []);
        setComments(task.comments || []);
        setLabels(task.labels || []);
        setLocalSubtasks(task.subtasks || []);
      } else {
        // Reset form for new task
        setTitle('');
        setDescription('');
        // Ensure new tasks start in the first column
        const firstColumn = columns[0];
        if (firstColumn) {
          setStatus(firstColumn.id);
          console.log('Setting new task to first column:', firstColumn.title);
        }
        setPriority('medium');
        setDeadline('');
        setAssignees([]);
        setDocuments([]);
        setComments([]);
        setLabels([]);
        setLocalSubtasks([]);
      }
    }
  }, [isOpen, task, columns]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">
            {task ? 'Edit Task' : 'Create New Task'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="title">
              Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`w-full px-3 py-2 border ${
                errors.title ? 'border-red-500' : 'border-gray-300'
              } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
              placeholder="Task title"
            />
            {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title}</p>}
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Task description"
            />
          </div>
          
          <div className="flex space-x-4 mb-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="status">
                Status
              </label>
              <select
                id="status"
                value={status}
                // No need for 'as Status' anymore, value is string
                onChange={(e) => setStatus(e.target.value)} 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {/* Dynamically populate options from columns context */}
                {columns.map((col) => (
                  <option key={col.id} value={col.id}>
                    {col.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="priority">
                Priority
              </label>
              <select
                id="priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="deadline">
              Deadline
            </label>
            <div className="relative">
              <input
                id="deadline"
                type="datetime-local" // Changed type to datetime-local
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className={`w-full px-3 py-2 pl-9 border ${
                  errors.deadline ? 'border-red-500' : 'border-gray-300'
                } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
            </div>
            {errors.deadline && <p className="mt-1 text-xs text-red-500">{errors.deadline}</p>}
          </div>

          {/* Assignees Section - Placeholder */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Assignees</label>
            <div className="flex items-center space-x-2 mb-2">
              {/* Display current assignees (e.g., avatars or names) */}
              {assignees.map(a => (
                <span key={a.id} className="text-xs bg-gray-200 px-2 py-1 rounded-full flex items-center">
                  {a.name}
                  <button type="button" onClick={() => handleRemoveAssignee(a.id)} className="ml-1 text-gray-500 hover:text-red-500">
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
            <button
              type="button"
              onClick={handleAddAssignee}
              className="flex items-center text-sm text-blue-600 hover:text-blue-800"
            >
              <UserPlus className="w-4 h-4 mr-1" /> Add Person
            </button>
            {/* Assignee Input */}
            <div className="flex items-center space-x-2 mt-2">
              <input
                type="text"
                value={newAssigneeName}
                onChange={(e) => setNewAssigneeName(e.target.value)}
                placeholder="Enter assignee name"
                className="flex-grow px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={handleAddAssignee}
                className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-md text-sm hover:bg-blue-200"
              >
                Add
              </button>
            </div>
          </div>

          {/* Documents Section */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Documents</label>
            <div className="space-y-2 mb-2">
              {/* Display current documents */}
              {documents.map(doc => (
                <div key={doc.id} className="flex items-center justify-between text-sm bg-gray-100 px-2 py-1 rounded">
                  <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline truncate mr-2">
                    {doc.name} ({doc.type})
                  </a>
                  <button type="button" onClick={() => handleRemoveDocument(doc.id)} className="text-gray-500 hover:text-red-500">
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
            <div className="relative">
               <input
                 type="file"
                 id="file-upload"
                 onChange={handleFileUpload}
                 className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                 // multiple // Add if multiple file uploads are needed at once
               />
               <label
                 htmlFor="file-upload"
                 className="flex items-center justify-center px-3 py-2 border border-dashed border-gray-300 rounded-md text-sm text-gray-600 hover:bg-gray-50 cursor-pointer"
               >
                 <Paperclip className="w-4 h-4 mr-1" /> Upload Document
               </label>
            </div>
             {/* TODO: Implement file upload progress/error handling */}
          </div>

          {/* Labels Section - Always show */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Labels</label>
            <div className="flex flex-wrap gap-2 mb-2">
                {labels.map(label => (
                  <span key={label} className="flex items-center bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    {label}
                    <button
                      type="button"
                      onClick={() => handleRemoveLabel(label)}
                      className="ml-1.5 text-blue-500 hover:text-blue-700"
                      aria-label={`Remove label ${label}`}
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  placeholder="Add a label..."
                  className="flex-grow px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddLabel())} // Add on Enter key
                />
                <button
                  type="button"
                  onClick={handleAddLabel}
                  className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-md text-sm hover:bg-blue-200 flex items-center"
                >
                  <Plus size={14} className="mr-1" /> Add
                </button>
              </div>
            </div>
          {/* Removed extra closing div here */}
          
          {/* Comments Section - Always show */}
          <div className="mb-6 pt-4 border-t border-gray-200">
            <label className="block text-sm font-medium text-gray-700 mb-2">Comments</label>
            <div className="space-y-3 max-h-40 overflow-y-auto mb-3 pr-2">
                {comments.length > 0 ? comments.map(comment => (
                  <div key={comment.id} className="text-sm bg-gray-50 p-2 rounded">
                    <p className="text-gray-800">{comment.text}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      By {comment.authorId} on {formatCommentDate(comment.createdAt)}
                    </p>
                  </div>
                )) : (
                  <p className="text-sm text-gray-500 italic">No comments yet.</p>
                )}
              </div>
              <div className="flex items-start space-x-2">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  rows={2}
                  className="flex-grow px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={handleAddComment}
                  className="px-3 py-1.5 bg-green-100 text-green-700 rounded-md text-sm hover:bg-green-200 flex items-center self-end"
                >
                   <MessageSquare size={14} className="mr-1" /> Post
                </button>
              </div>
            </div>
          {/* Changed closing tag from )} to </div> */}
          
          <div className="flex justify-between items-center pt-4 border-t border-gray-200 mt-6">
            {task && onDelete && (
              <button
                type="button"
                onClick={() => {                  if (window.confirm('Are you sure you want to delete this task?')) {
                    onDelete(task.id);
                    toast.success('Task deleted successfully!', toastStyles.success);
                    onClose();
                  }
                }}
                className="flex items-center text-red-500 hover:text-red-700 transition-colors"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Delete
              </button>
            )}
            <div className="flex space-x-2 ml-auto">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 rounded-md text-white hover:bg-blue-700 transition-colors"
              >
                {task ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </form>        {/* Subtasks Section */}
        <div className="space-y-2 p-4 border-t border-gray-200">
          <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <CheckSquare className="h-4 w-4" />
            Subtasks
          </h3>
          <SubtaskList
            subtasks={localSubtasks}
            onToggle={(id) => {
              const updatedSubtasks = (task?.subtasks || localSubtasks).map(st =>
                st.id === id ? { ...st, completed: !st.completed } : st
              );
              setLocalSubtasks(updatedSubtasks);
              if (task) {
                updateTask({
                  ...task,
                  subtasks: updatedSubtasks
                });
              }
            }}
            onAdd={(title, assigneeId) => {
              const assignee = assigneeId ? assignees.find(a => a.id === assigneeId) : undefined;
              const newSubtask: SubTask = {
                id: crypto.randomUUID(),
                title,
                completed: false,
                createdAt: new Date().toISOString(),
                assignee
              };
              const updatedSubtasks = [...(task?.subtasks || localSubtasks), newSubtask];
              setLocalSubtasks(updatedSubtasks);
              if (task) {
                updateTask({
                  ...task,
                  subtasks: updatedSubtasks
                });
              }
              toast.success('Subtask added successfully!', toastStyles.success);
            }}
            onDelete={(id) => {
              const updatedSubtasks = (task?.subtasks || localSubtasks).filter(st => st.id !== id);
              setLocalSubtasks(updatedSubtasks);
              if (task) {
                updateTask({
                  ...task,
                  subtasks: updatedSubtasks
                });
              }
              toast.success('Subtask removed successfully!', toastStyles.success);
            }}
            onAssign={handleAssignSubtask}
            availableAssignees={assignees}
          />
        </div>
      </div>
    </div>
  );
};

export default TaskModal;
