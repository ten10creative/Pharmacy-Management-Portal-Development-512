import React, { useState, useEffect } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import CommentSection from '../components/Comments/CommentSection';
import FileUpload from '../components/Files/FileUpload';
import JotFormEmbed from '../components/Forms/JotFormEmbed';
import PharmacyModal from '../components/Modals/PharmacyModal';
import toast from 'react-hot-toast';

const { FiArrowLeft, FiMapPin, FiPhone, FiMail, FiCalendar, FiEdit, FiMessageCircle, FiUpload, FiFileText, FiExternalLink } = FiIcons;

const PharmacyDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { pharmacies, clients, tasks, comments, files } = useData();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState('overview');
  const [showEditModal, setShowEditModal] = useState(false);
  const [highlightedCommentId, setHighlightedCommentId] = useState(null);

  const pharmacy = pharmacies.find(p => p.id === id);
  const client = clients.find(c => c.id === pharmacy?.clientId);
  const pharmacyTasks = tasks.filter(t => t.pharmacyId === id);
  const pharmacyComments = comments.filter(c => c.pharmacyId === id);
  const pharmacyFiles = files.filter(f => f.pharmacyId === id);

  // Handle URL parameters for navigation from notifications
  useEffect(() => {
    const tab = searchParams.get('tab');
    const highlightId = searchParams.get('highlight');

    if (tab) {
      setActiveTab(tab);
    }

    if (highlightId && tab === 'comments') {
      setHighlightedCommentId(highlightId);
      // Clear the highlight after 5 seconds
      setTimeout(() => {
        setHighlightedCommentId(null);
        setSearchParams({});
      }, 5000);
    }
  }, [searchParams, setSearchParams]);

  if (!pharmacy) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400">Pharmacy not found.</p>
        <Link
          to="/pharmacies"
          className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 mt-4 inline-block"
        >
          Back to Pharmacies
        </Link>
      </div>
    );
  }

  const handleEditPharmacy = () => {
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FiFileText },
    { id: 'comments', label: 'Comments', icon: FiMessageCircle, count: pharmacyComments.length },
    { id: 'files', label: 'Files', icon: FiUpload, count: pharmacyFiles.length },
    { id: 'forms', label: 'Forms', icon: FiExternalLink }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            to="/pharmacies"
            className="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <SafeIcon icon={FiArrowLeft} className="text-xl" />
          </Link>
          {/* Pharmacy Avatar and Info */}
          <div className="flex items-center space-x-4">
            <img
              src={pharmacy.avatar || 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=100&h=100&fit=crop&crop=center'}
              alt={`${pharmacy.name} logo`}
              className="w-16 h-16 rounded-xl object-cover border-2 border-gray-200 dark:border-gray-600"
            />
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{pharmacy.name}</h1>
              <p className="text-gray-600 dark:text-gray-400">{client?.name || 'No Client Assigned'}</p>
            </div>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleEditPharmacy}
          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <SafeIcon icon={FiEdit} />
          <span>Edit Pharmacy</span>
        </motion.button>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-2 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                <SafeIcon icon={tab.icon} />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 text-xs rounded-full">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Contact Information</h3>
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <SafeIcon icon={FiMapPin} className="mr-3 text-primary-500" />
                    <span>{pharmacy.address}</span>
                  </div>
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <SafeIcon icon={FiPhone} className="mr-3 text-primary-500" />
                    <span>{pharmacy.phone}</span>
                  </div>
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <SafeIcon icon={FiMail} className="mr-3 text-primary-500" />
                    <span>{pharmacy.email}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Clean Room Details</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Clean Room Type</label>
                      <p className="text-gray-900 dark:text-white">{pharmacy.cleanRoomType}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Last Inspection</label>
                      <p className="text-gray-900 dark:text-white">{pharmacy.lastInspection}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Next Inspection</label>
                      <p className="text-gray-900 dark:text-white">{pharmacy.nextInspection}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                      <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                        pharmacy.status === 'active'
                          ? 'bg-success-100 dark:bg-success-900/20 text-success-800 dark:text-success-400'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
                      }`}>
                        {pharmacy.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Tasks */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Tasks</h3>
                <div className="space-y-3">
                  {pharmacyTasks.slice(0, 5).map((task) => (
                    <div
                      key={task.id}
                      className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700/50"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">{task.title}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{task.description}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">Due: {task.dueDate}</p>
                        </div>
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
                      </div>
                    </div>
                  ))}
                  {pharmacyTasks.length === 0 && (
                    <p className="text-gray-500 dark:text-gray-500 text-center py-4">
                      No tasks assigned to this pharmacy.
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'comments' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <CommentSection pharmacyId={id} highlightedCommentId={highlightedCommentId} />
            </motion.div>
          )}

          {activeTab === 'files' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <FileUpload pharmacyId={id} />
            </motion.div>
          )}

          {activeTab === 'forms' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <JotFormEmbed />
            </motion.div>
          )}
        </div>
      </div>

      {/* Edit Pharmacy Modal */}
      {showEditModal && (
        <PharmacyModal
          pharmacy={pharmacy}
          onClose={closeEditModal}
        />
      )}
    </div>
  );
};

export default PharmacyDetail;