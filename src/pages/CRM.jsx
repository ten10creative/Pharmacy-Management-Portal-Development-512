import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useData } from '../contexts/DataContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import ClientModal from '../components/Modals/ClientModal';
import toast from 'react-hot-toast';

const { FiPlus, FiSearch, FiMail, FiPhone, FiMapPin, FiEdit, FiTrash2, FiBuilding, FiUser } = FiIcons;

const CRM = () => {
  const { clients, pharmacies, deleteClient } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingClient, setEditingClient] = useState(null);

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.contact.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (client) => {
    setEditingClient(client);
    setShowModal(true);
  };

  const handleDelete = (client) => {
    if (window.confirm(`Are you sure you want to delete ${client.name}?`)) {
      deleteClient(client.id);
      toast.success('Client deleted successfully');
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingClient(null);
  };

  const getClientPharmacies = (clientId) => {
    return pharmacies.filter(p => p.clientId === clientId);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">CRM - Client Management</h1>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowModal(true)}
          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <SafeIcon icon={FiPlus} />
          <span>Add Client</span>
        </motion.button>
      </div>

      {/* Search Bar */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
        <div className="relative">
          <SafeIcon icon={FiSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            placeholder="Search clients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Clients Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredClients.map((client, index) => {
          const clientPharmacies = getClientPharmacies(client.id);
          return (
            <motion.div
              key={client.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4 flex-1">
                  {/* Client Avatar */}
                  <div className="flex-shrink-0">
                    {client.avatar ? (
                      <img
                        src={client.avatar}
                        alt={client.name}
                        className="w-16 h-16 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900/20 dark:to-primary-800/20 border-2 border-gray-200 dark:border-gray-600 flex items-center justify-center">
                        <SafeIcon icon={FiUser} className="text-primary-600 dark:text-primary-400 text-xl" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white truncate">{client.name}</h3>
                    <p className="text-gray-600 dark:text-gray-400 truncate">{client.contact}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 flex-shrink-0 ml-4">
                  <button
                    onClick={() => handleEdit(client)}
                    className="p-2 text-gray-400 dark:text-gray-500 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                  >
                    <SafeIcon icon={FiEdit} />
                  </button>
                  <button
                    onClick={() => handleDelete(client)}
                    className="p-2 text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                  >
                    <SafeIcon icon={FiTrash2} />
                  </button>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <SafeIcon icon={FiMail} className="mr-3 text-sm text-primary-500 flex-shrink-0" />
                  <span className="text-sm truncate">{client.email}</span>
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <SafeIcon icon={FiPhone} className="mr-3 text-sm text-primary-500 flex-shrink-0" />
                  <span className="text-sm">{client.phone}</span>
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <SafeIcon icon={FiMapPin} className="mr-3 text-sm text-primary-500 flex-shrink-0" />
                  <span className="text-sm truncate">{client.address}</span>
                </div>
              </div>

              {/* Assigned Pharmacies */}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Assigned Pharmacies</span>
                  <div className="flex items-center space-x-1">
                    <SafeIcon icon={FiBuilding} className="text-gray-400 dark:text-gray-500 text-sm" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">{clientPharmacies.length}</span>
                  </div>
                </div>
                {clientPharmacies.length > 0 ? (
                  <div className="space-y-1">
                    {clientPharmacies.slice(0, 3).map(pharmacy => (
                      <div key={pharmacy.id} className="flex items-center space-x-2">
                        <img
                          src={pharmacy.avatar || 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=20&h=20&fit=crop&crop=center'}
                          alt={pharmacy.name}
                          className="w-4 h-4 rounded object-cover"
                        />
                        <span className="text-sm text-gray-600 dark:text-gray-400 truncate">
                          {pharmacy.name}
                        </span>
                      </div>
                    ))}
                    {clientPharmacies.length > 3 && (
                      <div className="text-sm text-gray-500 dark:text-gray-500">
                        +{clientPharmacies.length - 3} more
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 dark:text-gray-500">No pharmacies assigned</p>
                )}
              </div>

              <div className="pt-4 border-t border-gray-200 dark:border-gray-700 mt-4">
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  Client since {new Date(client.createdAt).toLocaleDateString()}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {filteredClients.length === 0 && (
        <div className="text-center py-12">
          <SafeIcon icon={FiSearch} className="mx-auto text-gray-400 dark:text-gray-500 text-4xl mb-4" />
          <p className="text-gray-600 dark:text-gray-400">No clients found matching your search.</p>
        </div>
      )}

      {showModal && (
        <ClientModal
          client={editingClient}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

export default CRM;