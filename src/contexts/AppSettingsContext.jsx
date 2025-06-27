import React, { createContext, useContext, useState, useEffect } from 'react';
import { appSettingsService } from '../services/appSettingsService';

const AppSettingsContext = createContext();

export const useAppSettings = () => {
  const context = useContext(AppSettingsContext);
  if (!context) {
    throw new Error('useAppSettings must be used within an AppSettingsProvider');
  }
  return context;
};

export const AppSettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);

  // Load settings on mount
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const settingsObject = await appSettingsService.getAsObject();
      setSettings(settingsObject);
    } catch (error) {
      console.error('Error loading app settings:', error);
      // Set default values if loading fails
      setSettings({
        app_name: 'PharmaCRM',
        app_tagline: 'Clean Room Management System',
        app_logo_url: '',
        primary_color: '#3b82f6',
        secondary_color: '#1e40af',
        company_name: 'Pharmacy Solutions',
        welcome_message: 'Welcome to your pharmacy management dashboard!'
      });
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = async (key, value) => {
    try {
      await appSettingsService.updateSetting(key, value);
      setSettings(prev => ({ ...prev, [key]: value }));
      return true;
    } catch (error) {
      console.error('Error updating setting:', error);
      throw error;
    }
  };

  const updateMultipleSettings = async (settingsArray) => {
    try {
      await appSettingsService.updateMultiple(settingsArray);
      const newSettings = settingsArray.reduce((acc, setting) => {
        acc[setting.key] = setting.value;
        return acc;
      }, {});
      setSettings(prev => ({ ...prev, ...newSettings }));
      return true;
    } catch (error) {
      console.error('Error updating multiple settings:', error);
      throw error;
    }
  };

  // Helper functions for common settings
  const getAppName = () => settings.app_name || 'PharmaCRM';
  const getAppTagline = () => settings.app_tagline || 'Clean Room Management System';
  const getAppLogo = () => settings.app_logo_url || '';
  const getPrimaryColor = () => settings.primary_color || '#3b82f6';
  const getSecondaryColor = () => settings.secondary_color || '#1e40af';
  const getCompanyName = () => settings.company_name || 'Pharmacy Solutions';
  const getWelcomeMessage = () => settings.welcome_message || 'Welcome to your pharmacy management dashboard!';

  const value = {
    settings,
    loading,
    updateSetting,
    updateMultipleSettings,
    loadSettings,
    // Helper functions
    getAppName,
    getAppTagline,
    getAppLogo,
    getPrimaryColor,
    getSecondaryColor,
    getCompanyName,
    getWelcomeMessage
  };

  return (
    <AppSettingsContext.Provider value={value}>
      {children}
    </AppSettingsContext.Provider>
  );
};