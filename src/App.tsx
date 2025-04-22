import { useState } from 'react'; // Removed useEffect
// Removed Menu import
// Removed motion, AnimatePresence imports
import { toast } from 'sonner';
import Board from './components/Board/Board';
import Header from './components/Header/Header'; // Import the Header component
import DocumentsView from './components/Documents/DocumentsView';
import Sidebar from './components/Layout/Sidebar';
import WelcomeView from './components/Welcome/WelcomeView';
import { TaskProvider, useTaskContext } from './contexts/TaskContext';
import { ToastProvider } from './components/UI/Toast';
// Removed Status import

// Inner component that can access context
function AppContent() {
  const [activeView, setActiveView] = useState('welcome'); // Default to welcome view
  // const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Removed state for sidebar visibility
  const [activeStatus, setActiveStatus] = useState<string | null>(null); // Changed Status to string
  const { setActiveFilters, columns } = useTaskContext(); // Get columns for header title

  // Initialize filters (no default status filter needed now)
  // useEffect(() => {
  //   setActiveFilters(prev => ({
  //     ...prev,
  //     status: 'todo' // Removed default status filter
  //   }));
  // }, [setActiveFilters]);

  // CombineYd handler for status changes
  const handleStatusChange = (status: string | null) => { // Changed Status to string
    console.log(`[App] handleStatusChange: status=${status}, currentView=${activeView}`);
    setActiveStatus(status); // Update local state for Board prop
    setActiveView('board'); // Always switch to board view when status changes

    if (status) {
      const columnTitle = columns.find(c => c.id === status)?.title || status; // Get column title
      toast.success(`Filtered to "${columnTitle}" tasks`); // Use column title
    } else {
      toast.info('Showing all tasks');
    }
    
    // Synchronize with context filters
    setActiveFilters(prev => ({
      ...prev,
      status: status ?? undefined // Convert null to undefined for the context
    }));
  };

  // Handle view changes
  const handleViewChange = (view: string, isFromWelcome: boolean = false) => {
    console.log(`[App] handleViewChange: view=${view}, currentStatus=${activeStatus}, fromWelcome=${isFromWelcome}`);

    let newActiveStatus = activeStatus;

    // If navigating from Welcome to Board, show all tasks
    if (isFromWelcome && view === 'board') {
      console.log("[App] Navigating from Welcome to Board, setting activeStatus to null.");
      newActiveStatus = null;
    } 
    // Clear status filter when changing to welcome view
    else if (view === 'welcome') {
      console.log(`[App] Clearing status filter because view changed to ${view}`);
      newActiveStatus = null;
    }
    // Clear status filter only when changing to a non-board view (and not coming from welcome)
    else if (view !== 'board' && !isFromWelcome && activeStatus !== null) {
      console.log(`[App] Clearing status filter because view changed to ${view}`);
      newActiveStatus = null;
    }

    // Update local state first
    setActiveStatus(newActiveStatus);
    
    // Update context filters if status changed
    if (newActiveStatus !== activeStatus) {
       setActiveFilters(prev => ({ ...prev, status: newActiveStatus ?? undefined }));
    }
    
    // Update the active view
    setActiveView(view);
    
    // Sidebar is now always open, no need to manage state
    // setIsSidebarOpen(true); 
  };

  const renderActiveView = () => {
    switch (activeView) {
      case 'documents':
        return (
          <main className="flex-1 overflow-y-auto">
            <DocumentsView />
          </main>
        );
      case 'board':
        return (
          <main className="flex-1 overflow-y-auto py-4"> {/* Changed p-4 to py-4 */}
            <Board activeStatus={activeStatus} />
          </main>
        );
      case 'welcome': // Added welcome case explicitly
      default:
        return (
          <WelcomeView
            onGetStarted={() => handleViewChange('board', true)} // Pass flag indicating source
          />
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-accentCustom text-foreground">
      <Sidebar
        // isOpen={isSidebarOpen} // Removed isOpen prop
        // onClose={() => setIsSidebarOpen(false)} // Removed onClose prop
        activeView={activeView}
        setActiveView={handleViewChange}
        activeStatus={activeStatus} // Type is now string | null
        setActiveStatus={handleStatusChange} // Type is now (status: string | null) => void
      />

      <div
        className="flex flex-1 flex-col md:ml-64" // Sidebar width margin applied permanently on md+ screens
      >
        {/* Replace inline header with the Header component */}
        <Header /> {/* Removed onToggleSidebar prop */}

        {/* Removed AnimatePresence and motion.div wrapper */}
        <div className="flex flex-1 flex-col overflow-y-auto">
          {renderActiveView()}
        </div>

        {activeView !== 'welcome' && (
          <footer className="mt-auto shrink-0 border-t border-border bg-card py-3 px-6 text-center text-sm text-muted-foreground">
            Project Management Board © {new Date().getFullYear()}
          </footer>
        )}
      </div>
    </div>
  );
}

// Main App component with providers
function App() {
  return (
    <TaskProvider>
      <AppContent /> {/* AppContent now uses columns from context */}
      <ToastProvider />
    </TaskProvider>
  );
}

export default App;
