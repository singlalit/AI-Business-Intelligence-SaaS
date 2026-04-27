import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { BarChart3, Database, Sparkles, ArrowRight } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-dark-950 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary-600/20 blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/20 blur-[120px]" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="z-10 text-center max-w-4xl px-4"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-dark-800/50 border border-slate-700 text-sm text-primary-400 mb-8">
          <Sparkles size={16} />
          <span>The Next Generation of Business Intelligence</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
          Unleash the Power of <br />
          <span className="text-gradient">InsightAI</span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
          Upload your datasets and simply ask questions in plain English. Our MCP-powered AI orchestrates multiple skills to query, visualize, and extract insights instantly.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/auth" className="px-8 py-4 rounded-full bg-primary-600 hover:bg-primary-500 text-white font-medium transition-colors flex items-center justify-center gap-2">
            Start Analyzing Data <ArrowRight size={20} />
          </Link>
        </div>

        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <motion.div whileHover={{ y: -5 }} className="glass-panel p-6">
            <Database className="text-primary-500 mb-4" size={32} />
            <h3 className="text-xl font-semibold mb-2">Instant Schema Analysis</h3>
            <p className="text-slate-400 text-sm">Drag and drop your CSV/Excel files and we automatically detect column types and metrics.</p>
          </motion.div>
          <motion.div whileHover={{ y: -5 }} className="glass-panel p-6">
            <Sparkles className="text-purple-500 mb-4" size={32} />
            <h3 className="text-xl font-semibold mb-2">Natural Language to SQL</h3>
            <p className="text-slate-400 text-sm">Ask "What were the top sales last month?" and our AI writes and executes the query perfectly.</p>
          </motion.div>
          <motion.div whileHover={{ y: -5 }} className="glass-panel p-6">
            <BarChart3 className="text-emerald-500 mb-4" size={32} />
            <h3 className="text-xl font-semibold mb-2">Dynamic Visualizations</h3>
            <p className="text-slate-400 text-sm">We automatically determine the best chart type to visualize your results elegantly.</p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default LandingPage;
