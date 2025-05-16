import React, { useEffect, useState } from 'react';
import API from '../api/api';

function Workspaces() {
  const [workspaces, setWorkspaces] = useState([]);

  useEffect(() => {
    const fetchWorkspaces = async () => {
      try {
        const response = await API.get('/workspaces/');
        setWorkspaces(response.data);
      } catch (error) {
        console.error('Failed to fetch workspaces', error);
      }
    };
    fetchWorkspaces();
  }, []);

  return (
    <div>
      {workspaces.map(workspace => (
        <div key={workspace.id}>{workspace.name}</div>
      ))}
    </div>
  );
}