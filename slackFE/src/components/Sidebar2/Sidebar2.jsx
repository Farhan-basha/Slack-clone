
import React, { useState, useEffect } from 'react';
import { Lock, Settings } from 'lucide-react';
import './Sidebar2.css';
import ThemePopup from '../Modals/ThemePopup';

const Sidebar2 = ({ 
  currentChannel, 
  setCurrentChannel, 
  activeMenuItem, 
  currentWorkspace, 
  messages,
  currentDM,
  onDirectMessageClick,
  onAddChannel,
  onInvite
}) => {
  const [channelsExpanded, setChannelsExpanded] = useState(true);
  const [directMessagesExpanded, setDirectMessagesExpanded] = useState(true);
  const [showThemePopup, setShowThemePopup] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  
  // Get channels for current workspace from messages state
  const getChannels = () => {
    const workspaceId = currentWorkspace?.id || 1;
    const channels = messages[workspaceId] ? Object.keys(messages[workspaceId]) : ['general'];
    return channels;
  };
  
  // Check if a channel is private
  const isPrivateChannel = (channel) => {
    const workspaceId = currentWorkspace?.id || 1;
    const channelMessages = messages[workspaceId]?.[channel] || [];
    return channelMessages.length > 0 && channelMessages[0].isPrivate;
  };

  // User list for direct messages
  const directUsers = [
    { id: 1, name: 'karthik' },
    { id: 2, name: 'sijin' },
    { id: 3, name: 'farhan' }
  ];

  // Close more menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showMoreMenu && !event.target.closest('.more-menu') && !event.target.closest('.more-menu-button')) {
        setShowMoreMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMoreMenu]);

  // Toggle theme popup
  const handleAppearanceClick = () => {
    setShowThemePopup(true);
    setShowMoreMenu(false);
  };

  // Conditionally render content based on the active menu item
  const renderContent = () => {
    if (activeMenuItem === 'home') {
      return (
        <>
          <div className="sidebar2-workspace-header">
            <h3>{currentWorkspace.name}</h3>
          </div>
          
          <div className="sidebar2-section">
            <div 
              className="sidebar2-header" 
              onClick={() => setChannelsExpanded(!channelsExpanded)}
            >
              <span className={`expand-icon ${channelsExpanded ? 'expanded' : ''}`}>▼</span>
              <span>Channels</span>
            </div>
            
            {channelsExpanded && (
              <div className="sidebar2-content">
                {getChannels().map((channel) => (
                  <div 
                    key={channel} 
                    className={`sidebar2-item ${channel === currentChannel ? 'active' : ''}`}
                    onClick={() => setCurrentChannel(channel)}
                  >
                    <span className="channel-hash">#</span> 
                    {channel}
                    {isPrivateChannel(channel) && <Lock size={14} className="lock-icon" />}
                  </div>
                ))}
                
                <div 
                  className="sidebar2-add-item"
                  onClick={onAddChannel}
                >
                  + Add channels
                </div>
              </div>
            )}
          </div>
          
          <div className="sidebar2-section">
            <div 
              className="sidebar2-header" 
              onClick={() => setDirectMessagesExpanded(!directMessagesExpanded)}
            >
              <span className={`expand-icon ${directMessagesExpanded ? 'expanded' : ''}`}>▼</span>
              <span>Direct messages</span>
            </div>
            
            {directMessagesExpanded && (
              <div className="sidebar2-content">
                {directUsers.map(user => (
                  <div 
                    key={user.id} 
                    className={`sidebar2-item ${user.name === currentDM ? 'active' : ''}`}
                    onClick={() => onDirectMessageClick(user.name)}
                  >
                    <span className="dm-status">●</span>
                    {user.name}
                  </div>
                ))}
                <div className="sidebar2-add-item" onClick={onInvite}>
                  + Invite People
                </div>
              </div>
            )}
          </div>

          {/* More options button with dropdown */}
          <div className="sidebar2-more-section">
            <button 
              className="more-menu-button"
              onClick={() => setShowMoreMenu(!showMoreMenu)}
              aria-expanded={showMoreMenu}
            >
              <Settings size={16} />
              <span>More options</span>
              <span className="more-menu-icon">⋮</span>
            </button>
            
            {showMoreMenu && (
              <div className="more-menu">
                <div 
                  className="more-menu-item"
                  onClick={handleAppearanceClick}
                >
                  Appearance
                </div>
                <div className="more-menu-item">
                  Preferences
                </div>
                <div className="more-menu-item">
                  Help
                </div>
              </div>
            )}
          </div>
        </>
      );
    } else if (activeMenuItem === 'dms') {
      return (
        <>
          <div className="sidebar2-workspace-header">
            <h3>Direct Messages - {currentWorkspace.name}</h3>
          </div>
          <div className="sidebar2-content">
            {directUsers.map(user => (
              <div 
                key={user.id} 
                className={`sidebar2-item ${user.name === currentDM ? 'active' : ''}`}
                onClick={() => onDirectMessageClick(user.name)}
              >
                <span className="dm-status">●</span>
                {user.name}
              </div>
            ))}
            <div className="sidebar2-add-item" onClick={onInvite}>
              + Invite People
            </div>
          </div>
        </>
      );
    } else {
      return (
        <div className="sidebar2-workspace-header">
          <h3>More options</h3>
        </div>
      );
    }
  };

  return (
    <>
      <div className="sidebar2">
        {renderContent()}
      </div>
      
      {/* Theme Popup */}
      <ThemePopup isOpen={showThemePopup} onClose={() => setShowThemePopup(false)} />
    </>
  );
};

export default Sidebar2;
