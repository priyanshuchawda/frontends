import React from 'react';
import { Priority, Column } from '../../types'; // Removed Status, Added Column
import { Filter, ChevronDown } from 'lucide-react';

interface FilterBarProps {
  columns: Column[]; // Add columns prop
  onFilterStatus: (status?: string) => void; // Changed Status to string
  onFilterPriority: (priority?: Priority) => void;
  onFilterDeadline: (deadline?: string) => void;
  activeFilters: {
    status?: string; // Changed Status to string
    priority?: Priority;
    deadline?: string;
  };
}

const FilterBar: React.FC<FilterBarProps> = ({
  columns, // Destructure columns
  onFilterStatus,
  onFilterPriority,
  onFilterDeadline,
  activeFilters,
}) => {
  return (
    <div className="flex items-center space-x-2">
      <div className="flex items-center">
        <Filter className="h-4 w-4 text-gray-500 mr-2" />
        <span className="text-sm text-gray-600 mr-2">Filter:</span>
      </div>

      {/* Status Filter */}
      <div className="relative inline-block group">
        <button
          className={`flex items-center px-3 py-1.5 text-sm rounded-md ${
            activeFilters.status
              ? 'bg-blue-100 text-blue-700'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Status
          <ChevronDown className="h-3 w-3 ml-1" />
        </button>
        <div className="absolute left-0 mt-1 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10 hidden group-hover:block">
          <div className="py-1" role="menu" aria-orientation="vertical">
            <button
              className={`block w-full text-left px-4 py-2 text-sm ${
                !activeFilters.status ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
              }`}
              onClick={() => onFilterStatus(undefined)}
            >
              All Statuses
            </button>
            {/* Dynamically generate status filters from columns */}
            {columns.map((column) => (
              <button
                key={column.id}
                className={`block w-full text-left px-4 py-2 text-sm ${
                  activeFilters.status === column.id ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                }`}
                onClick={() => onFilterStatus(column.id)}
              >
                {column.title}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Priority Filter */}
      <div className="relative inline-block group">
        <button
          className={`flex items-center px-3 py-1.5 text-sm rounded-md ${
            activeFilters.priority
              ? 'bg-blue-100 text-blue-700'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Priority
          <ChevronDown className="h-3 w-3 ml-1" />
        </button>
        <div className="absolute left-0 mt-1 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10 hidden group-hover:block">
          <div className="py-1" role="menu" aria-orientation="vertical">
            <button
              className={`block w-full text-left px-4 py-2 text-sm ${
                !activeFilters.priority ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
              }`}
              onClick={() => onFilterPriority(undefined)}
            >
              All Priorities
            </button>
            <button
              className={`block w-full text-left px-4 py-2 text-sm ${
                activeFilters.priority === 'high' ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
              }`}
              onClick={() => onFilterPriority('high')}
            >
              High
            </button>
            <button
              className={`block w-full text-left px-4 py-2 text-sm ${
                activeFilters.priority === 'medium' ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
              }`}
              onClick={() => onFilterPriority('medium')}
            >
              Medium
            </button>
            <button
              className={`block w-full text-left px-4 py-2 text-sm ${
                activeFilters.priority === 'low' ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
              }`}
              onClick={() => onFilterPriority('low')}
            >
              Low
            </button>
          </div>
        </div>
      </div>

      {/* Deadline Filter */}
      <div className="relative inline-block group">
        <button
          className={`flex items-center px-3 py-1.5 text-sm rounded-md ${
            activeFilters.deadline
              ? 'bg-blue-100 text-blue-700'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Deadline
          <ChevronDown className="h-3 w-3 ml-1" />
        </button>
        <div className="absolute left-0 mt-1 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10 hidden group-hover:block">
          <div className="py-1" role="menu" aria-orientation="vertical">
            <button
              className={`block w-full text-left px-4 py-2 text-sm ${
                !activeFilters.deadline ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
              }`}
              onClick={() => onFilterDeadline(undefined)}
            >
              All Deadlines
            </button>
            <button
              className={`block w-full text-left px-4 py-2 text-sm ${
                activeFilters.deadline === 'overdue' ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
              }`}
              onClick={() => onFilterDeadline('overdue')}
            >
              Overdue
            </button>
            <button
              className={`block w-full text-left px-4 py-2 text-sm ${
                activeFilters.deadline === 'today' ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
              }`}
              onClick={() => onFilterDeadline('today')}
            >
              Due Today
            </button>
            <button
              className={`block w-full text-left px-4 py-2 text-sm ${
                activeFilters.deadline === 'week' ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
              }`}
              onClick={() => onFilterDeadline('week')}
            >
              Due This Week
            </button>
            <button
              className={`block w-full text-left px-4 py-2 text-sm ${
                activeFilters.deadline === 'future' ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
              }`}
              onClick={() => onFilterDeadline('future')}
            >
              Future
            </button>
          </div>
        </div>
      </div>

      {(activeFilters.status || activeFilters.priority || activeFilters.deadline) && (
        <button
          className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800"
          onClick={() => {
            onFilterStatus(undefined);
            onFilterPriority(undefined);
            onFilterDeadline(undefined);
          }}
        >
          Clear Filters
        </button>
      )}
    </div>
  );
};

export default FilterBar;
