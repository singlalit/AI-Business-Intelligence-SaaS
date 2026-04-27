import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Download, Sparkles } from 'lucide-react';
import { queryDataset } from '../services/api';
import Visualization from './Visualization';
import { motion } from 'framer-motion';

const ChatInterface = ({ currentDataset }) => {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! Upload a dataset and ask me anything about your data.', isInitial: true }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || !currentDataset) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const response = await queryDataset(currentDataset.dataset_id, userMessage);
      
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Analysis complete.',
        sql: response.sql,
        data: response.data,
        chart_config: response.chart_config,
        insights: response.insights,
        prediction: response.prediction
      }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: error.response?.data?.detail || 'Sorry, I encountered an error analyzing your data.' 
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleExportPDF = () => {
    window.print(); // Quick browser-based print to PDF
  };

  return (
    <div className="flex flex-col h-full bg-dark-950">
      <div className="flex justify-between items-center p-4 border-b border-slate-800 bg-dark-900">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Bot className="text-primary-500" /> AI Analyst
        </h2>
        {currentDataset && (
          <button 
            onClick={handleExportPDF}
            className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg bg-dark-800 hover:bg-dark-700 text-slate-300 transition-colors"
          >
            <Download size={16} /> Export Report
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6 printable-area">
        {messages.map((msg, idx) => (
          <motion.div 
            key={idx} 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'assistant' && (
              <div className="w-8 h-8 rounded-full bg-primary-600/20 flex items-center justify-center shrink-0">
                <Bot size={18} className="text-primary-500" />
              </div>
            )}
            
            <div className={`max-w-[85%] rounded-2xl p-4 ${msg.role === 'user' ? 'bg-primary-600 text-white' : 'bg-dark-900 border border-slate-800'}`}>
              {!msg.isInitial && msg.role === 'user' && (
                <p>{msg.content}</p>
              )}
              
              {msg.role === 'assistant' && (
                <div className="space-y-4 text-slate-200">
                  {msg.isInitial ? (
                    <p>{msg.content}</p>
                  ) : (
                    <>
                      {msg.sql && (
                        <div className="bg-dark-950 p-3 rounded-lg border border-slate-800">
                          <p className="text-xs text-slate-500 mb-1 font-mono uppercase">Generated SQL</p>
                          <code className="text-sm text-emerald-400 font-mono break-all">{msg.sql}</code>
                        </div>
                      )}
                      
                      {msg.insights && msg.insights.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Key Insights</h4>
                          <ul className="space-y-1">
                            {msg.insights.map((insight, i) => (
                              <li key={i} className="text-sm flex items-start gap-2">
                                <span className="text-primary-500 mt-1">•</span>
                                <span>{insight}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {msg.prediction && (
                        <div className="bg-purple-900/20 p-3 rounded-lg border border-purple-500/30">
                          <h4 className="text-sm font-semibold text-purple-400 mb-1 flex items-center gap-1">
                            <Sparkles size={14} /> AI Prediction
                          </h4>
                          <p className="text-sm text-purple-200">{msg.prediction.message}</p>
                        </div>
                      )}

                      {msg.chart_config && <Visualization config={msg.chart_config} data={msg.data} />}
                    </>
                  )}
                </div>
              )}
            </div>

            {msg.role === 'user' && (
              <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center shrink-0">
                <User size={18} className="text-slate-300" />
              </div>
            )}
          </motion.div>
        ))}
        {loading && (
          <div className="flex gap-4 justify-start">
            <div className="w-8 h-8 rounded-full bg-primary-600/20 flex items-center justify-center shrink-0">
              <Bot size={18} className="text-primary-500" />
            </div>
            <div className="bg-dark-900 border border-slate-800 rounded-2xl p-4 flex items-center gap-2">
              <Loader2 className="animate-spin text-primary-500" size={18} />
              <span className="text-slate-400 text-sm">Analyzing data and generating insights...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-dark-900 border-t border-slate-800">
        <form onSubmit={handleSubmit} className="relative flex items-center">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={!currentDataset || loading}
            placeholder={currentDataset ? "Ask a question about your data..." : "Please upload a dataset first..."}
            className="w-full bg-dark-950 border border-slate-700 rounded-xl py-3 pl-4 pr-12 text-slate-200 focus:outline-none focus:border-primary-500 disabled:opacity-50"
          />
          <button 
            type="submit" 
            disabled={!currentDataset || loading || !input.trim()}
            className="absolute right-2 p-2 bg-primary-600 hover:bg-primary-500 text-white rounded-lg disabled:opacity-50 disabled:hover:bg-primary-600 transition-colors"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;

