import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import KanbanBoard from '../components/Kanban/KanbanBoard';
import TaskModal from '../components/Modals/TaskModal';
import TaskDetailModal from '../components/Modals/TaskDetailModal';
import toast from 'react-hot-toast';

const { FiPlus, FiFilter, FiList, FiGrid, FiSearch, FiEdit, FiTrash2, FiEye, FiMessageCircle } = FiIcons;

const Tasks = () => {
  const { tasks, deleteTask, updateTask, pharmacies, taskComments } = useData();
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [filter, setFilter] = useState('all');
  const [viewMode, setViewMode] = useState('kanban');
  const [searchTerm, setSearchTerm] = useState('');
  const [presetStatus, setPresetStatus] = useState(null);
  const [highlightedTaskId, setHighlightedTaskId] = useState(null);

  // Handle highlighting task from URL parameter
  useEffect(() => {
    const highlightId = searchParams.get('highlight');
    if (highlightId) {
      setHighlightedTaskId(highlightId);
      // Switch to list view for better visibility of highlighted task
      setViewMode('list');
      // Clear the highlight after 3 seconds
      setTimeout(() => {
        setHighlightedTaskId(null);
        setSearchParams({});
      }, 3000);
    }
  }, [searchParams, setSearchParams]);

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === 'all') return matchesSearch;
    if (filter === 'my-tasks') return task.assignedTo === user.id && matchesSearch;
    return task.status === filter && matchesSearch;
  });

  const handleEdit = (task) => {
    setEditingTask(task);
    setShowModal(true);
  };

  const handleViewDetails = (task) => {
    setSelectedTask(task);
    setShowDetailModal(true);
  };

  const handleDelete = (task) => {
    if (window.confirm(`Are you sure you want to delete "${task.title}"?`)) {
      deleteTask(task.id);
      toast.success('Task deleted successfully');
    }
  };

  const handleStatusChange = (taskId, newStatus) => {
    updateTask(taskId, { status: newStatus });
    toast.success('Task status updated');
  };

  const handleAddTask = (status = null) => {
    setPresetStatus(status);
    setEditingTask(null);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingTask(null);
    setPresetStatus(null);
  };

  const closeDetailModal = () => {
    setShowDetailModal(false);
    setSelectedTask(null);
  };

  const taskStats = [
    { label: 'Backlog', value: tasks.filter(t => t.status === 'backlog').length, color: 'bg-gray-500' },
    { label: 'Up Next', value: tasks.filter(t => t.status === 'up-next').length, color: 'bg-blue-500' },
    { label: 'In Progress', value: tasks.filter(t => t.status === 'in-progress').length, color: 'bg-yellow-500' },
    { label: 'Complete', value: tasks.filter(t => t.status === 'complete').length, color: 'bg-green-500' }
  ];

  const getPharmacyName = (pharmacyId) => {
    const pharmacy = pharmacies.find(p => p.id === pharmacyId);
    return pharmacy?.name || 'Unknown Pharmacy';
  };

  const getTaskCommentCount = (taskId) => {
    return taskComments.filter(c => c.taskId === taskId).length;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Task Management</h1>
        <div className="flex items-center space-x-3">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'kanban'
                  ? 'bg-white dark:bg-gray-600 text-primary-600 dark:text-primary-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
              title="Kanban View"
            >
              <SafeIcon icon={FiGrid} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-gray-600 text-primary-600 dark:text-primary-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
              title="List View"
            >
              <SafeIcon icon={FiList} />
            </button>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleAddTask()}
            className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <SafeIcon icon={FiPlus} />
            <span>Add Task</span>
          </motion.button>
        </div>
      </div>

      {/* Task Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {taskStats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4"
          >
            <div className="flex items-center">
              <div className={`w-3 h-3 ${stat.color} rounded-full mr-3`}></div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Filters and Search */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex-1 min-w-64">
            <div className="relative">
              <SafeIcon icon={FiSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <SafeIcon icon={FiFilter} className="text-gray-400 dark:text-gray-500" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Tasks</option>
              <option value="my-tasks">My Tasks</option>
              <option value="backlog">Backlog</option>
              <option value="up-next">Up Next</option>
              <option value="in-progress">In Progress</option>
              <option value="complete">Complete</option>
            </select>
          </div>
        </div>
      </div>

      {/* Task View */}
      {viewMode === 'kanban' ? (
        <KanbanBoard
          tasks={filteredTasks}
          onEditTask={handleEdit}
          onDeleteTask={handleDelete}
          onStatusChange={handleStatusChange}
          onAddTask={handleAddTask}
          onViewDetails={handleViewDetails}
        />
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6">
            <div className="space-y-4">
              {filteredTasks.map((task, index) => {
                const isHighlighted = highlightedTaskId === task.id;
                const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'complete';
                const commentCount = getTaskCommentCount(task.id);

                return (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      scale: isHighlighted ? 1.02 : 1,
                      boxShadow: isHighlighted ? '0 10px 25px -5px rgba(59,130,246,0.3)' : '0 1px 3px 0 rgba(0,0,0,0.1)'
                    }}
                    transition={{ delay: index * 0.05 }}
                    className={`rounded-lg p-4 border transition-all duration-500 ${
                      isHighlighted
                        ? 'border-primary-300 dark:border-primary-700 bg-primary-50 dark:bg-primary-900/20'
                        : isOverdue
                        ? 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/10'
                        : 'border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className={`text-lg font-semibold transition-colors ${
                            isHighlighted
                              ? 'text-primary-900 dark:text-primary-100'
                              : 'text-gray-900 dark:text-white'
                          }`}>
                            {task.title}
                          </h3>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            task.priority === 'high'
                              ? 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400'
                              : task.priority === 'medium'
                              ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400'
                              : 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400'
                          }`}>
                            {task.priority}
                          </span>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            task.status === 'complete'
                              ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400'
                              : task.status === 'in-progress'
                              ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400'
                              : task.status === 'up-next'
                              ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
                          }`}>
                            {task.status === 'up-next' ? 'Up Next' : task.status === 'in-progress' ? 'In Progress' : task.status}
                          </span>
                          {commentCount > 0 && (
                            <div className="flex items-center space-x-1 text-gray-500 dark:text-gray-400">
                              <SafeIcon icon={FiMessageCircle} className="text-sm" />
                              <span className="text-xs">{commentCount}</span>
                            </div>
                          )}
                        </div>
                        <p className={`mb-2 transition-colors ${
                          isHighlighted
                            ? 'text-primary-700 dark:text-primary-300'
                            : 'text-gray-600 dark:text-gray-400'
                        }`}>
                          {task.description}
                        </p>
                        <div className="flex items-center space-x-4 text-sm">
                          <span className={`transition-colors ${
                            isHighlighted
                              ? 'text-primary-600 dark:text-primary-400'
                              : 'text-gray-500 dark:text-gray-500'
                          }`}>
                            Pharmacy: {getPharmacyName(task.pharmacyId)}
                          </span>
                          <span className={`font-medium transition-colors ${
                            isOverdue
                              ? 'text-red-600 dark:text-red-400'
                              : isHighlighted
                              ? 'text-primary-600 dark:text-primary-400'
                              : 'text-gray-500 dark:text-gray-500'
                          }`}>
                            {isOverdue ? 'Overdue: ' : 'Due: '}{task.dueDate}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <button
                          onClick={() => handleViewDetails(task)}
                          className="p-2 text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                          title="View details"
                        >
                          <SafeIcon icon={FiEye} />
                        </button>
                        <button
                          onClick={() => handleEdit(task)}
                          className="p-2 text-gray-400 dark:text-gray-500 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                          title="Edit task"
                        >
                          <SafeIcon icon={FiEdit} />
                        </button>
                        <button
                          onClick={() => handleDelete(task)}
                          className="p-2 text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                          title="Delete task"
                        >
                          <SafeIcon icon={FiTrash2} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {filteredTasks.length === 0 && (
        <div className="text-center py-12">
          <SafeIcon icon={FiList} className="mx-auto text-gray-400 dark:text-gray-500 text-4xl mb-4" />
          <p className="text-gray-600 dark:text-gray-400">No tasks found matching your criteria.</p>
        </div>
      )}

      {showModal && (
        <TaskModal
          task={editingTask}
          presetStatus={presetStatus}
          onClose={closeModal}
        />
      )}

      {showDetailModal && selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          onClose={closeDetailModal}
          onEdit={handleEdit}
        />
      )}
    </div>
  );
};

export default Tasks;