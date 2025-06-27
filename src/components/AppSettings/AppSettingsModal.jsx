import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAppSettings } from '../../contexts/AppSettingsContext';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import toast from 'react-hot-toast';

const { FiX, FiSave, FiUpload, FiImage, FiType, FiPalette, FiBuilding } = FiIcons;

const AppSettingsModal = ({ isOpen, onClose }) => {
  const { settings, updateMultipleSettings, loading } = useAppSettings();
  const [formData, setFormData] = useState({
    app_name: '',
    app_tagline: '',
    app_logo_url: '',
    primary_color: '',
    secondary_color: '',
    company_name: '',
    welcome_message: ''
  });
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('branding');

  useEffect(() => {
    if (settings && Object.keys(settings).length > 0) {
      console.log('Setting form data from settings:', settings);
      setFormData({
        app_name: settings.app_name || '',
        app_tagline: settings.app_tagline || '',
        app_logo_url: settings.app_logo_url || '',
        primary_color: settings.primary_color || '#3b82f6',
        secondary_color: settings.secondary_color || '#1e40af',
        company_name: settings.company_name || '',
        welcome_message: settings.welcome_message || ''
      });
    }
  }, [settings]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      console.log('Submitting form data:', formData);
      
      // Convert form data to settings array
      const settingsArray = Object.keys(formData)
        .filter(key => formData[key] !== '') // Only include non-empty values
        .map(key => ({
          key,
          value: formData[key]
        }));

      console.log('Settings array to save:', settingsArray);

      await updateMultipleSettings(settingsArray);
      toast.success('App settings updated successfully!');
      onClose();
    } catch (error) {
      console.error('Error updating app settings:', error);
      toast.error('Failed to update app settings. Please check the console for details.');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log('Form field changed:', name, '=', value);
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }

      // Validate file size (2MB limit)
      if (file.size > 2 * 1024 * 1024) {
        toast.error('File size must be less than 2MB');
        return;
      }

      // In a real app, you'd upload to Supabase Storage or another service
      const imageUrl = URL.createObjectURL(file);
      setFormData(prev => ({ ...prev, [field]: imageUrl }));
      toast.success('Image uploaded successfully');
    }
  };

  const tabs = [
    { id: 'branding', label: 'Branding', icon: FiPalette },
    { id: 'company', label: 'Company', icon: FiBuilding },
    { id: 'content', label: 'Content', icon: FiType }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden border border-gray-200 dark:border-gray-700"
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              App Settings
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <SafeIcon icon={FiX} className="text-xl" />
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="flex space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1 mt-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium text-sm transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-white dark:bg-gray-600 text-primary-600 dark:text-primary-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                }`}
              >
                <SafeIcon icon={tab.icon} className="text-lg" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="h-[calc(90vh-200px)] overflow-y-auto">
          <div className="p-6 space-y-6">
            {activeTab === 'branding' && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Branding Settings</h3>

                {/* App Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Application Name
                  </label>
                  <input
                    type="text"
                    name="app_name"
                    value={formData.app_name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter app name"
                  />
                </div>

                {/* App Tagline */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tagline
                  </label>
                  <input
                    type="text"
                    name="app_tagline"
                    value={formData.app_tagline}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter app tagline"
                  />
                </div>

                {/* App Logo */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                    Application Logo
                  </label>
                  <div className="flex items-center space-x-6">
                    <div className="flex-shrink-0">
                      {formData.app_logo_url ? (
                        <img
                          src={formData.app_logo_url}
                          alt="App Logo"
                          className="w-20 h-20 rounded-xl object-cover border-2 border-gray-300 dark:border-gray-600"
                        />
                      ) : (
                        <div className="w-20 h-20 rounded-xl bg-gray-100 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 flex items-center justify-center">
                          <SafeIcon icon={FiImage} className="text-gray-400 dark:text-gray-500 text-2xl" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <input
                        type="file"
                        id="logo-upload"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, 'app_logo_url')}
                        className="hidden"
                      />
                      <label
                        htmlFor="logo-upload"
                        className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg cursor-pointer inline-flex items-center space-x-2 transition-colors"
                      >
                        <SafeIcon icon={FiUpload} />
                        <span>Upload Logo</span>
                      </label>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                        PNG, JPG or SVG. Max size 2MB.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Colors */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Primary Color
                    </label>
                    <div className="flex items-center space-x-3">
                      <input
                        type="color"
                        name="primary_color"
                        value={formData.primary_color}
                        onChange={handleChange}
                        className="w-12 h-10 rounded-lg border border-gray-300 dark:border-gray-600"
                      />
                      <input
                        type="text"
                        name="primary_color"
                        value={formData.primary_color}
                        onChange={handleChange}
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="#3b82f6"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Secondary Color
                    </label>
                    <div className="flex items-center space-x-3">
                      <input
                        type="color"
                        name="secondary_color"
                        value={formData.secondary_color}
                        onChange={handleChange}
                        className="w-12 h-10 rounded-lg border border-gray-300 dark:border-gray-600"
                      />
                      <input
                        type="text"
                        name="secondary_color"
                        value={formData.secondary_color}
                        onChange={handleChange}
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="#1e40af"
                      />
                    </div>
                  </div>
                </div>

                {/* Preview */}
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Preview</h4>
                  <div className="flex items-center space-x-3">
                    {formData.app_logo_url ? (
                      <img
                        src={formData.app_logo_url}
                        alt="Logo Preview"
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                    ) : (
                      <div 
                        className="w-10 h-10 rounded-lg flex items-center justify-center text-white"
                        style={{ backgroundColor: formData.primary_color }}
                      >
                        <SafeIcon icon={FiImage} />
                      </div>
                    )}
                    <div>
                      <h5 className="font-semibold text-gray-900 dark:text-white">
                        {formData.app_name || 'App Name'}
                      </h5>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {formData.app_tagline || 'App Tagline'}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'company' && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Company Information</h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Company Name
                  </label>
                  <input
                    type="text"
                    name="company_name"
                    value={formData.company_name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter company name"
                  />
                </div>
              </motion.div>
            )}

            {activeTab === 'content' && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Content Settings</h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Welcome Message
                  </label>
                  <textarea
                    name="welcome_message"
                    value={formData.welcome_message}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter welcome message"
                  />
                </div>
              </motion.div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
            <div className="flex items-center justify-end space-x-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving || loading}
                className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <SafeIcon icon={FiSave} />
                <span>{saving ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default AppSettingsModal;