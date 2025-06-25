import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';

const { FiX, FiCalendar, FiUser, FiBuilding, FiEdit, FiClock, FiAlertCircle, FiFileText, FiMessageCircle, FiSend } = FiIcons;

const TaskDetailModal = ({ task, onClose, onEdit }) => {
  const { pharmacies, addTaskComment, taskComments = [] } = useData();
  const { user } = useAuth();
  const [newComment, setNewComment] = useState('');
  const [activeTab, setActiveTab] = useState('details');

  const pharmacy = pharmacies.find(p => p.id === task.pharmacyId);
  const comments = taskComments.filter(c => c.taskId === task.id)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const comment = {
      taskId: task.id,
      content: newComment,
      authorId: user.id,
      authorName: user.name,
      authorAvatar: user.avatar
    };

    addTaskComment(comment);
    setNewComment('');
    toast.success('Comment added successfully');
  };

  const handleEdit = () => {
    onClose(); // Close the detail modal first
    onEdit(task); // Then open the edit modal
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400';
      case 'medium': return 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400';
      case 'low': return 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400';
      default: return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'complete': return 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400';
      case 'in-progress': return 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400';
      case 'up-next': return 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400';
      default: return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300';
    }
  };

  const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'complete';
  const daysUntilDue = Math.ceil((new Date(task.dueDate) - new Date()) / (1000 * 60 * 60 * 24));

  const tabs = [
    { id: 'details', label: 'Task Details', icon: FiFileText },
    { id: 'comments', label: 'Comments', icon: FiMessageCircle, count: comments.length }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden border border-gray-200 dark:border-gray-700"
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-3 mb-2">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white truncate">
                  {task.title}
                </h2>
                {isOverdue && (
                  <div className="flex items-center space-x-1 text-red-600 dark:text-red-400">
                    <SafeIcon icon={FiAlertCircle} className="text-sm" />
                    <span className="text-xs font-medium">Overdue</span>
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-3">
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${getPriorityColor(task.priority)}`}>
                  {task.priority} priority
                </span>
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(task.status)}`}>
                  {task.status === 'up-next' ? 'Up Next' : task.status === 'in-progress' ? 'In Progress' : task.status}
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-2 ml-4">
              <button
                onClick={handleEdit}
                className="p-2 text-gray-400 dark:text-gray-500 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                title="Edit task"
              >
                <SafeIcon icon={FiEdit} className="text-xl" />
              </button>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <SafeIcon icon={FiX} className="text-xl" />
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium text-sm transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-white dark:bg-gray-600 text-primary-600 dark:text-primary-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                }`}
              >
                <SafeIcon icon={tab.icon} className="text-lg" />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className={`px-2 py-0.5 text-xs rounded-full ${
                    activeTab === tab.id
                      ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                      : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="h-[calc(90vh-200px)] overflow-hidden">
          {activeTab === 'details' ? (
            <motion.div
              key="details"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="h-full overflow-y-auto p-6"
            >
              <div className="space-y-6">
                {/* Description */}
                {task.description && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Description</h3>
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        {task.description}
                      </p>
                    </div>
                  </div>
                )}

                {/* Task Information Grid */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Task Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Pharmacy */}
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/20 rounded-lg flex items-center justify-center">
                          <SafeIcon icon={FiBuilding} className="text-primary-600 dark:text-primary-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Pharmacy</p>
                          <div className="flex items-center space-x-2">
                            {pharmacy?.avatar && (
                              <img
                                src={pharmacy.avatar}
                                alt={pharmacy.name}
                                className="w-5 h-5 rounded object-cover"
                              />
                            )}
                            <p className="text-gray-900 dark:text-white font-medium">
                              {pharmacy?.name || 'Unknown Pharmacy'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Due Date */}
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          isOverdue 
                            ? 'bg-red-100 dark:bg-red-900/20' 
                            : daysUntilDue <= 3 
                            ? 'bg-yellow-100 dark:bg-yellow-900/20' 
                            : 'bg-gray-100 dark:bg-gray-700'
                        }`}>
                          <SafeIcon icon={FiCalendar} className={
                            isOverdue 
                              ? 'text-red-600 dark:text-red-400' 
                              : daysUntilDue <= 3 
                              ? 'text-yellow-600 dark:text-yellow-400' 
                              : 'text-gray-600 dark:text-gray-400'
                          } />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Due Date</p>
                          <div className="flex items-center space-x-2">
                            <p className={`font-medium ${
                              isOverdue 
                                ? 'text-red-600 dark:text-red-400' 
                                : daysUntilDue <= 3 
                                ? 'text-yellow-600 dark:text-yellow-400' 
                                : 'text-gray-900 dark:text-white'
                            }`}>
                              {task.dueDate}
                            </p>
                            {daysUntilDue !== 0 && (
                              <span className={`text-sm ${
                                isOverdue 
                                  ? 'text-red-600 dark:text-red-400' 
                                  : daysUntilDue <= 3 
                                  ? 'text-yellow-600 dark:text-yellow-400' 
                                  : 'text-gray-500 dark:text-gray-500'
                              }`}>
                                {isOverdue 
                                  ? `${Math.abs(daysUntilDue)} days overdue` 
                                  : daysUntilDue === 1 
                                  ? 'Due tomorrow' 
                                  : `${daysUntilDue} days left`
                                }
                              </span>
                            )}
                            {daysUntilDue === 0 && (
                              <span className="text-sm text-yellow-600 dark:text-yellow-400 font-medium">
                                Due today
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Created Date */}
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                          <SafeIcon icon={FiClock} className="text-gray-600 dark:text-gray-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Created</p>
                          <p className="text-gray-900 dark:text-white">
                            {formatDistanceToNow(new Date(task.createdAt), { addSuffix: true })}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Assigned To */}
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                          <SafeIcon icon={FiUser} className="text-gray-600 dark:text-gray-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Assigned To</p>
                          <p className="text-gray-900 dark:text-white">
                            {task.assignedTo === '1' ? 'John Doe' : task.assignedTo === '2' ? 'Jane Smith' : 'Unassigned'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Stats</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-primary-50 dark:bg-primary-900/20 rounded-lg p-4 text-center">
                      <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">{comments.length}</p>
                      <p className="text-sm text-primary-700 dark:text-primary-300">Comments</p>
                    </div>
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 text-center">
                      <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {Math.abs(daysUntilDue)}
                      </p>
                      <p className="text-sm text-blue-700 dark:text-blue-300">
                        {isOverdue ? 'Days Overdue' : 'Days Left'}
                      </p>
                    </div>
                    <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 text-center">
                      <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {task.status === 'complete' ? '100%' : task.status === 'in-progress' ? '50%' : '0%'}
                      </p>
                      <p className="text-sm text-green-700 dark:text-green-300">Progress</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="comments"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="h-full flex flex-col"
            >
              <div className="flex-1 overflow-y-auto p-6">
                {/* Add Comment Form */}
                <form onSubmit={handleAddComment} className="mb-6">
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <img
                        src={user?.avatar}
                        alt={user?.name}
                        className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                      />
                      <div className="flex-1">
                        <textarea
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          placeholder="Add a comment to this task..."
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                        />
                        <div className="flex justify-between items-center mt-3">
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Share updates, questions, or feedback about this task
                          </p>
                          <button
                            type="submit"
                            disabled={!newComment.trim()}
                            className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                          >
                            <SafeIcon icon={FiSend} className="text-sm" />
                            <span>Comment</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>

                {/* Comments List */}
                <div className="space-y-4">
                  {comments.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                        <SafeIcon icon={FiMessageCircle} className="text-gray-400 dark:text-gray-500 text-2xl" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No comments yet</h3>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">
                        Be the first to comment on this task. Share your thoughts, updates, or questions!
                      </p>
                    </div>
                  ) : (
                    comments.map((comment, index) => (
                      <motion.div
                        key={comment.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600"
                      >
                        <div className="flex items-start space-x-3">
                          <img
                            src={comment.authorAvatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face'}
                            alt={comment.authorName}
                            className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-2">
                              <span className="font-medium text-gray-900 dark:text-white">
                                {comment.authorName}
                              </span>
                              <span className="text-sm text-gray-500 dark:text-gray-400">
                                {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                              </span>
                            </div>
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                              {comment.content}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default TaskDetailModal;