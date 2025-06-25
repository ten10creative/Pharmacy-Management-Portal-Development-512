import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiExternalLink, FiPlus, FiEdit, FiTrash2 } = FiIcons;

const JotFormEmbed = () => {
  const [forms] = useState([
    {
      id: '1',
      title: 'Clean Room Inspection Form',
      description: 'Monthly inspection checklist for clean room facilities',
      embedCode: '231234567890123456',
      url: 'https://form.jotform.com/231234567890123456'
    },
    {
      id: '2',
      title: 'Equipment Maintenance Log',
      description: 'Log for tracking equipment maintenance activities',
      embedCode: '231234567890123457',
      url: 'https://form.jotform.com/231234567890123457'
    },
    {
      id: '3',
      title: 'Compliance Report',
      description: 'Monthly compliance reporting form',
      embedCode: '231234567890123458',
      url: 'https://form.jotform.com/231234567890123458'
    }
  ]);

  const [selectedForm, setSelectedForm] = useState(null);

  return (
    <div className="space-y-6">
      {!selectedForm ? (
        <>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Available Forms</h3>
            <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
              <SafeIcon icon={FiPlus} />
              <span>Add Form</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {forms.map((form, index) => (
              <motion.div
                key={form.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-start justify-between mb-3">
                  <h4 className="font-medium text-gray-900 dark:text-white">{form.title}</h4>
                  <div className="flex items-center space-x-1">
                    <button className="p-1 text-gray-400 dark:text-gray-500 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                      <SafeIcon icon={FiEdit} className="text-sm" />
                    </button>
                    <button className="p-1 text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 transition-colors">
                      <SafeIcon icon={FiTrash2} className="text-sm" />
                    </button>
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{form.description}</p>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setSelectedForm(form)}
                    className="flex-1 bg-primary-600 hover:bg-primary-700 text-white px-3 py-2 rounded text-sm transition-colors"
                  >
                    Open Form
                  </button>
                  <a
                    href={form.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-gray-400 dark:text-gray-500 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                    title="Open in new tab"
                  >
                    <SafeIcon icon={FiExternalLink} />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{selectedForm.title}</h3>
              <p className="text-gray-600 dark:text-gray-400">{selectedForm.description}</p>
            </div>
            <button
              onClick={() => setSelectedForm(null)}
              className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
            >
              ← Back to Forms
            </button>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <iframe
              src={`https://form.jotform.com/${selectedForm.embedCode}`}
              width="100%"
              height="600"
              frameBorder="0"
              scrolling="auto"
              title={selectedForm.title}
              className="w-full"
            />
          </div>

          <div className="text-center">
            <a
              href={selectedForm.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
            >
              <SafeIcon icon={FiExternalLink} />
              <span>Open form in new tab</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default JotFormEmbed;