import { Task, Priority, TeamMember, Document, Comment } from '../types'; // Removed Status, Added Comment

export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 9);
};

export const createTask = (
  title: string,
  description: string,
  status: string,
  priority: Priority,
  deadline: string,
  assignees: TeamMember[] = [],
  documents: Document[] = [],
  comments: Comment[] = [],
  labels: string[] = []
): Task => {
  return {
    id: generateId(),
    title,
    description,
    status,
    priority,
    deadline,
    createdAt: new Date().toISOString(),
    assignees,
    documents,
    comments,
    labels,
    subtasks: [], // Initialize with empty subtasks array
  };
};

// Define mock team members with avatars from ui-avatars.com
const mockAssignees: TeamMember[] = [
  { id: 'tm-1', name: 'Priyanshu', role: 'Developer', email: 'priyanshu@example.com', avatar: 'https://ui-avatars.com/api/?name=Priyanshu&background=random&color=fff' },
  { id: 'tm-2', name: 'Madhura', role: 'Designer', email: 'madhura@example.com', avatar: 'https://ui-avatars.com/api/?name=Madhura&background=random&color=fff' },
  { id: 'tm-3', name: 'Aditya', role: 'QA', email: 'aditya@example.com', avatar: 'https://ui-avatars.com/api/?name=Aditya&background=random&color=fff' },
  { id: 'tm-4', name: 'Ariv', role: 'Developer', email: 'ariv@example.com', avatar: 'https://ui-avatars.com/api/?name=Ariv&background=random&color=fff' },
  { id: 'tm-5', name: 'Supriya', role: 'Project Manager', email: 'supriya@example.com', avatar: 'https://ui-avatars.com/api/?name=Supriya&background=random&color=fff' },
];

export const getInitialTasks = (): Task[] => [
  {
    id: '1',
    title: 'Design user dashboard',
    description: 'Create wireframes and mockups for the user dashboard.',
    status: 'col-2',
    priority: 'high',
    deadline: new Date(Date.now() + 86400000 * 2).toISOString(),
    createdAt: new Date().toISOString(),
    assignees: [mockAssignees[1]],
    documents: [],
    comments: [],
    labels: ['design', 'ui/ux'],
    subtasks: [
      {
        id: 'st-1',
        title: 'Create wireframes',
        completed: true,
        createdAt: new Date().toISOString()
      },
      {
        id: 'st-2',
        title: 'Design mockups',
        completed: false,
        createdAt: new Date().toISOString()
      }
    ]
  },
  {
    id: '2',
    title: 'Update API documentation',
    description: 'Review and update the API documentation with the latest endpoints.',
    status: 'col-2', // Changed from 'in-progress'
    priority: 'medium',
    deadline: new Date(Date.now() - 86400000).toISOString(),
    createdAt: new Date().toISOString(),
    assignees: [mockAssignees[0], mockAssignees[3]], // Priyanshu, Ariv
    documents: [],
    comments: [], // Added
    labels: ['Documentation', 'API'], // Added example labels
  },
  {
    id: '3',
    title: 'Fix login page bug',
    description: 'The login page has an issue with form validation. Fix it.',
    status: 'col-3', // Changed from 'review'
    priority: 'high',
    deadline: new Date(Date.now() + 86400000).toISOString(),
    createdAt: new Date().toISOString(),
    assignees: [mockAssignees[2]], // Aditya
    documents: [],
    comments: [], // Added
    labels: ['Bugfix', 'High Priority'], // Added example labels
  },
  {
    id: '4',
    title: 'Set up automated testing',
    description: 'Configure Jest and implement unit tests for core components.',
    status: 'col-2', // Changed from 'in-progress'
    priority: 'low',
    deadline: new Date(Date.now() + 86400000 * 7).toISOString(),
    createdAt: new Date().toISOString(),
    assignees: [mockAssignees[0]], // Priyanshu
    documents: [],
    comments: [], // Added
    labels: ['Testing', 'Setup'], // Added example labels
  },
  {
    id: '5',
    title: 'Deploy v1.0 to production',
    description: 'Finalize release notes and deploy to production environment.',
    status: 'col-4', // Changed from 'done'
    priority: 'high',
    deadline: new Date(Date.now() - 86400000 * 3).toISOString(),
    createdAt: new Date().toISOString(),
    assignees: [mockAssignees[4]], // Supriya
    documents: [],
    comments: [], // Added
    labels: ['Deployment', 'Release'], // Added example labels
  },
  {
    id: '6',
    title: 'Customer feedback review',
    description: 'Analyze recent customer feedback and create action items.',
    status: 'col-2', // Changed from 'in-progress'
    priority: 'medium',
    deadline: new Date(Date.now() + 86400000 * 1).toISOString(),
    createdAt: new Date().toISOString(),
    assignees: [mockAssignees[4], mockAssignees[2]], // Supriya, Aditya
    documents: [],
    comments: [], // Added
    labels: ['Feedback', 'Analysis'], // Added example labels
  },
  {
    id: '7',
    title: 'Weekly team meeting',
    description: 'Prepare agenda and meeting notes for weekly sync.',
    status: 'col-2', // Changed from 'in-progress'
    priority: 'medium',
    deadline: new Date(Date.now() + 86400000 * 2).toISOString(),
    createdAt: new Date().toISOString(),
    assignees: [mockAssignees[4]], // Supriya
    documents: [],
    comments: [], // Added
    labels: ['Meeting', 'Planning'], // Added example labels
  },
  {
    id: '8',
    title: 'Research new technology stack',
    description: 'Evaluate potential technologies for the next project.',
    status: 'col-2', // Changed from 'in-progress'
    priority: 'low',
    deadline: new Date(Date.now() + 86400000 * 14).toISOString(),
    createdAt: new Date().toISOString(),
    assignees: [mockAssignees[1], mockAssignees[3]], // Madhura, Ariv
    documents: [],
    comments: [], // Added
    labels: ['Research', 'Tech Stack'], // Added example labels
  },
];
