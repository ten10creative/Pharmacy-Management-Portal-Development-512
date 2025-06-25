import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../../contexts/NotificationContext';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';
import MentionInput from './MentionInput';

const { FiMessageCircle, FiSend, FiUser } = FiIcons;

const CommentSection = ({ pharmacyId, highlightedCommentId }) => {
  const { comments, addComment, pharmacies } = useData();
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const [newComment, setNewComment] = useState('');
  const highlightedRef = useRef(null);

  // Available users for mentions (in a real app, this would come from an API)
  const availableUsers = [
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

  const pharmacyComments = comments
    .filter(c => c.pharmacyId === pharmacyId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const pharmacy = pharmacies.find(p => p.id === pharmacyId);

  // Scroll to highlighted comment when it changes
  useEffect(() => {
    if (highlightedCommentId && highlightedRef.current) {
      setTimeout(() => {
        highlightedRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 300); // Delay to allow for tab transition
    }
  }, [highlightedCommentId]);

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
    if (!newComment.trim()) return;

    const mentionedUsers = getMentionedUsers(newComment);
    
    const comment = {
      pharmacyId,
      content: newComment,
      authorId: user.id,
      authorName: user.name,
      authorAvatar: user.avatar,
      mentions: mentionedUsers.map(u => u.id)
    };

    const savedComment = addComment(comment);

    // Send notifications to mentioned users
    mentionedUsers.forEach(mentionedUser => {
      if (mentionedUser.id !== user.id) { // Don't notify yourself
        addNotification({
          type: 'mention',
          title: 'You were mentioned in a comment',
          message: `${user.name} mentioned you in a pharmacy comment: "${newComment.slice(0, 50)}${newComment.length > 50 ? '...' : ''}"`,
          userId: mentionedUser.id,
          pharmacyId: pharmacyId,
          commentId: savedComment.id,
          fromUser: user.name
        });
      }
    });

    // Notify other users who have commented on this pharmacy (excluding the author and mentioned users)
    const otherCommenters = pharmacyComments
      .map(c => ({ id: c.authorId, name: c.authorName }))
      .filter((commenter, index, arr) => 
        commenter.id !== user.id && // Not the current user
        !mentionedUsers.some(mu => mu.id === commenter.id) && // Not mentioned users
        arr.findIndex(c => c.id === commenter.id) === index // Unique commenters only
      );

    otherCommenters.forEach(commenter => {
      addNotification({
        type: 'comment',
        title: 'New comment on pharmacy',
        message: `${user.name} commented on ${pharmacy?.name || 'a pharmacy'}: "${newComment.slice(0, 50)}${newComment.length > 50 ? '...' : ''}"`,
        userId: commenter.id,
        pharmacyId: pharmacyId,
        commentId: savedComment.id,
        fromUser: user.name
      });
    });

    setNewComment('');
    toast.success('Comment added successfully');
  };

  return (
    <div className="space-y-6">
      {/* Add Comment Form */}
      <form onSubmit={handleSubmit} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <img
            src={user?.avatar}
            alt={user?.name}
            className="w-8 h-8 rounded-full object-cover"
          />
          <div className="flex-1">
            <MentionInput
              value={newComment}
              onChange={setNewComment}
              onSubmit={handleSubmit}
              placeholder="Add a comment... (Type @ to mention someone)"
              users={availableUsers}
            />
            <div className="flex justify-end mt-2">
              <button
                type="submit"
                disabled={!newComment.trim()}
                className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <SafeIcon icon={FiSend} className="text-sm" />
                <span>Comment</span>
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-4">
        {pharmacyComments.length === 0 ? (
          <div className="text-center py-8">
            <SafeIcon icon={FiMessageCircle} className="mx-auto text-gray-400 dark:text-gray-500 text-3xl mb-2" />
            <p className="text-gray-500 dark:text-gray-500">No comments yet. Be the first to comment!</p>
          </div>
        ) : (
          pharmacyComments.map((comment, index) => {
            const isHighlighted = highlightedCommentId === comment.id;
            return (
              <motion.div
                key={comment.id}
                ref={isHighlighted ? highlightedRef : null}
                initial={{ opacity: 0, y: 20 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: isHighlighted ? 1.02 : 1,
                  boxShadow: isHighlighted 
                    ? '0 10px 25px -5px rgba(59,130,246,0.3)' 
                    : '0 1px 3px 0 rgba(0,0,0,0.1)'
                }}
                transition={{
                  delay: index * 0.1,
                  duration: isHighlighted ? 0.5 : 0.3
                }}
                className={`rounded-lg p-4 border transition-all duration-500 ${
                  isHighlighted
                    ? 'border-primary-300 dark:border-primary-700 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <img
                    src={comment.authorAvatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face'}
                    alt={comment.authorName}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className={`font-medium transition-colors ${
                        isHighlighted 
                          ? 'text-primary-900 dark:text-primary-100' 
                          : 'text-gray-900 dark:text-white'
                      }`}>
                        {comment.authorName}
                      </span>
                      <span className={`text-sm transition-colors ${
                        isHighlighted 
                          ? 'text-primary-600 dark:text-primary-400' 
                          : 'text-gray-500 dark:text-gray-500'
                      }`}>
                        {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                      </span>
                      {isHighlighted && (
                        <span className="text-xs bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 px-2 py-1 rounded-full animate-pulse">
                          New
                        </span>
                      )}
                    </div>
                    <div className={`leading-relaxed transition-colors ${
                      isHighlighted 
                        ? 'text-primary-700 dark:text-primary-300' 
                        : 'text-gray-700 dark:text-gray-300'
                    }`}>
                      {renderTextWithMentions(comment.content)}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default CommentSection;