import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../../contexts/NotificationContext';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';
import MentionInput from '../Comments/MentionInput';

const { FiX, FiEdit, FiMessageCircle, FiSend } = FiIcons;

const TaskModal = ({ task, presetStatus, onClose }) => {
  const { addTask, updateTask, pharmacies, addTaskComment, taskComments = [] } = useData();
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const [activeTab, setActiveTab] = useState('edit');
  const [newComment, setNewComment] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assignedTo: '',
    pharmacyId: '',
    status: presetStatus || 'backlog',
    priority: 'medium',
    dueDate: ''
  });

  // Available users for assignment and mentions
  const users = [
    {
      id: '1',
      name: 'John Doe',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face'
    },
    {
      id: '2',
      name: 'Jane Smith',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face'
    }
  ];

  // Get comments for this task
  const comments = task 
    ? taskComments.filter(c => c.taskId === task.id)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    : [];

  useEffect(() => {
    if (task) {
      setFormData(task);
    } else if (presetStatus) {
      setFormData(prev => ({ ...prev, status: presetStatus }));
    }
  }, [task, presetStatus]);

  const getMentionedUsers = (text) => {
    const mentions = text.match(/@(\w+(?:\s+\w+)*)/g) || [];
    return mentions.map(mention => {
      const name = mention.slice(1); // Remove @
      return users.find(user => user.name === name);
    }).filter(Boolean);
  };

  const renderTextWithMentions = (text) => {
    const parts = text.split(/(@\w+(?:\s+\w+)*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('@')) {
        const userName = part.slice(1);
        const user = users.find(u => u.name === userName);
        if (user) {
          return (
            <span
              key={index}
              className="bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400 px-1 rounded font-medium"
            >
              {part}
            </span>
          );
        }
      }
      return <span key={index}>{part}</span>;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      const taskData = { ...formData, createdBy: user.id };
      
      if (task) {
        updateTask(task.id, taskData);
        toast.success('Task updated successfully');
      } else {
        const newTask = addTask(taskData);
        
        // Notify assigned user about new task
        if (taskData.assignedTo && taskData.assignedTo !== user.id) {
          const assignedUser = users.find(u => u.id === taskData.assignedTo);
          if (assignedUser) {
            addNotification({
              type: 'assignment',
              title: 'New task assigned to you',
              message: `${user.name} assigned you a new task: "${taskData.title}"`,
              userId: taskData.assignedTo,
              taskId: newTask.id,
              fromUser: user.name
            });
          }
        }
        
        toast.success('Task created successfully');
      }
      onClose();
    } catch (error) {
      toast.error('An error occurred');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newComment.trim() || !task) return;

    const mentionedUsers = getMentionedUsers(newComment);
    
    const comment = {
      taskId: task.id,
      content: newComment,
      authorId: user.id,
      authorName: user.name,
      authorAvatar: user.avatar,
      mentions: mentionedUsers.map(u => u.id)
    };

    const savedComment = addTaskComment(comment);

    // Send notifications to mentioned users
    mentionedUsers.forEach(mentionedUser => {
      if (mentionedUser.id !== user.id) { // Don't notify yourself
        addNotification({
          type: 'mention',
          title: 'You were mentioned in a task comment',
          message: `${user.name} mentioned you in "${task.title}": "${newComment.slice(0, 50)}${newComment.length > 50 ? '...' : ''}"`,
          userId: mentionedUser.id,
          taskId: task.id,
          commentId: savedComment.id,
          fromUser: user.name
        });
      }
    });

    // Notify other users who have commented on this task (excluding the author and mentioned users)
    const otherCommenters = comments
      .map(c => ({ id: c.authorId, name: c.authorName }))
      .filter((commenter, index, arr) => 
        commenter.id !== user.id && // Not the current user
        !mentionedUsers.some(mu => mu.id === commenter.id) && // Not mentioned users
        arr.findIndex(c => c.id === commenter.id) === index // Unique commenters only
      );

    otherCommenters.forEach(commenter => {
      addNotification({
        type: 'comment',
        title: 'New comment on task',
        message: `${user.name} commented on "${task.title}": "${newComment.slice(0, 50)}${newComment.length > 50 ? '...' : ''}"`,
        userId: commenter.id,
        taskId: task.id,
        commentId: savedComment.id,
        fromUser: user.name
      });
    });

    // Also notify the assigned user if they haven't commented yet
    if (task.assignedTo && task.assignedTo !== user.id && !otherCommenters.some(c => c.id === task.assignedTo) && !mentionedUsers.some(mu => mu.id === task.assignedTo)) {
      const assignedUser = users.find(u => u.id === task.assignedTo);
      if (assignedUser) {
        addNotification({
          type: 'comment',
          title: 'New comment on your task',
          message: `${user.name} commented on your task "${task.title}": "${newComment.slice(0, 50)}${newComment.length > 50 ? '...' : ''}"`,
          userId: task.assignedTo,
          taskId: task.id,
          commentId: savedComment.id,
          fromUser: user.name
        });
      }
    }

    setNewComment('');
    toast.success('Comment added successfully');
  };

  const tabs = [
    { id: 'edit', label: task ? 'Edit Task' : 'Create Task', icon: FiEdit }
  ];

  // Only show comments tab if editing an existing task
  if (task) {
    tabs.push({
      id: 'comments',
      label: 'Comments',
      icon: FiMessageCircle,
      count: comments.length
    });
  }

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
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {task ? 'Edit Task' : 'Create New Task'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <SafeIcon icon={FiX} className="text-xl" />
            </button>
          </div>

          {/* Tab Navigation - only show if there are multiple tabs */}
          {tabs.length > 1 && (
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
          )}
        </div>

        {/* Content */}
        <div className="max-h-[calc(90vh-200px)] overflow-hidden">
          {activeTab === 'edit' ? (
            <motion.div
              key="edit"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="h-full overflow-y-auto"
            >
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Task Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Assign to *
                    </label>
                    <select
                      name="assignedTo"
                      value={formData.assignedTo}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select user</option>
                      {users.map(user => (
                        <option key={user.id} value={user.id}>{user.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Pharmacy *
                    </label>
                    <select
                      name="pharmacyId"
                      value={formData.pharmacyId}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select pharmacy</option>
                      {pharmacies.map(pharmacy => (
                        <option key={pharmacy.id} value={pharmacy.id}>{pharmacy.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Priority
                    </label>
                    <select
                      name="priority"
                      value={formData.priority}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Status
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="backlog">Backlog</option>
                      <option value="up-next">Up Next</option>
                      <option value="in-progress">In Progress</option>
                      <option value="complete">Complete</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Due Date *
                    </label>
                    <input
                      type="date"
                      name="dueDate"
                      value={formData.dueDate}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
                  >
                    {task ? 'Update Task' : 'Create Task'}
                  </button>
                </div>
              </form>
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
                {/* Task Info Banner */}
                <div className="bg-primary-50 dark:bg-primary-900/20 rounded-lg p-4 mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
                      <SafeIcon icon={FiEdit} className="text-primary-600 dark:text-primary-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-primary-900 dark:text-primary-100">
                        {formData.title || 'Untitled Task'}
                      </h3>
                      <p className="text-sm text-primary-700 dark:text-primary-300">
                        Comments and discussion for this task
                      </p>
                    </div>
                  </div>
                </div>

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
                        <MentionInput
                          value={newComment}
                          onChange={setNewComment}
                          onSubmit={handleAddComment}
                          placeholder="Add a comment... (Type @ to mention someone)"
                          users={users}
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
                            <div className="text-gray-700 dark:text-gray-300 leading-relaxed">
                              {renderTextWithMentions(comment.content)}
                            </div>
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

export default TaskModal;