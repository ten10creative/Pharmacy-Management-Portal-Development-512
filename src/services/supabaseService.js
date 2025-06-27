import supabase from '../lib/supabase'
import { v4 as uuidv4 } from 'uuid'

// Helper function to convert snake_case to camelCase
const toCamelCase = (obj) => {
  if (Array.isArray(obj)) {
    return obj.map(toCamelCase)
  } else if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj).reduce((result, key) => {
      const camelKey = key.replace(/_([a-z])/g, (g) => g[1].toUpperCase())
      result[camelKey] = toCamelCase(obj[key])
      return result
    }, {})
  }
  return obj
}

// Helper function to convert camelCase to snake_case
const toSnakeCase = (obj) => {
  if (Array.isArray(obj)) {
    return obj.map(toSnakeCase)
  } else if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj).reduce((result, key) => {
      const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`)
      result[snakeKey] = toSnakeCase(obj[key])
      return result
    }, {})
  }
  return obj
}

// CLIENT OPERATIONS
export const clientService = {
  async getAll() {
    const { data, error } = await supabase
      .from('clients_pharma_2024')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return toCamelCase(data)
  },

  async create(client) {
    const clientData = {
      ...toSnakeCase(client),
      id: uuidv4(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    
    const { data, error } = await supabase
      .from('clients_pharma_2024')
      .insert(clientData)
      .select()
      .single()
    
    if (error) throw error
    return toCamelCase(data)
  },

  async update(id, updates) {
    const updateData = {
      ...toSnakeCase(updates),
      updated_at: new Date().toISOString()
    }
    
    const { data, error } = await supabase
      .from('clients_pharma_2024')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return toCamelCase(data)
  },

  async delete(id) {
    const { error } = await supabase
      .from('clients_pharma_2024')
      .delete()
      .eq('id', id)
    
    if (error) throw error
    return true
  }
}

// PHARMACY OPERATIONS
export const pharmacyService = {
  async getAll() {
    const { data, error } = await supabase
      .from('pharmacies_pharma_2024')
      .select(`
        *,
        client:clients_pharma_2024(*)
      `)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return toCamelCase(data)
  },

  async getById(id) {
    const { data, error } = await supabase
      .from('pharmacies_pharma_2024')
      .select(`
        *,
        client:clients_pharma_2024(*)
      `)
      .eq('id', id)
      .single()
    
    if (error) throw error
    return toCamelCase(data)
  },

  async create(pharmacy) {
    const pharmacyData = {
      ...toSnakeCase(pharmacy),
      id: uuidv4(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    
    const { data, error } = await supabase
      .from('pharmacies_pharma_2024')
      .insert(pharmacyData)
      .select()
      .single()
    
    if (error) throw error
    return toCamelCase(data)
  },

  async update(id, updates) {
    const updateData = {
      ...toSnakeCase(updates),
      updated_at: new Date().toISOString()
    }
    
    const { data, error } = await supabase
      .from('pharmacies_pharma_2024')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return toCamelCase(data)
  },

  async delete(id) {
    const { error } = await supabase
      .from('pharmacies_pharma_2024')
      .delete()
      .eq('id', id)
    
    if (error) throw error
    return true
  }
}

// TASK OPERATIONS
export const taskService = {
  async getAll() {
    const { data, error } = await supabase
      .from('tasks_pharma_2024')
      .select(`
        *,
        pharmacy:pharmacies_pharma_2024(*)
      `)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return toCamelCase(data)
  },

  async create(task) {
    // Get the current max order for the status column
    const { data: maxOrderData } = await supabase
      .from('tasks_pharma_2024')
      .select('order_index')
      .eq('status', task.status)
      .order('order_index', { ascending: false })
      .limit(1)
    
    const maxOrder = maxOrderData?.[0]?.order_index ?? -1
    
    const taskData = {
      ...toSnakeCase(task),
      id: uuidv4(),
      order_index: maxOrder + 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    
    const { data, error } = await supabase
      .from('tasks_pharma_2024')
      .insert(taskData)
      .select()
      .single()
    
    if (error) throw error
    return toCamelCase(data)
  },

  async update(id, updates) {
    const updateData = {
      ...toSnakeCase(updates),
      updated_at: new Date().toISOString()
    }
    
    const { data, error } = await supabase
      .from('tasks_pharma_2024')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return toCamelCase(data)
  },

  async delete(id) {
    const { error } = await supabase
      .from('tasks_pharma_2024')
      .delete()
      .eq('id', id)
    
    if (error) throw error
    return true
  }
}

// COMMENT OPERATIONS
export const commentService = {
  async getByPharmacyId(pharmacyId) {
    const { data, error } = await supabase
      .from('comments_pharma_2024')
      .select('*')
      .eq('pharmacy_id', pharmacyId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return toCamelCase(data)
  },

  async create(comment) {
    const commentData = {
      ...toSnakeCase(comment),
      id: uuidv4(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    
    const { data, error } = await supabase
      .from('comments_pharma_2024')
      .insert(commentData)
      .select()
      .single()
    
    if (error) throw error
    return toCamelCase(data)
  }
}

// TASK COMMENT OPERATIONS
export const taskCommentService = {
  async getByTaskId(taskId) {
    const { data, error } = await supabase
      .from('task_comments_pharma_2024')
      .select('*')
      .eq('task_id', taskId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return toCamelCase(data)
  },

  async getAll() {
    const { data, error } = await supabase
      .from('task_comments_pharma_2024')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return toCamelCase(data)
  },

  async create(comment) {
    const commentData = {
      ...toSnakeCase(comment),
      id: uuidv4(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    
    const { data, error } = await supabase
      .from('task_comments_pharma_2024')
      .insert(commentData)
      .select()
      .single()
    
    if (error) throw error
    return toCamelCase(data)
  }
}

// FILE OPERATIONS
export const fileService = {
  async getByPharmacyId(pharmacyId) {
    const { data, error } = await supabase
      .from('files_pharma_2024')
      .select('*')
      .eq('pharmacy_id', pharmacyId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return toCamelCase(data)
  },

  async create(file) {
    const fileData = {
      ...toSnakeCase(file),
      id: uuidv4(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    
    const { data, error } = await supabase
      .from('files_pharma_2024')
      .insert(fileData)
      .select()
      .single()
    
    if (error) throw error
    return toCamelCase(data)
  }
}

// NOTIFICATION OPERATIONS
export const notificationService = {
  async getByUserId(userId) {
    const { data, error } = await supabase
      .from('notifications_pharma_2024')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return toCamelCase(data)
  },

  async create(notification) {
    const notificationData = {
      ...toSnakeCase(notification),
      id: uuidv4(),
      created_at: new Date().toISOString()
    }
    
    const { data, error } = await supabase
      .from('notifications_pharma_2024')
      .insert(notificationData)
      .select()
      .single()
    
    if (error) throw error
    return toCamelCase(data)
  },

  async markAsRead(id) {
    const { data, error } = await supabase
      .from('notifications_pharma_2024')
      .update({ read: true })
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return toCamelCase(data)
  },

  async markAllAsRead(userId) {
    const { data, error } = await supabase
      .from('notifications_pharma_2024')
      .update({ read: true })
      .eq('user_id', userId)
      .eq('read', false)
      .select()
    
    if (error) throw error
    return toCamelCase(data)
  },

  async delete(id) {
    const { error } = await supabase
      .from('notifications_pharma_2024')
      .delete()
      .eq('id', id)
    
    if (error) throw error
    return true
  },

  async deleteAllByUserId(userId) {
    const { error } = await supabase
      .from('notifications_pharma_2024')
      .delete()
      .eq('user_id', userId)
    
    if (error) throw error
    return true
  }
}

// DOCUMENT OPERATIONS
export const documentService = {
  async getAll() {
    const { data, error } = await supabase
      .from('documents_pharma_2024')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return toCamelCase(data)
  },

  async create(document) {
    const documentData = {
      ...toSnakeCase(document),
      id: uuidv4(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    
    const { data, error } = await supabase
      .from('documents_pharma_2024')
      .insert(documentData)
      .select()
      .single()
    
    if (error) throw error
    return toCamelCase(data)
  }
}