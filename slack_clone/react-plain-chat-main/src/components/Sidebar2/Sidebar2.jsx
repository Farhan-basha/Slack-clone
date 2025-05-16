
import React, { useState, useEffect } from 'react';
import { Lock } from 'lucide-react';
import './Sidebar2.css';

const Sidebar2 = ({ 
  currentChannel, 
  setCurrentChannel, 
  activeMenuItem, 
  currentWorkspace, 
  messages,
  onAddChannel,
  onInvite
}) => {
  const [channelsExpanded, setChannelsExpanded] = useState(true);
  const [directMessagesExpanded, setDirectMessagesExpanded] = useState(true);
  
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

  const handleChannelClick = (channel) => {
    setCurrentChannel(channel);
  };

  // User list for direct messages
  const directUsers = [
    { id: 1, name: 'karthik' },
    { id: 2, name: 'sijin' },
    { id: 3, name: 'farhan' }
  ];

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
                    onClick={() => handleChannelClick(channel)}
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
                  <div key={user.id} className="sidebar2-item">
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
              <div key={user.id} className="sidebar2-item">
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
    <div className="sidebar2">
      {renderContent()}
    </div>
  );
};

export default Sidebar2;
