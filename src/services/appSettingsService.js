import supabase from '../lib/supabase';
import { v4 as uuidv4 } from 'uuid';

// Helper function to convert snake_case to camelCase
const toCamelCase = (obj) => {
  if (Array.isArray(obj)) {
    return obj.map(toCamelCase);
  } else if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj).reduce((result, key) => {
      const camelKey = key.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
      result[camelKey] = toCamelCase(obj[key]);
      return result;
    }, {});
  }
  return obj;
};

// Helper function to convert camelCase to snake_case
const toSnakeCase = (obj) => {
  if (Array.isArray(obj)) {
    return obj.map(toSnakeCase);
  } else if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj).reduce((result, key) => {
      const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
      result[snakeKey] = toSnakeCase(obj[key]);
      return result;
    }, {});
  }
  return obj;
};

export const appSettingsService = {
  // Get all app settings
  async getAll() {
    try {
      const { data, error } = await supabase
        .from('app_settings_pharma_2024')
        .select('*')
        .order('category', { ascending: true });

      if (error) {
        console.error('Supabase error getting settings:', error);
        throw error;
      }
      
      return toCamelCase(data || []);
    } catch (error) {
      console.error('Error in getAll:', error);
      throw error;
    }
  },

  // Get setting by key
  async getByKey(key) {
    try {
      const { data, error } = await supabase
        .from('app_settings_pharma_2024')
        .select('*')
        .eq('key', key)
        .single();

      if (error) {
        console.error('Supabase error getting setting by key:', error);
        throw error;
      }
      
      return toCamelCase(data);
    } catch (error) {
      console.error('Error in getByKey:', error);
      throw error;
    }
  },

  // Get settings by category
  async getByCategory(category) {
    try {
      const { data, error } = await supabase
        .from('app_settings_pharma_2024')
        .select('*')
        .eq('category', category)
        .order('key', { ascending: true });

      if (error) {
        console.error('Supabase error getting settings by category:', error);
        throw error;
      }
      
      return toCamelCase(data || []);
    } catch (error) {
      console.error('Error in getByCategory:', error);
      throw error;
    }
  },

  // Update setting value
  async updateSetting(key, value) {
    try {
      console.log('Updating setting:', key, '=', value);
      
      // First try to update existing record
      const { data: updateData, error: updateError } = await supabase
        .from('app_settings_pharma_2024')
        .update({ 
          value: value, 
          updated_at: new Date().toISOString() 
        })
        .eq('key', key)
        .select()
        .single();

      if (updateError && updateError.code === 'PGRST116') {
        // Record doesn't exist, create it
        console.log('Record not found, creating new one...');
        const { data: insertData, error: insertError } = await supabase
          .from('app_settings_pharma_2024')
          .insert([{
            id: uuidv4(),
            key: key,
            value: value,
            category: 'general',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }])
          .select()
          .single();

        if (insertError) {
          console.error('Insert error:', insertError);
          throw insertError;
        }
        
        return toCamelCase(insertData);
      } else if (updateError) {
        console.error('Update error:', updateError);
        throw updateError;
      }

      return toCamelCase(updateData);
    } catch (error) {
      console.error('Error in updateSetting:', error);
      throw error;
    }
  },

  // Update multiple settings at once
  async updateMultiple(settings) {
    try {
      console.log('Updating multiple settings:', settings);
      
      const results = [];
      
      // Process each setting individually to handle upserts properly
      for (const setting of settings) {
        try {
          const result = await this.updateSetting(setting.key, setting.value);
          results.push(result);
        } catch (error) {
          console.error(`Error updating setting ${setting.key}:`, error);
          // Continue with other settings even if one fails
        }
      }
      
      return results;
    } catch (error) {
      console.error('Error in updateMultiple:', error);
      throw error;
    }
  },

  // Create new setting
  async create(setting) {
    try {
      const settingData = {
        ...toSnakeCase(setting),
        id: uuidv4(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('app_settings_pharma_2024')
        .insert(settingData)
        .select()
        .single();

      if (error) {
        console.error('Create error:', error);
        throw error;
      }
      
      return toCamelCase(data);
    } catch (error) {
      console.error('Error in create:', error);
      throw error;
    }
  },

  // Get settings as key-value object
  async getAsObject() {
    try {
      const settings = await this.getAll();
      return settings.reduce((acc, setting) => {
        acc[setting.key] = setting.value;
        return acc;
      }, {});
    } catch (error) {
      console.error('Error in getAsObject:', error);
      // Return default values if there's an error
      return {
        app_name: 'PharmaCRM',
        app_tagline: 'Clean Room Management System',
        app_logo_url: '',
        primary_color: '#3b82f6',
        secondary_color: '#1e40af',
        company_name: 'Pharmacy Solutions',
        welcome_message: 'Welcome to your pharmacy management dashboard!'
      };
    }
  }
};