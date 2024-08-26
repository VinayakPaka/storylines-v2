import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { IconX } from '@tabler/icons-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className={`sidebar ${isOpen ? 'open' : ''}`}>
      <button onClick={onClose} className="absolute top-4 right-4 p-2">
        <IconX size={24} />
      </button>
      <ul>
        <li className={isActive('/home') ? 'active' : ''}>
          <Link to="/home" onClick={onClose}>Home</Link>
        </li>
        <li className={isActive('/favorites') ? 'active' : ''}>
          <Link to="/favorites" onClick={onClose}>Favorites</Link>
        </li>
        <li className={isActive('/settings') ? 'active' : ''}>
          <Link to="/settings" onClick={onClose}>Settings</Link>
        </li>
        <li className={isActive('/help') ? 'active' : ''}>
          <Link to="/help" onClick={onClose}>Help</Link>
        </li>
        <li className={isActive('/story-map/:id') ? 'active' : ''}>
          <Link to="/story-map/1" onClick={onClose}>Story Map</Link>
        </li>
        <li className={isActive('/story') ? 'active' : ''}>
          <Link to="/story" onClick={onClose}>Display Story</Link>
        </li>
        <li className={isActive('/create-story') ? 'active' : ''}>
          <Link to="/create-story" onClick={onClose}>Create Story</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Sidebar;