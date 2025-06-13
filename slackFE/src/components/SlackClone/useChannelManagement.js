
import { useState } from 'react';

const useChannelManagement = (initialWorkspaceId = 1) => {
  // Channel states
  const [currentChannel, setCurrentChannel] = useState("general");
  
  // Modal states
  const [showChannelModal, setShowChannelModal] = useState(false);
  const [showViewMembersModal, setShowViewMembersModal] = useState(false);
  const [showAddMembersModal, setShowAddMembersModal] = useState(false);
  const [showLeaveDialog, setShowLeaveDialog] = useState(false);
  
  // Handle header menu actions
  const handleHeaderMenuAction = (action) => {
    switch (action) {
      case 'viewMembers':
        setShowViewMembersModal(true);
        break;
      case 'addMembers':
        setShowAddMembersModal(true);
        break;
      case 'leaveChannel':
        setShowLeaveDialog(true);
        break;
      default:
        break;
    }
  };
  
  // Handle leaving a channel
  const handleLeaveChannel = (currentChannel, setCurrentChannel, messages, workspaceId) => {
    // Only allow leaving non-general channels
    if (currentChannel === 'general') {
      alert("You cannot leave the #general channel.");
      setShowLeaveDialog(false);
      return;
    }
    
    // Find another channel to switch to
    const channels = Object.keys(messages[workspaceId] || {});
    const otherChannel = channels.find(channel => channel !== currentChannel) || 'general';
    
    setCurrentChannel(otherChannel);
    alert(`You have left the #${currentChannel} channel.`);
    
    setShowLeaveDialog(false);
  };
  
  // Handle adding a new channel
  const handleAddChannel = (channelName, isPrivate, workspaceId, setMessages) => {
    if (!channelName) return;
    
    setMessages(prevMessages => {
      const workspaceMessages = {...(prevMessages[workspaceId] || {})};
      
      if (!workspaceMessages[channelName]) {
        workspaceMessages[channelName] = [{
          id: 1,
          user: 'PulseVerse Bot',
          avatar: 'https://via.placeholder.com/40',
          text: `Welcome to the #${channelName} channel!`,
          timestamp: new Date().toISOString(),
          isPrivate: isPrivate
        }];
      }
      
      return {
        ...prevMessages,
        [workspaceId]: workspaceMessages
      };
    });
    
    setShowChannelModal(false);
    setCurrentChannel(channelName);
  };
  
  return {
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
  };
};

export default useChannelManagement;
