import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiFileText, FiDownload, FiEye, FiPlus, FiSearch, FiFilter, FiCalendar, FiUser } = FiIcons;

const Documents = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  // Mock documents data
  const documents = [
    {
      id: '1',
      name: 'Clean Room Protocol Manual',
      type: 'pdf',
      size: '2.4 MB',
      uploadedBy: 'John Doe',
      uploadedAt: '2024-01-15',
      category: 'protocol',
      url: '#'
    },
    {
      id: '2',
      name: 'Equipment Maintenance Log Template',
      type: 'xlsx',
      size: '156 KB',
      uploadedBy: 'Jane Smith',
      uploadedAt: '2024-01-20',
      category: 'template',
      url: '#'
    },
    {
      id: '3',
      name: 'Inspection Checklist 2024',
      type: 'docx',
      size: '324 KB',
      uploadedBy: 'John Doe',
      uploadedAt: '2024-01-25',
      category: 'checklist',
      url: '#'
    },
    {
      id: '4',
      name: 'Compliance Report Q1 2024',
      type: 'pdf',
      size: '1.8 MB',
      uploadedBy: 'Jane Smith',
      uploadedAt: '2024-02-01',
      category: 'report',
      url: '#'
    },
    {
      id: '5',
      name: 'Training Materials - Clean Room Procedures',
      type: 'pptx',
      size: '5.2 MB',
      uploadedBy: 'John Doe',
      uploadedAt: '2024-02-05',
      category: 'training',
      url: '#'
    }
  ];

  const categories = [
    { value: 'all', label: 'All Documents' },
    { value: 'protocol', label: 'Protocols' },
    { value: 'template', label: 'Templates' },
    { value: 'checklist', label: 'Checklists' },
    { value: 'report', label: 'Reports' },
    { value: 'training', label: 'Training' }
  ];

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || doc.category === filterType;
    return matchesSearch && matchesFilter;
  });

  const getFileIcon = (type) => {
    return FiFileText; // For simplicity, using same icon for all
  };

  const getFileTypeColor = (type) => {
    switch (type) {
      case 'pdf': return 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400';
      case 'docx': return 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400';
      case 'xlsx': return 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400';
      case 'pptx': return 'bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-400';
      default: return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Document Library</h1>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <SafeIcon icon={FiPlus} />
          <span>Upload Document</span>
        </motion.button>
      </div>

      {/* Search and Filter */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-64">
            <div className="relative">
              <SafeIcon icon={FiSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                placeholder="Search documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <SafeIcon icon={FiFilter} className="text-gray-400 dark:text-gray-500" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              {categories.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDocuments.map((document, index) => (
          <motion.div
            key={document.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/20 rounded-lg flex items-center justify-center">
                <SafeIcon icon={getFileIcon(document.type)} className="text-primary-600 dark:text-primary-400 text-xl" />
              </div>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getFileTypeColor(document.type)}`}>
                {document.type.toUpperCase()}
              </span>
            </div>

            <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
              {document.name}
            </h3>

            <div className="space-y-2 mb-4">
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <span className="font-medium">Size:</span>
                <span className="ml-1">{document.size}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <SafeIcon icon={FiUser} className="mr-1" />
                <span>{document.uploadedBy}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <SafeIcon icon={FiCalendar} className="mr-1" />
                <span>{document.uploadedAt}</span>
              </div>
            </div>

            <div className="flex items-center space-x-2 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button className="flex-1 bg-primary-600 hover:bg-primary-700 text-white px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-center space-x-1">
                <SafeIcon icon={FiEye} className="text-sm" />
                <span>View</span>
              </button>
              <button className="p-2 text-gray-400 dark:text-gray-500 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                <SafeIcon icon={FiDownload} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredDocuments.length === 0 && (
        <div className="text-center py-12">
          <SafeIcon icon={FiFileText} className="mx-auto text-gray-400 dark:text-gray-500 text-4xl mb-4" />
          <p className="text-gray-600 dark:text-gray-400">No documents found matching your criteria.</p>
        </div>
      )}

      {/* Document Stats */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Document Statistics</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {categories.slice(1).map((category, index) => {
            const count = documents.filter(doc => doc.category === category.value).length;
            return (
              <div key={category.value} className="text-center">
                <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">{count}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{category.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Documents;