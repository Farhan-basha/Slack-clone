
import React, { useState, useEffect, useRef } from 'react';
import { MoreHorizontal, Headphones, Mic, MicOff } from 'lucide-react';
import './Header.css';

const Header = ({ 
  channelName, 
  workspaceName, 
  onMenuClick,
  dmUser,
  isDM = false
}) => {
  const [showChannelMenu, setShowChannelMenu] = useState(false);
  const [huddle, setHuddle] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef(null);
  
  const toggleChannelMenu = () => {
    setShowChannelMenu(!showChannelMenu);
  };

  // Mock WebRTC functionality for demo purposes
  const startHuddle = async () => {
    if (huddle) {
      // Leave existing huddle
      leaveHuddle();
    } else {
      try {
        // Start new huddle
        // In a real app, we would initialize WebRTC connections here
        // For demo, we'll just simulate a huddle
        
        // Request microphone permission
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: false
        });
        
        // Store the audio stream for later cleanup
        audioRef.current = stream;
        
        // Create a new huddle with the current user
        setHuddle({
          id: `huddle-${Date.now()}`,
          participants: [
            { id: 'you', name: 'You', isSelf: true, isMuted: false, isActive: false },
          ],
          isActive: true
        });
        
        // Simulate other participants joining after a delay
        setTimeout(() => {
          setHuddle(prev => {
            if (!prev) return null;
            return {
              ...prev,
              participants: [
                ...prev.participants,
                { id: 'user1', name: 'Karthik', isSelf: false, isMuted: false, isActive: false }
              ]
            };
          });
        }, 2000);
        
        // Simulate speaking activity
        const speakingInterval = setInterval(() => {
          setHuddle(prev => {
            if (!prev) {
              clearInterval(speakingInterval);
              return null;
            }
            
            // Randomly activate/deactivate speaking for participants
            const updatedParticipants = prev.participants.map(p => ({
              ...p,
              isActive: Math.random() > 0.7 ? !p.isActive : p.isActive
            }));
            
            return {
              ...prev,
              participants: updatedParticipants
            };
          });
        }, 2000);
        
        // Clean up interval if component unmounts
        return () => clearInterval(speakingInterval);
        
      } catch (err) {
        console.error('Error accessing microphone:', err);
        alert('Could not access microphone. Huddle requires microphone permission.');
      }
    }
  };

  const leaveHuddle = () => {
    // Stop the audio stream if it exists
    if (audioRef.current) {
      audioRef.current.getTracks().forEach(track => track.stop());
      audioRef.current = null;
    }
    
    setHuddle(null);
    setIsMuted(false);
  };

  const toggleMute = () => {
    // Toggle mute state in the UI
    setIsMuted(!isMuted);
    
    // In a real app, we would mute/unmute the WebRTC stream here
    if (audioRef.current) {
      audioRef.current.getAudioTracks().forEach(track => {
        track.enabled = isMuted; // Toggle the opposite of current state
      });
    }
    
    // Update the huddle state to reflect mute status
    setHuddle(prev => {
      if (!prev) return null;
      
      return {
        ...prev,
        participants: prev.participants.map(p => 
          p.isSelf ? { ...p, isMuted: !isMuted } : p
        )
      };
    });
  };

  // Clean up audio stream when component unmounts
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);
  
  return (
    <div className="header">
      <div className="header-channel">
        <div className="channel-title">
          <h2>
            {isDM ? (
              <>
                <span className="dm-status">●</span> 
                {dmUser}
              </>
            ) : (
              <>
                <span className="channel-hash">#</span> 
                {channelName}
              </>
            )}
          </h2>
        </div>
      </div>
      
      <div className="header-actions">
        <button 
          className={`huddle-button ${huddle ? 'huddle-active' : ''}`} 
          onClick={startHuddle}
          title={huddle ? "Leave Huddle" : "Start a Huddle"}
        >
          <Headphones size={18} />
          {huddle && (
            <span className="huddle-indicator"></span>
          )}
        </button>
        
        <button className="channel-menu" onClick={toggleChannelMenu} aria-label="Channel menu">
          <MoreHorizontal size={16} />
        </button>
        
        {showChannelMenu && !isDM && (
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
        
        {showChannelMenu && isDM && (
          <div className="channel-dropdown">
            <div className="channel-menu-item" onClick={() => {
              setShowChannelMenu(false);
              // View profile action would go here
            }}>
              View Profile
            </div>
            <div className="channel-menu-item" onClick={() => {
              setShowChannelMenu(false);
              // Archive conversation action would go here
            }}>
              Archive Conversation
            </div>
          </div>
        )}
      </div>
      
      {/* Huddle Panel - only show when huddle is active */}
      {huddle && (
        <div className="huddle-panel">
          <div className="huddle-header">
            <h3>Pulse Huddle</h3>
            <button className="huddle-close" onClick={leaveHuddle}>×</button>
          </div>
          <div className="huddle-participants">
            {huddle.participants.map((participant, index) => (
              <div key={index} className={`huddle-participant ${participant.isActive ? 'speaking' : ''}`}>
                <div className="participant-avatar">
                  {participant.name.charAt(0)}
                </div>
                <div className="participant-name">
                  {participant.name} {participant.isSelf && "(You)"}
                </div>
                {participant.isSelf ? (
                  <button className="mute-button" onClick={toggleMute}>
                    {isMuted ? <MicOff size={16} /> : <Mic size={16} />}
                  </button>
                ) : (
                  <span className="status-indicator">
                    {participant.isMuted ? <MicOff size={16} /> : <Mic size={16} />}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;
