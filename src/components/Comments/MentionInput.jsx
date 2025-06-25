import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiUser } = FiIcons;

const MentionInput = ({ value, onChange, onSubmit, placeholder, disabled, users = [] }) => {
  const [showUserList, setShowUserList] = useState(false);
  const [mentionQuery, setMentionQuery] = useState('');
  const [mentionPosition, setMentionPosition] = useState(0);
  const [selectedUserIndex, setSelectedUserIndex] = useState(0);
  const textareaRef = useRef(null);
  const userListRef = useRef(null);

  // Default users if none provided
  const defaultUsers = [
    { id: '1', name: 'John Doe', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face' },
    { id: '2', name: 'Jane Smith', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face' }
  ];

  const availableUsers = users.length > 0 ? users : defaultUsers;

  // Filter users based on mention query
  const filteredUsers = availableUsers.filter(user =>
    user.name.toLowerCase().includes(mentionQuery.toLowerCase())
  );

  useEffect(() => {
    setSelectedUserIndex(0);
  }, [filteredUsers]);

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    onChange(newValue);

    const cursorPosition = e.target.selectionStart;
    const textBeforeCursor = newValue.slice(0, cursorPosition);
    const mentionMatch = textBeforeCursor.match(/@(\w*)$/);

    if (mentionMatch) {
      setMentionQuery(mentionMatch[1]);
      setMentionPosition(mentionMatch.index);
      setShowUserList(true);
    } else {
      setShowUserList(false);
      setMentionQuery('');
    }
  };

  const insertMention = (user) => {
    const textarea = textareaRef.current;
    const cursorPosition = textarea.selectionStart;
    const textBeforeCursor = value.slice(0, cursorPosition);
    const textAfterCursor = value.slice(cursorPosition);
    
    const mentionMatch = textBeforeCursor.match(/@(\w*)$/);
    if (mentionMatch) {
      const beforeMention = textBeforeCursor.slice(0, mentionMatch.index);
      const mention = `@${user.name}`;
      const newValue = beforeMention + mention + ' ' + textAfterCursor;
      
      onChange(newValue);
      
      // Set cursor position after the mention
      setTimeout(() => {
        const newCursorPosition = beforeMention.length + mention.length + 1;
        textarea.setSelectionRange(newCursorPosition, newCursorPosition);
        textarea.focus();
      }, 0);
    }
    
    setShowUserList(false);
    setMentionQuery('');
  };

  const handleKeyDown = (e) => {
    if (showUserList && filteredUsers.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedUserIndex(prev => 
          prev < filteredUsers.length - 1 ? prev + 1 : 0
        );
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedUserIndex(prev => 
          prev > 0 ? prev - 1 : filteredUsers.length - 1
        );
      } else if (e.key === 'Enter' || e.key === 'Tab') {
        e.preventDefault();
        insertMention(filteredUsers[selectedUserIndex]);
      } else if (e.key === 'Escape') {
        setShowUserList(false);
      }
    } else if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSubmit(e);
    }
  };

  const getMentionedUsers = (text) => {
    const mentions = text.match(/@(\w+(?:\s+\w+)*)/g) || [];
    return mentions.map(mention => {
      const name = mention.slice(1); // Remove @
      return availableUsers.find(user => user.name === name);
    }).filter(Boolean);
  };

  const renderTextWithMentions = (text) => {
    const parts = text.split(/(@\w+(?:\s+\w+)*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('@')) {
        const userName = part.slice(1);
        const user = availableUsers.find(u => u.name === userName);
        if (user) {
          return (
            <span key={index} className="bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400 px-1 rounded">
              {part}
            </span>
          );
        }
      }
      return part;
    });
  };

  return (
    <div className="relative">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        rows={3}
        disabled={disabled}
        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
      />

      {/* Mention suggestions */}
      <AnimatePresence>
        {showUserList && filteredUsers.length > 0 && (
          <motion.div
            ref={userListRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute bottom-full left-0 right-0 mb-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 max-h-40 overflow-y-auto"
          >
            <div className="p-2">
              <div className="text-xs text-gray-500 dark:text-gray-400 px-2 py-1 border-b border-gray-200 dark:border-gray-700">
                Mention someone
              </div>
              {filteredUsers.map((user, index) => (
                <button
                  key={user.id}
                  onClick={() => insertMention(user)}
                  className={`w-full flex items-center space-x-2 px-2 py-2 text-left rounded transition-colors ${
                    index === selectedUserIndex
                      ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-6 h-6 rounded-full object-cover"
                  />
                  <span className="text-sm font-medium">{user.name}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Help text */}
      <div className="flex justify-between items-center mt-2">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Type @ to mention someone • Press Enter to send • Shift+Enter for new line
        </p>
      </div>
    </div>
  );
};

export default MentionInput;