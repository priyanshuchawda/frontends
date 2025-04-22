import React, { useState } from 'react';
import { ListFilter, User } from 'lucide-react'; // Removed unused Menu import
import SearchBar from '../UI/SearchBar';
import FilterBar from '../UI/FilterBar';
import { useTaskContext } from '../../contexts/TaskContext';
import TaskModal from '../Task/TaskModal';
import ProfileDropdown from './ProfileDropdown'; // Import the dropdown
import { Priority } from '../../types'; // Removed Status

// Removed HeaderProps interface as no props are needed now
// interface HeaderProps {
//   onToggleSidebar: () => void;
// }

const Header: React.FC = () => { // Changed to React.FC without props
  const { columns, searchTasks, activeFilters, setActiveFilters } = useTaskContext();
  const [showFilters, setShowFilters] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // Keep this if needed elsewhere, though Add Task button moved
  const [isProfileOpen, setIsProfileOpen] = useState(false); // State for profile dropdown

  const handleSearch = (term: string) => {
     searchTasks(term);
   };

  const handleFilterStatus = (status?: string) => {
    setActiveFilters((prev) => ({ ...prev, status }));
  };

  const handleFilterPriority = (priority?: Priority) => {
    setActiveFilters((prev) => ({ ...prev, priority }));
  };

  const handleFilterDeadline = (deadline?: string) => {
    setActiveFilters((prev) => ({ ...prev, deadline }));
  };

  return (
    <header className="bg-card border-b border-border py-3 px-6">
      {/* Removed outer div and Menu button */}
      {/* Actions (Search, Filter, Profile) - Now the main content of the header */}
      <div className="flex flex-1 items-center justify-end gap-2 sm:gap-3">
          {/* Removed flex-grow on the container div */}
          <div className="flex-grow sm:flex-grow-0 sm:w-64"> {/* Search bar takes available space or fixed width */}
            <SearchBar onSearch={handleSearch} />
          </div>

          {/* Filter Button */}
          <button
            className={`p-2 rounded-md transition-colors ${showFilters ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-accent'}`}
            onClick={() => setShowFilters(!showFilters)}
            aria-label="Toggle Filters"
            title="Toggle Filters"
          >
            <ListFilter className="h-5 w-5" />
          </button>

          {/* Profile Button & Dropdown Container */}
          <div className="relative">
            <button
              id="user-menu-button" // Added ID for aria-labelledby in dropdown
              className="p-2 rounded-full transition-colors text-muted-foreground hover:text-foreground hover:bg-accent"
              aria-label="User Profile"
              title="User Profile" // Tooltip updated
              onClick={() => setIsProfileOpen((prev) => !prev)} // Toggle dropdown
            >
              <User className="h-5 w-5" />
            </button>
            <ProfileDropdown
              isOpen={isProfileOpen}
              onClose={() => setIsProfileOpen(false)}
            />
          </div>
        {/* Removed extra closing </div> here, was causing the issue */}
      </div>

      {/* Filter Bar */}
      {showFilters && (
        <div className="mt-3 pt-3 border-t border-border">
          <FilterBar
            onFilterStatus={handleFilterStatus}
            onFilterPriority={handleFilterPriority}
            onFilterDeadline={handleFilterDeadline}
            activeFilters={activeFilters}
            columns={columns}
          />
        </div>
      )}

      {/* Task Modal (triggered elsewhere now) */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </header>
  );
};

export default Header;
