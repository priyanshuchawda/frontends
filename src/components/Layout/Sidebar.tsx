import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  ChevronDown,
  Home, // Added Home icon
  List, // Added List icon for dynamic columns
} from 'lucide-react';
// import { Column } from '../../types'; // Removed unused Column import
import { useTaskContext } from '../../contexts/TaskContext'; // Import context hook

interface SidebarProps {
  // isOpen: boolean; // Removed prop
  // onClose: () => void; // Removed prop
  activeView: string;
  setActiveView: (view: string) => void;
  activeStatus: string | null; // Changed Status to string
  setActiveStatus: (status: string | null) => void; // Changed Status to string
}

const Sidebar: React.FC<SidebarProps> = ({
  // isOpen, // Removed prop
  // onClose, // Removed unused prop
  activeView,
  setActiveView,
  activeStatus,
  setActiveStatus,
}) => {
  const [isBoardExpanded, setIsBoardExpanded] = useState(true);
  const { columns } = useTaskContext(); // Get columns from context

  const handleStatusClick = (status: string | null) => { // Changed Status to string
    console.log("[Sidebar] Status click:", {
      from: activeStatus,
      to: status,
      currentView: activeView 
    });
    
    setActiveView('board');  // First, switch to board view
    setActiveStatus(status); // Then update the status
  };

  // Dynamically generate board sub-items from columns context
  const boardSubItems: { id: string; icon: React.ElementType; label: string; status: string | null }[] = [ // Changed Status to string
    { id: 'all', icon: LayoutDashboard, label: 'Show All', status: null },
    // Map over columns from context
    ...columns.map(col => ({
      id: col.id,
      icon: List, // Use a default icon for dynamic columns for now
      label: col.title,
      status: col.id, // Use the column ID as the status filter value
    })),
  ];

  //const menuItems: { id: string; icon: React.ElementType; label: string }[] = [
  //  { id: 'calendar', icon: Calendar, label: 'Calendar' },
  //  { id: 'team', icon: Users, label: 'Team' },
  //  { id: 'settings', icon: Settings, label: 'Settings' },
  //];

  // Removed sidebarVariants as animation is no longer needed

  const subMenuVariants = {
    open: {
      height: 'auto',
      opacity: 1,
      transition: { duration: 0.2 },
    },
    closed: {
      height: 0,
      opacity: 0,
      transition: { duration: 0.2 },
    },
  };

  return (
    // Removed motion.div wrapper, using a standard div now
    <div
      className="fixed inset-y-0 left-0 z-50 hidden w-64 flex-col border-r border-border bg-white shadow-lg md:flex" // Hidden on small screens, flex on medium+
    >
      {/* Header section */}
      <div className="flex h-16 shrink-0 items-center border-b border-border p-4"> {/* Removed justify-between */}
        <h2 className="text-lg font-semibold text-card-foreground">Project Hub</h2>
        {/* Removed Close Button */}
      </div>

      {/* Navigation - Make scrollable */}
      <nav className="flex-1 space-y-2 overflow-y-auto p-4"> {/* Increased space-y */}
        {/* Home Button */}
        <button
          onClick={() => setActiveView('welcome')}
          className={`flex w-full items-center rounded-md px-3 py-2 text-sm font-medium transition-colors ${
            activeView === 'welcome'
              ? 'bg-primary/10 text-primary'
              : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
          }`}
        >
          <Home className="mr-2.5 h-5 w-5" />
          Home
        </button>

        {/* Board Section Toggle */}
        <div>
          <button
            onClick={() => setIsBoardExpanded(!isBoardExpanded)}
            className="flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            aria-expanded={isBoardExpanded}
            aria-controls="board-submenu"
          >
            <div className="flex items-center">
              <LayoutDashboard className="mr-2.5 h-5 w-5" />
              Board
            </div>
            <ChevronDown
              className={`h-4 w-4 transition-transform ${
                isBoardExpanded ? 'rotate-180' : ''
              }`}
              aria-hidden="true"
            />
          </button>
          <AnimatePresence initial={false}>
            {isBoardExpanded && (
              <motion.div
                id="board-submenu"
                initial="closed"
                animate="open"
                exit="closed"
                variants={subMenuVariants}
                className="ml-4 overflow-hidden"
              >
                {/* Board Sub-items */}
                {boardSubItems.map((item) => {
                  const isSubItemActive = activeView === 'board' && activeStatus === item.status;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleStatusClick(item.status)}
                      className={`mt-1 flex w-full items-center rounded-md py-2 pl-7 pr-3 text-left text-sm transition-colors ${
                        isSubItemActive
                          ? 'bg-primary/10 font-medium text-primary' // Active style
                          : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground' // Default style
                      }`}
                    >
                      <item.icon className="mr-2.5 h-4 w-4 flex-shrink-0" />
                      {item.label}
                    </button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Other Menu Items */}
      </nav>

      {/* Footer section - Theme Toggle */}
    </div> // Changed closing tag to div
  );
};

export default Sidebar;
