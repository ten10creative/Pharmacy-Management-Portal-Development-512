import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  clientService, 
  pharmacyService, 
  taskService, 
  commentService, 
  taskCommentService, 
  fileService, 
  documentService 
} from '../services/supabaseService';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider = ({ children }) => {
  const { user } = useAuth();
  const [pharmacies, setPharmacies] = useState([]);
  const [clients, setClients] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [comments, setComments] = useState([]);
  const [files, setFiles] = useState([]);
  const [taskComments, setTaskComments] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load all data when user is authenticated
  useEffect(() => {
    if (user) {
      loadAllData();
    }
  }, [user]);

  const loadAllData = async () => {
    try {
      setLoading(true);
      
      // Load all data in parallel
      const [
        clientsData,
        pharmaciesData,
        tasksData,
        commentsData,
        taskCommentsData,
        documentsData
      ] = await Promise.all([
        clientService.getAll(),
        pharmacyService.getAll(),
        taskService.getAll(),
        getAllComments(),
        taskCommentService.getAll(),
        documentService.getAll()
      ]);

      setClients(clientsData || []);
      setPharmacies(pharmaciesData || []);
      setTasks(tasksData || []);
      setComments(commentsData || []);
      setTaskComments(taskCommentsData || []);
      setDocuments(documentsData || []);
      
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  // Get all pharmacy comments
  const getAllComments = async () => {
    try {
      const pharmaciesData = await pharmacyService.getAll();
      let allComments = [];
      
      for (const pharmacy of pharmaciesData) {
        const pharmacyComments = await commentService.getByPharmacyId(pharmacy.id);
        allComments = [...allComments, ...pharmacyComments];
      }
      
      return allComments;
    } catch (error) {
      console.error('Error loading comments:', error);
      return [];
    }
  };

  // PHARMACY OPERATIONS
  const addPharmacy = async (pharmacy) => {
    try {
      const newPharmacy = await pharmacyService.create(pharmacy);
      setPharmacies(prev => [newPharmacy, ...prev]);
      return newPharmacy;
    } catch (error) {
      console.error('Error adding pharmacy:', error);
      toast.error('Failed to add pharmacy');
      throw error;
    }
  };

  const updatePharmacy = async (id, updates) => {
    try {
      const updatedPharmacy = await pharmacyService.update(id, updates);
      setPharmacies(prev => prev.map(p => p.id === id ? updatedPharmacy : p));
      return updatedPharmacy;
    } catch (error) {
      console.error('Error updating pharmacy:', error);
      toast.error('Failed to update pharmacy');
      throw error;
    }
  };

  const deletePharmacy = async (id) => {
    try {
      await pharmacyService.delete(id);
      setPharmacies(prev => prev.filter(p => p.id !== id));
      // Also remove related data
      setTasks(prev => prev.filter(t => t.pharmacyId !== id));
      setComments(prev => prev.filter(c => c.pharmacyId !== id));
      setFiles(prev => prev.filter(f => f.pharmacyId !== id));
    } catch (error) {
      console.error('Error deleting pharmacy:', error);
      toast.error('Failed to delete pharmacy');
      throw error;
    }
  };

  // CLIENT OPERATIONS
  const addClient = async (client) => {
    try {
      const newClient = await clientService.create(client);
      setClients(prev => [newClient, ...prev]);
      return newClient;
    } catch (error) {
      console.error('Error adding client:', error);
      toast.error('Failed to add client');
      throw error;
    }
  };

  const updateClient = async (id, updates) => {
    try {
      const updatedClient = await clientService.update(id, updates);
      setClients(prev => prev.map(c => c.id === id ? updatedClient : c));
      return updatedClient;
    } catch (error) {
      console.error('Error updating client:', error);
      toast.error('Failed to update client');
      throw error;
    }
  };

  const deleteClient = async (id) => {
    try {
      await clientService.delete(id);
      setClients(prev => prev.filter(c => c.id !== id));
      // Update pharmacies that reference this client
      setPharmacies(prev => prev.map(p => 
        p.clientId === id ? { ...p, clientId: null } : p
      ));
    } catch (error) {
      console.error('Error deleting client:', error);
      toast.error('Failed to delete client');
      throw error;
    }
  };

  // TASK OPERATIONS
  const addTask = async (task) => {
    try {
      const newTask = await taskService.create(task);
      setTasks(prev => [newTask, ...prev]);
      return newTask;
    } catch (error) {
      console.error('Error adding task:', error);
      toast.error('Failed to add task');
      throw error;
    }
  };

  const updateTask = async (id, updates) => {
    try {
      const updatedTask = await taskService.update(id, updates);
      setTasks(prev => prev.map(t => t.id === id ? updatedTask : t));
      return updatedTask;
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error('Failed to update task');
      throw error;
    }
  };

  const deleteTask = async (id) => {
    try {
      await taskService.delete(id);
      setTasks(prev => prev.filter(t => t.id !== id));
      // Also remove related task comments
      setTaskComments(prev => prev.filter(c => c.taskId !== id));
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('Failed to delete task');
      throw error;
    }
  };

  // COMMENT OPERATIONS
  const addComment = async (comment) => {
    try {
      const newComment = await commentService.create(comment);
      setComments(prev => [newComment, ...prev]);
      return newComment;
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Failed to add comment');
      throw error;
    }
  };

  const addTaskComment = async (comment) => {
    try {
      const newComment = await taskCommentService.create(comment);
      setTaskComments(prev => [newComment, ...prev]);
      return newComment;
    } catch (error) {
      console.error('Error adding task comment:', error);
      toast.error('Failed to add comment');
      throw error;
    }
  };

  // FILE OPERATIONS
  const addFile = async (file) => {
    try {
      const newFile = await fileService.create(file);
      setFiles(prev => [newFile, ...prev]);
      return newFile;
    } catch (error) {
      console.error('Error adding file:', error);
      toast.error('Failed to add file');
      throw error;
    }
  };

  const value = {
    // Data
    pharmacies,
    clients,
    tasks,
    comments,
    files,
    taskComments,
    documents,
    loading,
    
    // Methods
    addPharmacy,
    updatePharmacy,
    deletePharmacy,
    addClient,
    updateClient,
    deleteClient,
    addTask,
    updateTask,
    deleteTask,
    addComment,
    addTaskComment,
    addFile,
    loadAllData
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};