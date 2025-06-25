import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiPlus } = FiIcons;

const KanbanColumn = ({ 
  column, 
  children, 
  onDrop, 
  onDragOver, 
  onDragLeave, 
  onAddTask, 
  isDraggedOver, 
  draggedOverIndex,
  sortByPriority 
}) => {
  const [localDragOver, setLocalDragOver] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setLocalDragOver(true);
    
    if (!sortByPriority) {
      const rect = e.currentTarget.getBoundingClientRect();
      const y = e.clientY - rect.top;
      const cardElements = e.currentTarget.querySelectorAll('[data-task-card]');
      
      let dropIndex = column.tasks.length; // Default to end
      
      for (let i = 0; i < cardElements.length; i++) {
        const cardRect = cardElements[i].getBoundingClientRect();
        const cardY = cardRect.top - rect.top + cardRect.height / 2;
        
        if (y < cardY) {
          dropIndex = i;
          break;
        }
      }
      
      onDragOver(e, dropIndex);
    } else {
      onDragOver(e, null);
    }
  };

  const handleDragLeave = (e) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setLocalDragOver(false);
      onDragLeave(e);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setLocalDragOver(false);
    
    if (!sortByPriority) {
      const rect = e.currentTarget.getBoundingClientRect();
      const y = e.clientY - rect.top;
      const cardElements = e.currentTarget.querySelectorAll('[data-task-card]');
      
      let dropIndex = column.tasks.length; // Default to end
      
      for (let i = 0; i < cardElements.length; i++) {
        const cardRect = cardElements[i].getBoundingClientRect();
        const cardY = cardRect.top - rect.top + cardRect.height / 2;
        
        if (y < cardY) {
          dropIndex = i;
          break;
        }
      }
      
      onDrop(e, dropIndex);
    } else {
      onDrop(e, null);
    }
  };

  return (
    <div
      className={`flex-shrink-0 w-80 bg-gray-100 dark:bg-gray-800 rounded-lg p-4 transition-all duration-200 min-h-96 ${
        isDraggedOver && !sortByPriority
          ? 'bg-primary-50 dark:bg-primary-900/20 border-2 border-primary-300 dark:border-primary-700'
          : localDragOver
          ? 'bg-gray-200 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600'
          : 'border-2 border-transparent'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`w-3 h-3 ${column.color} rounded-full`}></div>
          <h3 className="font-semibold text-gray-900 dark:text-white">
            {column.title}
          </h3>
          <span className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 text-xs rounded-full">
            {column.tasks.length}
          </span>
        </div>
        <button
          onClick={onAddTask}
          className="p-1 text-gray-400 dark:text-gray-500 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
          title="Add task"
        >
          <SafeIcon icon={FiPlus} className="text-sm" />
        </button>
      </div>

      {/* Column Content */}
      <div className="space-y-3">
        {children}
        
        {/* Drop Zone Indicator */}
        {isDraggedOver && !sortByPriority && draggedOverIndex !== null && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 8 }}
            className="bg-primary-400 dark:bg-primary-600 rounded-full mx-2"
            style={{
              position: 'absolute',
              left: '1rem',
              right: '1rem',
              zIndex: 10,
              transform: `translateY(${draggedOverIndex * 120 + draggedOverIndex * 12}px)`
            }}
          />
        )}
      </div>

      {/* Empty Column Drop Zone */}
      {column.tasks.length === 0 && localDragOver && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-3 p-8 border-2 border-dashed border-primary-300 dark:border-primary-700 rounded-lg bg-primary-50 dark:bg-primary-900/20 text-center"
        >
          <p className="text-primary-600 dark:text-primary-400 text-sm font-medium">
            Drop task here
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default KanbanColumn;