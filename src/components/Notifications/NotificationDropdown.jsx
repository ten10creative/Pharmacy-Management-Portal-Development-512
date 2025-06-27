import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotifications } from '../../contexts/NotificationContext';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import { formatDistanceToNow } from 'date-fns';

const { FiBell, FiMessageCircle, FiUser, FiTrash2, FiCheck, FiCheckCircle, FiExternalLink } = FiIcons;

const NotificationDropdown = () => {
  const {
    notifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
    getUnreadCount
  } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const unreadCount = getUnreadCount();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }

    // Handle navigation based on notification type
    if (notification.type === 'mention' || notification.type === 'comment') {
      if (notification.taskId) {
        // Task comment mention - navigate to tasks with highlighted task
        navigate(`/tasks?highlight=${notification.taskId}`);
      } else if (notification.pharmacyId) {
        // Pharmacy comment mention - navigate to pharmacy detail with highlighted comment
        navigate(`/pharmacies/${notification.pharmacyId}?tab=comments&highlight=${notification.commentId}`);
      }
    } else if (notification.type === 'assignment' && notification.taskId) {
      // Task assignment - navigate to tasks with highlighted task
      navigate(`/tasks?highlight=${notification.taskId}`);
    }

    setIsOpen(false);
  };

  const handleDeleteNotification = (e, notificationId) => {
    e.stopPropagation();
    deleteNotification(notificationId);
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'mention':
      case 'comment':
        return FiMessageCircle;
      case 'assignment':
        return FiUser;
      default:
        return FiBell;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'mention':
      case 'comment':
        return 'text-blue-500';
      case 'assignment':
        return 'text-green-500';
      default:
        return 'text-gray-500';
    }
  };

  const getNotificationLocation = (notification) => {
    if (notification.taskId && notification.pharmacyId) {
      return 'Task Comment';
    } else if (notification.pharmacyId) {
      return 'Pharmacy Comment';
    } else if (notification.taskId) {
      return 'Task';
    }
    return '';
  };

  return (
    <div className="relative" ref={dropdownRef} style={{ zIndex: 40 }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
      >
        <SafeIcon icon={FiBell} className="text-lg md:text-xl" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-medium rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-96 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 max-h-96 overflow-hidden"
            style={{ zIndex: 45 }}
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Notifications
                </h3>
                <div className="flex items-center space-x-2">
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
                      title="Mark all as read"
                    >
                      <SafeIcon icon={FiCheckCircle} className="text-sm" />
                    </button>
                  )}
                  {notifications.length > 0 && (
                    <button
                      onClick={clearAllNotifications}
                      className="text-sm text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                      title="Clear all"
                    >
                      <SafeIcon icon={FiTrash2} className="text-sm" />
                    </button>
                  )}
                </div>
              </div>
              {unreadCount > 0 && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
                </p>
              )}
            </div>

            {/* Notifications List */}
            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <SafeIcon icon={FiBell} className="mx-auto text-gray-400 dark:text-gray-500 text-3xl mb-2" />
                  <p className="text-gray-500 dark:text-gray-400">No notifications yet</p>
                </div>
              ) : (
                notifications.map((notification, index) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => handleNotificationClick(notification)}
                    className={`p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors group ${
                      !notification.read ? 'bg-blue-50 dark:bg-blue-900/10' : ''
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          !notification.read
                            ? 'bg-blue-100 dark:bg-blue-900/20'
                            : 'bg-gray-100 dark:bg-gray-700'
                        }`}
                      >
                        <SafeIcon
                          icon={getNotificationIcon(notification.type)}
                          className={`text-sm ${getNotificationColor(notification.type)}`}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <p
                              className={`text-sm ${
                                !notification.read
                                  ? 'font-medium text-gray-900 dark:text-white'
                                  : 'text-gray-700 dark:text-gray-300'
                              }`}
                            >
                              {notification.title}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                              {notification.message}
                            </p>
                            {/* Location indicator */}
                            {getNotificationLocation(notification) && (
                              <div className="flex items-center space-x-1 mt-2">
                                <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-1 rounded-full">
                                  {getNotificationLocation(notification)}
                                </span>
                                {(notification.type === 'mention' || notification.type === 'comment') && (
                                  <span className="text-xs bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400 px-2 py-1 rounded-full flex items-center space-x-1">
                                    <SafeIcon icon={FiExternalLink} className="text-xs" />
                                    <span>Click to view</span>
                                  </span>
                                )}
                              </div>
                            )}
                            <div className="flex items-center justify-between mt-2">
                              <p className="text-xs text-gray-400 dark:text-gray-500">
                                {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                              </p>
                              {notification.fromUser && (
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  from {notification.fromUser}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center space-x-1 ml-2">
                            {!notification.read && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                            )}
                            <button
                              onClick={(e) => handleDeleteNotification(e, notification.id)}
                              className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 transition-all"
                              title="Delete notification"
                            >
                              <SafeIcon icon={FiTrash2} className="text-xs" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationDropdown;