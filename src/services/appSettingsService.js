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
    const { data, error } = await supabase
      .from('app_settings_pharma_2024')
      .select('*')
      .order('category', { ascending: true });

    if (error) throw error;
    return toCamelCase(data);
  },

  // Get setting by key
  async getByKey(key) {
    const { data, error } = await supabase
      .from('app_settings_pharma_2024')
      .select('*')
      .eq('key', key)
      .single();

    if (error) throw error;
    return toCamelCase(data);
  },

  // Get settings by category
  async getByCategory(category) {
    const { data, error } = await supabase
      .from('app_settings_pharma_2024')
      .select('*')
      .eq('category', category)
      .order('key', { ascending: true });

    if (error) throw error;
    return toCamelCase(data);
  },

  // Update setting value
  async updateSetting(key, value) {
    const { data, error } = await supabase
      .from('app_settings_pharma_2024')
      .update({ value: value, updated_at: new Date().toISOString() })
      .eq('key', key)
      .select()
      .single();

    if (error) throw error;
    return toCamelCase(data);
  },

  // Update multiple settings at once
  async updateMultiple(settings) {
    const updates = settings.map(setting => ({
      key: setting.key,
      value: setting.value,
      updated_at: new Date().toISOString()
    }));

    const { data, error } = await supabase
      .from('app_settings_pharma_2024')
      .upsert(updates, { onConflict: 'key' })
      .select();

    if (error) throw error;
    return toCamelCase(data);
  },

  // Create new setting
  async create(setting) {
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

    if (error) throw error;
    return toCamelCase(data);
  },

  // Get settings as key-value object
  async getAsObject() {
    const settings = await this.getAll();
    return settings.reduce((acc, setting) => {
      acc[setting.key] = setting.value;
      return acc;
    }, {});
  }
};