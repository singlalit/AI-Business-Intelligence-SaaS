import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import ChatInterface from '../components/ChatInterface';

const Dashboard = ({ onLogout }) => {
  const [currentDataset, setCurrentDataset] = useState(null);

  const handleDatasetUpload = (data) => {
    setCurrentDataset(data);
  };

  return (
    <div className="flex h-screen bg-dark-950 overflow-hidden">
      <Sidebar 
        onLogout={onLogout} 
        onDatasetUpload={handleDatasetUpload} 
        currentDataset={currentDataset} 
      />
      
      <main className="flex-1 flex flex-col min-w-0">
        <ChatInterface currentDataset={currentDataset} />
      </main>
    </div>
  );
};

export default Dashboard;
