import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useData } from '../contexts/DataContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import PharmacyModal from '../components/Modals/PharmacyModal';
import toast from 'react-hot-toast';

const { FiPlus, FiSearch, FiMapPin, FiPhone, FiMail, FiCalendar, FiEdit, FiTrash2 } = FiIcons;

const Pharmacies = () => {
  const { pharmacies, clients, deletePharmacy } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingPharmacy, setEditingPharmacy] = useState(null);

  const filteredPharmacies = pharmacies.filter(pharmacy =>
    pharmacy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pharmacy.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (e, pharmacy) => {
    e.preventDefault();
    e.stopPropagation();
    setEditingPharmacy(pharmacy);
    setShowModal(true);
  };

  const handleDelete = (e, pharmacy) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete ${pharmacy.name}?`)) {
      deletePharmacy(pharmacy.id);
      toast.success('Pharmacy deleted successfully');
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingPharmacy(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Pharmacies</h1>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowModal(true)}
          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <SafeIcon icon={FiPlus} />
          <span>Add Pharmacy</span>
        </motion.button>
      </div>

      {/* Search Bar */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
        <div className="relative">
          <SafeIcon icon={FiSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            placeholder="Search pharmacies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Pharmacies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPharmacies.map((pharmacy, index) => {
          const client = clients.find(c => c.id === pharmacy.clientId);
          return (
            <motion.div
              key={pharmacy.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              <Link
                to={`/pharmacies/${pharmacy.id}`}
                className="block bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg hover:scale-[1.02] transition-all duration-200 cursor-pointer group-hover:border-primary-300 dark:group-hover:border-primary-700"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    {/* Pharmacy Avatar/Logo */}
                    <img
                      src={pharmacy.avatar || 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=100&h=100&fit=crop&crop=center'}
                      alt={`${pharmacy.name} logo`}
                      className="w-12 h-12 rounded-xl object-cover border-2 border-gray-200 dark:border-gray-600 flex-shrink-0 group-hover:border-primary-300 dark:group-hover:border-primary-700 transition-colors"
                    />
                    <div className="min-w-0 flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors truncate">
                        {pharmacy.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                        {client?.name || 'No Client Assigned'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 flex-shrink-0 ml-2">
                    <button
                      onClick={(e) => handleEdit(e, pharmacy)}
                      className="p-1 text-gray-400 dark:text-gray-500 hover:text-primary-600 dark:hover:text-primary-400 transition-colors z-10 relative"
                      title="Edit pharmacy"
                    >
                      <SafeIcon icon={FiEdit} className="text-sm" />
                    </button>
                    <button
                      onClick={(e) => handleDelete(e, pharmacy)}
                      className="p-1 text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 transition-colors z-10 relative"
                      title="Delete pharmacy"
                    >
                      <SafeIcon icon={FiTrash2} className="text-sm" />
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center text-gray-600 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">
                    <SafeIcon icon={FiMapPin} className="mr-2 text-sm flex-shrink-0 text-primary-500 group-hover:text-primary-600 transition-colors" />
                    <span className="text-sm truncate">{pharmacy.address}</span>
                  </div>
                  <div className="flex items-center text-gray-600 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">
                    <SafeIcon icon={FiPhone} className="mr-2 text-sm flex-shrink-0 text-primary-500 group-hover:text-primary-600 transition-colors" />
                    <span className="text-sm">{pharmacy.phone}</span>
                  </div>
                  <div className="flex items-center text-gray-600 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">
                    <SafeIcon icon={FiMail} className="mr-2 text-sm flex-shrink-0 text-primary-500 group-hover:text-primary-600 transition-colors" />
                    <span className="text-sm truncate">{pharmacy.email}</span>
                  </div>
                  <div className="flex items-center text-gray-600 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">
                    <SafeIcon icon={FiCalendar} className="mr-2 text-sm flex-shrink-0 text-primary-500 group-hover:text-primary-600 transition-colors" />
                    <span className="text-sm">Next Inspection: {pharmacy.nextInspection}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-800 dark:group-hover:text-gray-200 transition-colors">
                    Clean Room: {pharmacy.cleanRoomType}
                  </span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    pharmacy.status === 'active'
                      ? 'bg-success-100 dark:bg-success-900/20 text-success-800 dark:text-success-400'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
                  }`}>
                    {pharmacy.status}
                  </span>
                </div>

                {/* Hover indicator */}
                <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <div className="flex items-center text-primary-600 dark:text-primary-400 text-sm">
                    <span>Click to view details</span>
                    <SafeIcon icon={FiMapPin} className="ml-1 text-xs" />
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {filteredPharmacies.length === 0 && (
        <div className="text-center py-12">
          <SafeIcon icon={FiSearch} className="mx-auto text-gray-400 dark:text-gray-500 text-4xl mb-4" />
          <p className="text-gray-600 dark:text-gray-400">No pharmacies found matching your search.</p>
        </div>
      )}

      {showModal && (
        <PharmacyModal
          pharmacy={editingPharmacy}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

export default Pharmacies;