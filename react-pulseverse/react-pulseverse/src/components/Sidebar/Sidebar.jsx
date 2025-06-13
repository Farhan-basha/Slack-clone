
import React, { useState } from 'react';
import { Home, MessageSquare, User, Plus } from 'lucide-react';
import './Sidebar.css';

const Sidebar = ({ 
  activeMenuItem, 
  setActiveMenuItem,
  workspaces,
  currentWorkspace,
  setCurrentWorkspace,
  onProfileClick,
  onAddWorkspace,
  user
}) => {
  const [showAddWorkspaceModal, setShowAddWorkspaceModal] = useState(false);
  const [newWorkspaceName, setNewWorkspaceName] = useState('');

  const handleMenuItemClick = (item) => {
    setActiveMenuItem(item);
  };

  const getUserInitial = () => {
    if (!user) return '?';
    if (user.username) return user.username[0].toUpperCase();
    if (user.name) return user.name[0].toUpperCase();
    if (user.email) return user.email[0].toUpperCase();
    return '?';
  };

  const handleAddWorkspaceClick = () => {
    setShowAddWorkspaceModal(true);
  };

  const handleAddWorkspaceSubmit = (e) => {
    e.preventDefault();
    if (newWorkspaceName.trim()) {
      onAddWorkspace(newWorkspaceName);
      setNewWorkspaceName('');
      setShowAddWorkspaceModal(false);
    }
  };

  return (
    <div className="sidebar">
      <div className="workspace-list">
        {workspaces.map(workspace => (
          <div
            key={workspace.id}
            className={`workspace-avatar ${currentWorkspace.id === workspace.id ? 'active' : ''}`}
            onClick={() => setCurrentWorkspace(workspace)}
          >
            {workspace.initial}
          </div>
        ))}
        
        <div 
          className="add-workspace"
          onClick={handleAddWorkspaceClick}
        >
          <Plus size={20} />
        </div>
      </div>

      <div className="sidebar-menu">
        <div 
          className={`sidebar-menu-item ${activeMenuItem === 'home' ? 'active' : ''}`}
          onClick={() => handleMenuItemClick('home')}
        >
          <div className="sidebar-icon">
            <Home size={20} />
          </div>
          <span className="sidebar-label">Home</span>
        </div>
        
        <div 
          className={`sidebar-menu-item ${activeMenuItem === 'dms' ? 'active' : ''}`}
          onClick={() => handleMenuItemClick('dms')}
        >
          <div className="sidebar-icon">
            <MessageSquare size={20} />
          </div>
          <span className="sidebar-label">DMs</span>
        </div>
      </div>

      <div className="sidebar-footer">
        <div 
          className="user-avatar"
          onClick={onProfileClick}
        >
          {getUserInitial()}
        </div>
      </div>

      {/* Add Workspace Modal */}
      {showAddWorkspaceModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <div className="modal-header">
              <div className="modal-title">Create a new workspace</div>
              <button className="modal-close" onClick={() => setShowAddWorkspaceModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleAddWorkspaceSubmit}>
                <div className="form-group">
                  <label htmlFor="workspace-name">Workspace Name</label>
                  <input
                    id="workspace-name"
                    type="text"
                    className="form-control"
                    value={newWorkspaceName}
                    onChange={(e) => setNewWorkspaceName(e.target.value)}
                    placeholder="Enter workspace name"
                    required
                  />
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button 
                className="btn btn-cancel" 
                onClick={() => setShowAddWorkspaceModal(false)}
              >
                Cancel
              </button>
              <button 
                className="btn btn-submit"
                onClick={handleAddWorkspaceSubmit}
              >
                Create Workspace
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
