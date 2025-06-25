import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useData } from '../contexts/DataContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import TaskDetailModal from '../components/Modals/TaskDetailModal';
import TaskModal from '../components/Modals/TaskModal';

const { FiBuilding, FiUsers, FiCheckSquare, FiAlertCircle, FiTrendingUp, FiCalendar, FiArrowRight, FiMessageCircle } = FiIcons;

const Dashboard = () => {
  const { pharmacies, clients, tasks, taskComments } = useData();
  const [selectedTask, setSelectedTask] = useState(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const stats = [
    {
      title: 'Total Pharmacies',
      value: pharmacies.length,
      icon: FiBuilding,
      color: 'bg-primary-500',
      change: '+12%',
      link: '/pharmacies'
    },
    {
      title: 'Active Clients',
      value: clients.length,
      icon: FiUsers,
      color: 'bg-success-500',
      change: '+8%',
      link: '/crm'
    },
    {
      title: 'Tasks In Progress',
      value: tasks.filter(t => t.status === 'in-progress').length,
      icon: FiCheckSquare,
      color: 'bg-warning-500',
      change: '+5%',
      link: '/tasks'
    },
    {
      title: 'Overdue Tasks',
      value: tasks.filter(t => new Date(t.dueDate) < new Date() && t.status !== 'complete').length,
      icon: FiAlertCircle,
      color: 'bg-danger-500',
      change: '-15%',
      link: '/tasks'
    }
  ];

  const recentTasks = tasks.slice(0, 5);
  const upcomingInspections = pharmacies
    .filter(p => p.nextInspection)
    .sort((a, b) => new Date(a.nextInspection) - new Date(b.nextInspection))
    .slice(0, 5);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-red-200 dark:border-red-800';
      case 'medium': return 'border-yellow-200 dark:border-yellow-800';
      case 'low': return 'border-green-200 dark:border-green-800';
      default: return 'border-gray-200 dark:border-gray-700';
    }
  };

  const isOverdue = (dueDate, status) => {
    return new Date(dueDate) < new Date() && status !== 'complete';
  };

  const getTaskCommentCount = (taskId) => {
    return taskComments ? taskComments.filter(c => c.taskId === taskId).length : 0;
  };

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setShowTaskModal(true);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowEditModal(true);
  };

  const closeTaskModal = () => {
    setShowTaskModal(false);
    setSelectedTask(null);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setEditingTask(null);
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
          <SafeIcon icon={FiCalendar} />
          <span className="text-sm md:text-base">{new Date().toLocaleDateString()}</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group"
          >
            {stat.link ? (
              <Link to={stat.link} className="block">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 md:p-6 hover:shadow-md hover:scale-[1.02] transition-all duration-200 cursor-pointer group-hover:border-primary-300 dark:group-hover:border-primary-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 dark:text-gray-400 text-xs md:text-sm font-medium group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                        {stat.title}
                      </p>
                      <p className="text-xl md:text-3xl font-bold text-gray-900 dark:text-white mt-1">
                        {stat.value}
                      </p>
                      <div className="flex items-center mt-2">
                        <SafeIcon icon={FiTrendingUp} className="text-success-500 text-xs md:text-sm mr-1" />
                        <span className="text-success-500 text-xs md:text-sm font-medium">{stat.change}</span>
                      </div>
                    </div>
                    <div className={`w-8 h-8 md:w-12 md:h-12 ${stat.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                      <SafeIcon icon={stat.icon} className="text-white text-sm md:text-xl" />
                    </div>
                  </div>
                  {/* Hover indicator */}
                  <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <div className="flex items-center text-primary-600 dark:text-primary-400 text-sm">
                      <span>Click to view details</span>
                      <SafeIcon icon={FiArrowRight} className="ml-1 text-xs" />
                    </div>
                  </div>
                </div>
              </Link>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 md:p-6 hover:shadow-md transition-all duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 dark:text-gray-400 text-xs md:text-sm font-medium">{stat.title}</p>
                    <p className="text-xl md:text-3xl font-bold text-gray-900 dark:text-white mt-1">{stat.value}</p>
                    <div className="flex items-center mt-2">
                      <SafeIcon icon={FiTrendingUp} className="text-success-500 text-xs md:text-sm mr-1" />
                      <span className="text-success-500 text-xs md:text-sm font-medium">{stat.change}</span>
                    </div>
                  </div>
                  <div className={`w-8 h-8 md:w-12 md:h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                    <SafeIcon icon={stat.icon} className="text-white text-sm md:text-xl" />
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6">
        {/* Recent Tasks */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200"
        >
          <div className="p-4 md:p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h2 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white">Recent Tasks</h2>
              <Link
                to="/tasks"
                className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 text-sm font-medium flex items-center space-x-1 transition-colors"
              >
                <span>View All</span>
                <SafeIcon icon={FiArrowRight} className="text-sm" />
              </Link>
            </div>
          </div>
          <div className="p-4 md:p-6">
            <div className="space-y-3 md:space-y-4">
              {recentTasks.map((task) => {
                const pharmacy = pharmacies.find(p => p.id === task.pharmacyId);
                const overdue = isOverdue(task.dueDate, task.status);
                const commentCount = getTaskCommentCount(task.id);

                return (
                  <button
                    key={task.id}
                    onClick={() => handleTaskClick(task)}
                    className={`w-full text-left flex items-center justify-between p-3 border rounded-lg transition-all duration-200 hover:shadow-md hover:scale-[1.02] cursor-pointer group ${
                      overdue
                        ? 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/10 hover:bg-red-100 dark:hover:bg-red-900/20'
                        : `${getPriorityColor(task.priority)} bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700`
                    }`}
                  >
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <img
                        src={pharmacy?.avatar || 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=100&h=100&fit=crop&crop=center'}
                        alt={`${pharmacy?.name || 'Pharmacy'} logo`}
                        className="w-8 h-8 rounded-lg object-cover border border-gray-200 dark:border-gray-600 flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className={`font-medium text-sm md:text-base truncate transition-colors ${
                            overdue
                              ? 'text-red-900 dark:text-red-100 group-hover:text-red-800 dark:group-hover:text-red-50'
                              : 'text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400'
                          }`}>
                            {task.title}
                          </h3>
                          {commentCount > 0 && (
                            <div className="flex items-center space-x-1 text-gray-500 dark:text-gray-400">
                              <SafeIcon icon={FiMessageCircle} className="text-xs" />
                              <span className="text-xs">{commentCount}</span>
                            </div>
                          )}
                        </div>
                        <p className={`text-xs md:text-sm truncate transition-colors ${
                          overdue
                            ? 'text-red-700 dark:text-red-300'
                            : 'text-gray-600 dark:text-gray-400'
                        }`}>
                          {task.description}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          <p className={`text-xs transition-colors ${
                            overdue
                              ? 'text-red-600 dark:text-red-400 font-medium'
                              : 'text-gray-500 dark:text-gray-500'
                          }`}>
                            {overdue ? 'Overdue: ' : 'Due: '}{task.dueDate}
                          </p>
                          {overdue && (
                            <span className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 px-2 py-0.5 text-xs font-medium rounded-full">
                              OVERDUE
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="ml-4 flex-shrink-0 flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        task.status === 'complete'
                          ? 'bg-success-100 dark:bg-success-900/20 text-success-800 dark:text-success-400'
                          : task.status === 'in-progress'
                          ? 'bg-warning-100 dark:bg-warning-900/20 text-warning-800 dark:text-warning-400'
                          : task.status === 'up-next'
                          ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
                      }`}>
                        {task.status === 'up-next' ? 'Up Next' : task.status === 'in-progress' ? 'In Progress' : task.status}
                      </span>
                      <SafeIcon icon={FiArrowRight} className="text-gray-400 dark:text-gray-500 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors text-sm" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Upcoming Inspections */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200"
        >
          <div className="p-4 md:p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h2 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white">Upcoming Inspections</h2>
              <Link
                to="/pharmacies"
                className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 text-sm font-medium flex items-center space-x-1 transition-colors"
              >
                <span>View All</span>
                <SafeIcon icon={FiArrowRight} className="text-sm" />
              </Link>
            </div>
          </div>
          <div className="p-4 md:p-6">
            <div className="space-y-3 md:space-y-4">
              {upcomingInspections.map((pharmacy) => (
                <Link
                  key={pharmacy.id}
                  to={`/pharmacies/${pharmacy.id}`}
                  className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 hover:shadow-md hover:scale-[1.02] cursor-pointer group"
                >
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <img
                      src={pharmacy.avatar || 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=100&h=100&fit=crop&crop=center'}
                      alt={`${pharmacy.name} logo`}
                      className="w-8 h-8 rounded-lg object-cover border border-gray-200 dark:border-gray-600 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 dark:text-white text-sm md:text-base truncate group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                        {pharmacy.name}
                      </h3>
                      <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">{pharmacy.cleanRoomType}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">Next: {pharmacy.nextInspection}</p>
                    </div>
                  </div>
                  <div className="ml-4 flex-shrink-0 flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      new Date(pharmacy.nextInspection) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                        ? 'bg-warning-100 dark:bg-warning-900/20 text-warning-800 dark:text-warning-400'
                        : 'bg-success-100 dark:bg-success-900/20 text-success-800 dark:text-success-400'
                    }`}>
                      {new Date(pharmacy.nextInspection) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) ? 'Due Soon' : 'Scheduled'}
                    </span>
                    <SafeIcon icon={FiArrowRight} className="text-gray-400 dark:text-gray-500 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors text-sm" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Task Detail Modal */}
      {showTaskModal && selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          onClose={closeTaskModal}
          onEdit={handleEditTask}
        />
      )}

      {/* Task Edit Modal */}
      {showEditModal && editingTask && (
        <TaskModal
          task={editingTask}
          onClose={closeEditModal}
        />
      )}
    </div>
  );
};

export default Dashboard;