import React, { useState, useEffect, useRef } from 'react';

interface ProfileDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProfileDropdown: React.FC<ProfileDropdownProps> = ({ isOpen, onClose }) => {
  const [name, setName] = useState('Priyanshu Chawda');
  const [linkedin, setLinkedin] = useState('priyanshuchawda');
  const [github, setGithub] = useState('priyanshuchawda');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown if clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleSave = () => {
    // In a real app, you'd save this data (e.g., to context, local storage, or API)
    console.log('Saving profile:', { name, linkedin, github });
    alert('Profile details updated (mock save)!'); // Simple feedback
    onClose(); // Close dropdown after save
  };

  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 mt-2 w-64 origin-top-right rounded-md bg-card shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-30 border border-border"
      role="menu"
      aria-orientation="vertical"
      aria-labelledby="user-menu-button"
    >
      <div className="p-4 space-y-3">
        <h3 className="text-sm font-medium text-foreground">Profile Details</h3>
        <div>
          <label htmlFor="profile-name" className="block text-xs font-medium text-muted-foreground">
            Name
          </label>
          <input
            type="text"
            id="profile-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full rounded-md border-input bg-background px-3 py-1.5 text-sm shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
          />
        </div>
        <div>
          <label htmlFor="profile-linkedin" className="block text-xs font-medium text-muted-foreground">
            LinkedIn Handle
          </label>
          <input
            type="text"
            id="profile-linkedin"
            value={linkedin}
            onChange={(e) => setLinkedin(e.target.value)}
            className="mt-1 block w-full rounded-md border-input bg-background px-3 py-1.5 text-sm shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
          />
        </div>
        <div>
          <label htmlFor="profile-github" className="block text-xs font-medium text-muted-foreground">
            GitHub Handle
          </label>
          <input
            type="text"
            id="profile-github"
            value={github}
            onChange={(e) => setGithub(e.target.value)}
            className="mt-1 block w-full rounded-md border-input bg-background px-3 py-1.5 text-sm shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
          />
        </div>
        <div className="flex justify-end space-x-2 pt-2">
           <button
             type="button"
             onClick={onClose}
             className="px-3 py-1.5 text-sm rounded-md border border-input hover:bg-accent hover:text-accent-foreground"
           >
             Cancel
           </button>
           <button
             type="button"
             onClick={handleSave}
             className="px-3 py-1.5 text-sm rounded-md bg-primary text-primary-foreground hover:bg-primary/90"
           >
             Save
           </button>
         </div>
      </div>
    </div>
  );
};

export default ProfileDropdown;
