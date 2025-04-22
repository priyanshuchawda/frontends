export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
  assignee?: TeamMember; // Optional assignee for the subtask
}

export type Priority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: Priority;
  deadline: string;
  createdAt: string;
  assignees: TeamMember[];
  documents: Document[];
  comments: Comment[];
  labels: string[];
  subtasks: SubTask[]; // Added subtasks array
}

export interface Column {
  id: string; // Unique ID for the column
  title: string;
  icon?: string; // Optional icon for the column
  tasks: Task[];
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  avatar: string | null;
}

export interface Document {
  id: string;
  name: string;
  type: string;
  url: string;
  uploadedBy: string;
  uploadedAt: string;
}

export interface Comment {
  id: string;
  taskId: string; // Link back to the task
  authorId: string; // Link to TeamMember ID
  text: string;
  createdAt: string; // ISO date string
}
