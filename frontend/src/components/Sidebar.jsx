import React, { useRef } from 'react';
import { Upload, MessageSquare, LogOut, FileText } from 'lucide-react';
import { uploadDataset } from '../services/api';

const Sidebar = ({ onLogout, onDatasetUpload, currentDataset }) => {
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const result = await uploadDataset(file);
      onDatasetUpload(result);
    } catch (error) {
      console.error("Upload failed", error);
      alert("Failed to upload dataset.");
    }
  };

  return (
    <div className="w-64 bg-dark-900 border-r border-slate-800 flex flex-col h-screen p-4">
      <div className="mb-8 px-2">
        <h1 className="text-2xl font-bold text-gradient">InsightAI</h1>
      </div>

      <div className="flex-1 space-y-2">
        <div 
          className="flex items-center gap-3 px-4 py-3 rounded-lg bg-primary-600/10 text-primary-400 font-medium cursor-pointer hover:bg-primary-600/20 transition-colors"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload size={20} />
          <span>Upload Dataset</span>
        </div>
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept=".csv,.xlsx,.xls"
          onChange={handleFileChange}
        />

        <div className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-dark-800 text-slate-300 transition-colors cursor-pointer">
          <MessageSquare size={20} />
          <span>Analysis Chat</span>
        </div>
      </div>

      {currentDataset && (
        <div className="mb-4 p-4 rounded-lg bg-dark-800 border border-slate-700">
          <div className="flex items-center gap-2 text-slate-300 text-sm mb-2">
            <FileText size={16} />
            <span className="font-medium truncate">{currentDataset.name || "Active Dataset"}</span>
          </div>
          <div className="text-xs text-slate-500">
            {currentDataset.schema?.row_count} rows • {currentDataset.schema?.column_count} columns
          </div>
        </div>
      )}

      <div 
        className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-500/10 text-slate-400 hover:text-red-400 transition-colors cursor-pointer mt-auto"
        onClick={onLogout}
      >
        <LogOut size={20} />
        <span>Log Out</span>
      </div>
    </div>
  );
};

export default Sidebar;
