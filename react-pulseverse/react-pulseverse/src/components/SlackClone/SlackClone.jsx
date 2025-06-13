
import React from 'react';
import Sidebar from '../Sidebar/Sidebar';
import Sidebar2 from '../Sidebar2/Sidebar2';
import Profile from '../Profile/Profile';
import ChannelModal from '../Modals/ChannelModal';
import InviteModal from '../Modals/InviteModal';
import ViewMembersModal from '../Modals/ViewMembersModal';
import AddMembersModal from '../Modals/AddMembersModal';
import MainContent from './MainContent';
import UserProfileModal from '../Modals/UserProfileModal';
import LeaveChannelModal from '../Modals/LeaveChannelModal';
import useChannelManagement from './useChannelManagement';
import useWorkspaceManagement from './useWorkspaceManagement';
import useMessagesManagement from './useMessagesManagement';
import useUserManagement from './useUserManagement';
import './SlackClone.css';

const SlackClone = () => {
  const [showInviteModal, setShowInviteModal] = React.useState(false);
  const [activeMenuItem, setActiveMenuItem] = React.useState('home');
  const [currentDM, setCurrentDM] = React.useState(null);
  
  // Custom hooks for state management
  const { 
    user, 
    showProfile, 
    setShowProfile, 
    showUserProfile, 
    setShowUserProfile, 
    selectedUser, 
    setSelectedUser, 
    temporaryUsers,
    toggleProfile, 
    handleUserAvatarClick,
    handleSignOut
  } = useUserManagement();
  
  const { 
    workspaces, 
    currentWorkspace, 
    setCurrentWorkspace, 
    handleAddWorkspace 
  } = useWorkspaceManagement();
  
  const { 
    messages, 
    directMessages,
    setMessages, 
    setDirectMessages,
    handleSendMessage,
    handleSendDirectMessage
  } = useMessagesManagement();
  
  const { 
    currentChannel, 
    setCurrentChannel, 
    showChannelModal, 
    setShowChannelModal, 
    showViewMembersModal, 
    setShowViewMembersModal, 
    showAddMembersModal, 
    setShowAddMembersModal, 
    showLeaveDialog, 
    setShowLeaveDialog, 
    handleHeaderMenuAction, 
    handleLeaveChannel, 
    handleAddChannel 
  } = useChannelManagement();

  // Current workspace and channel messages
  const currentMessages = messages[currentWorkspace.id]?.[currentChannel] || [];
  const currentDMMessages = currentDM ? (directMessages[currentDM] || []) : [];
  
  // Handler functions that combine data from multiple hooks
  const sendMessageWrapper = (text, attachments, isDM = false) => {
    if (isDM && currentDM) {
      handleSendDirectMessage(text, attachments, user, currentDM);
    } else {
      handleSendMessage(text, attachments, user, currentWorkspace.id, currentChannel);
    }
  };
  
  const addWorkspaceWrapper = (workspaceName) => {
    handleAddWorkspace(workspaceName, setMessages);
  };
  
  const addChannelWrapper = (channelName, isPrivate) => {
    handleAddChannel(channelName, isPrivate, currentWorkspace.id, setMessages);
  };
  
  const leaveChannelWrapper = () => {
    handleLeaveChannel(currentChannel, setCurrentChannel, messages, currentWorkspace.id);
  };
  
  const handleMessageUser = (user) => {
    setShowUserProfile(false);
    setCurrentDM(user.name);
    setCurrentChannel(null);
  };

  const handleDirectMessageClick = (username) => {
    setCurrentDM(username);
    setCurrentChannel(null);
  };

  const handleChannelClick = (channel) => {
    setCurrentChannel(channel);
    setCurrentDM(null);
  };

  return user ? (
    <div className="slack-clone">
      <Sidebar 
        activeMenuItem={activeMenuItem} 
        setActiveMenuItem={setActiveMenuItem} 
        workspaces={workspaces}
        currentWorkspace={currentWorkspace}
        setCurrentWorkspace={setCurrentWorkspace}
        onProfileClick={toggleProfile}
        onAddWorkspace={addWorkspaceWrapper}
        user={user}
      />
      <Sidebar2 
        currentChannel={currentChannel} 
        setCurrentChannel={handleChannelClick}
        activeMenuItem={activeMenuItem}
        currentWorkspace={currentWorkspace}
        messages={messages}
        currentDM={currentDM}
        onDirectMessageClick={handleDirectMessageClick}
        onAddChannel={() => setShowChannelModal(true)}
        onInvite={() => setShowInviteModal(true)}
      />
      
      <MainContent 
        currentChannel={currentChannel}
        currentWorkspace={currentWorkspace}
        currentMessages={currentMessages}
        onHeaderMenuAction={handleHeaderMenuAction}
        onUserAvatarClick={handleUserAvatarClick}
        onSendMessage={sendMessageWrapper}
        currentDM={currentDM}
        dmMessages={currentDMMessages}
      />
      
      {/* Modals and sidebars */}
      {showProfile && (
        <Profile 
          user={user} 
          onClose={() => setShowProfile(false)} 
          onSignOut={handleSignOut}
        />
      )}
      
      <UserProfileModal 
        user={selectedUser}
        isOpen={showUserProfile}
        onClose={() => setShowUserProfile(false)}
        onMessageUser={handleMessageUser}
      />
      
      {showChannelModal && (
        <ChannelModal 
          onClose={() => setShowChannelModal(false)}
          onSubmit={addChannelWrapper}
        />
      )}
      
      {showInviteModal && (
        <InviteModal 
          onClose={() => setShowInviteModal(false)}
        />
      )}
      
      {showViewMembersModal && (
        <ViewMembersModal 
          onClose={() => setShowViewMembersModal(false)}
          currentChannel={currentChannel}
          members={[user?.name || user?.email?.split('@')[0] || 'User', ...temporaryUsers.map(u => u.name)]}
        />
      )}
      
      {showAddMembersModal && (
        <AddMembersModal 
          onClose={() => setShowAddMembersModal(false)}
          currentChannel={currentChannel}
        />
      )}
      
      <LeaveChannelModal 
        isOpen={showLeaveDialog}
        onClose={() => setShowLeaveDialog(false)}
        onLeave={leaveChannelWrapper}
        channelName={currentChannel}
      />
    </div>
  ) : null;
};

export default SlackClone;
