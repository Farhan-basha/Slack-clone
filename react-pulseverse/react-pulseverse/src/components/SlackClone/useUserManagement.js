
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const useUserManagement = () => {
  const navigate = useNavigate();
  
  // User state
  const [user, setUser] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  
  // Temporary users
  const temporaryUsers = [
    { id: 1, name: 'karthik', email: 'karthik@example.com', phone: '123-456-7890' },
    { id: 2, name: 'sijin', email: 'sijin@example.com', phone: '234-567-8901' },
    { id: 3, name: 'farhan', email: 'farhan@example.com', phone: '345-678-9012' }
  ];
  
  // Check if user is logged in
  useEffect(() => {
    const loggedInUser = localStorage.getItem('pulseVerseUser');
    
    if (!loggedInUser) {
      navigate('/');
      return;
    }
    
    setUser(JSON.parse(loggedInUser));
  }, [navigate]);
  
  // Handle user avatar click
  const handleUserAvatarClick = (username) => {
    // Find the user in temporary users
    const foundUser = temporaryUsers.find(u => u.name === username) || { 
      name: username, 
      email: `${username.toLowerCase()}@pulseverse.com`, 
      phone: 'N/A' 
    };
    
    setSelectedUser(foundUser);
    setShowUserProfile(true);
  };
  
  // Toggle profile sidebar
  const toggleProfile = () => {
    setShowProfile(!showProfile);
  };
  
  const handleSignOut = () => {
    localStorage.removeItem('pulseVerseUser');
    navigate('/');
  };
  
  return {
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
  };
};

export default useUserManagement;
