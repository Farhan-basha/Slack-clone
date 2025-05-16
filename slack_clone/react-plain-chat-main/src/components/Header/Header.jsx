
import React, { useState } from 'react';
import { MoreHorizontal } from 'lucide-react';
import './Header.css';

const Header = ({ channelName, workspaceName, onMenuClick }) => {
  const [showChannelMenu, setShowChannelMenu] = useState(false);
  
  const toggleChannelMenu = () => {
    setShowChannelMenu(!showChannelMenu);
  };
  
  return (
    <div className="header">
      <div className="header-channel">
        <div className="channel-title">
          <h2>
            <span className="channel-hash">#</span> 
            {channelName}
          </h2>
        </div>
      </div>
      
      <div className="header-actions">
        <button className="channel-menu" onClick={toggleChannelMenu} aria-label="Channel menu">
          <MoreHorizontal size={16} />
        </button>
        
        {showChannelMenu && (
          <div className="channel-dropdown">
            <div className="channel-menu-item" onClick={() => {
              setShowChannelMenu(false);
              onMenuClick('viewMembers');
            }}>
              View Members
            </div>
            <div className="channel-menu-item" onClick={() => {
              setShowChannelMenu(false);
              onMenuClick('addMembers');
            }}>
              Add Members
            </div>
            <div className="channel-menu-item" onClick={() => {
              setShowChannelMenu(false);
              onMenuClick('leaveChannel');
            }}>
              Leave Channel
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
