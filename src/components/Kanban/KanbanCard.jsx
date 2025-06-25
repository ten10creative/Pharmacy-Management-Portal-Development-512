import React from 'react';
import { motion } from 'framer-motion';
import { useData } from '../../contexts/DataContext';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiCalendar, FiEdit, FiTrash2, FiAlertCircle, FiClock, FiEye, FiMessageCircle, FiGripVertical } = FiIcons;

const KanbanCard = ({ 
  task, 
  index, 
  pharmacyName, 
  onEdit, 
  onDelete, 
  onDragStart, 
  onDragEnd, 
  isDragging, 
  isDraggedOver, 
  onViewDetails, 
  sortByPriority 
}) => {
  const { pharmacies, taskComments } = useData();
  
  const pharmacy = pharmacies.find(p => p.id === task.pharmacyId);
  const commentCount = taskComments ? taskComments.filter(c => c.taskId === task.id).length : 0;

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400';
      case 'medium': return 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400';
      case 'low': return 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400';
      default: return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high': return '🔴';
      case 'medium': return '🟡';
      case 'low': return '🟢';
      default: return '⚪';
    }
  };

  const isOverdue = (dueDate, status) => {
    return new Date(dueDate) < new Date() && status !== 'complete';
  };

  const getDaysUntilDue = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysUntilDue = getDaysUntilDue(task.dueDate);
  const overdue = isOverdue(task.dueDate, task.status);

  return (
    <>
      {/* Drop indicator */}
      {isDraggedOver && !sortByPriority && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 4 }}
          className="bg-primary-500 dark:bg-primary-400 rounded-full mx-2"
        />
      )}

      <motion.div
        data-task-card
        initial={{ opacity: 0, y: 20 }}
        animate={{
          opacity: isDragging ? 0.7 : 1,
          y: 0,
          scale: isDragging ? 1.05 : 1,
          rotate: isDragging ? 2 : 0,
          zIndex: isDragging ? 50 : 1
        }}
        transition={{
          delay: index * 0.05,
          type: "spring",
          stiffness: 300,
          damping: 30
        }}
        draggable={!sortByPriority}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        className={`bg-white dark:bg-gray-700 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-600 transition-all duration-200 group relative ${
          !sortByPriority ? 'cursor-move hover:shadow-lg' : 'hover:shadow-md'
        } ${
          isDragging ? 'shadow-xl border-primary-300 dark:border-primary-700' : ''
        } ${
          overdue ? 'border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/10' : ''
        }`}
      >
        {/* Drag Handle - only visible when not sorting by priority */}
        {!sortByPriority && (
          <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <SafeIcon icon={FiGripVertical} className="text-gray-400 dark:text-gray-500 text-sm" />
          </div>
        )}

        {/* Priority Badge */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            {sortByPriority && (
              <span className="text-sm" title={`${task.priority} priority`}>
                {getPriorityIcon(task.priority)}
              </span>
            )}
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(task.priority)}`}>
              {task.priority}
            </span>
          </div>
          {overdue && (
            <div className="flex items-center space-x-1 text-red-600 dark:text-red-400">
              <SafeIcon icon={FiAlertCircle} className="text-xs" />
              <span className="text-xs font-medium">Overdue</span>
            </div>
          )}
        </div>

        {/* Task Title */}
        <h4 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
          {task.title}
        </h4>

        {/* Task Description */}
        {task.description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
            {task.description}
          </p>
        )}

        {/* Pharmacy Name with Avatar */}
        <div className="flex items-center space-x-2 mb-3">
          <img
            src={pharmacy?.avatar || 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=100&h=100&fit=crop&crop=center'}
            alt={`${pharmacyName} logo`}
            className="w-5 h-5 rounded object-cover border border-gray-200 dark:border-gray-600"
          />
          <span className="text-xs text-gray-500 dark:text-gray-500 truncate">
            {pharmacyName}
          </span>
        </div>

        {/* Due Date */}
        <div className="flex items-center justify-between mb-3">
          <div className={`flex items-center space-x-1 text-xs ${
            overdue 
              ? 'text-red-600 dark:text-red-400' 
              : daysUntilDue <= 3 
              ? 'text-yellow-600 dark:text-yellow-400' 
              : 'text-gray-500 dark:text-gray-500'
          }`}>
            <SafeIcon icon={FiCalendar} />
            <span>
              {overdue 
                ? `${Math.abs(daysUntilDue)} days overdue` 
                : daysUntilDue === 0 
                ? 'Due today' 
                : daysUntilDue === 1 
                ? 'Due tomorrow' 
                : `${daysUntilDue} days left`
              }
            </span>
          </div>
          {daysUntilDue <= 3 && !overdue && (
            <SafeIcon icon={FiClock} className="text-yellow-500 dark:text-yellow-400 text-sm" />
          )}
        </div>

        {/* Comments indicator */}
        {commentCount > 0 && (
          <div className="flex items-center space-x-1 text-gray-500 dark:text-gray-400 mb-3">
            <SafeIcon icon={FiMessageCircle} className="text-xs" />
            <span className="text-xs">{commentCount} comment{commentCount > 1 ? 's' : ''}</span>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails();
            }}
            className="p-1 text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            title="View details & comments"
          >
            <SafeIcon icon={FiEye} className="text-sm" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            className="p-1 text-gray-400 dark:text-gray-500 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            title="Edit task"
          >
            <SafeIcon icon={FiEdit} className="text-sm" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="p-1 text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 transition-colors"
            title="Delete task"
          >
            <SafeIcon icon={FiTrash2} className="text-sm" />
          </button>
        </div>

        {/* Priority sorting indicator */}
        {sortByPriority && (
          <div className="absolute top-2 right-2 text-xs text-gray-400 dark:text-gray-500">
            #{index + 1}
          </div>
        )}
      </motion.div>
    </>
  );
};

export default KanbanCard;