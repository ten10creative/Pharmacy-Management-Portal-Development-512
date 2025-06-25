import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider = ({ children }) => {
  const [pharmacies, setPharmacies] = useState([]);
  const [clients, setClients] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [comments, setComments] = useState([]);
  const [files, setFiles] = useState([]);
  const [taskComments, setTaskComments] = useState([]);

  useEffect(() => {
    // Initialize with sample data
    const samplePharmacies = [
      {
        id: '1',
        name: 'Central Pharmacy',
        address: '123 Main St, City, State 12345',
        phone: '(555) 123-4567',
        email: 'central@pharmacy.com',
        status: 'active',
        clientId: '1',
        cleanRoomType: 'ISO 5',
        lastInspection: '2024-01-15',
        nextInspection: '2024-04-15',
        createdAt: '2024-01-01',
        avatar: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=100&h=100&fit=crop&crop=center'
      },
      {
        id: '2',
        name: 'North Side Pharmacy',
        address: '456 North Ave, City, State 12345',
        phone: '(555) 234-5678',
        email: 'northside@pharmacy.com',
        status: 'active',
        clientId: '2',
        cleanRoomType: 'ISO 7',
        lastInspection: '2024-01-20',
        nextInspection: '2024-04-20',
        createdAt: '2024-01-05',
        avatar: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=100&h=100&fit=crop&crop=center'
      }
    ];

    const sampleClients = [
      {
        id: '1',
        name: 'HealthCorp Inc.',
        contact: 'Mike Johnson',
        email: 'mike@healthcorp.com',
        phone: '(555) 111-2222',
        address: '789 Business Blvd, City, State 12345',
        createdAt: '2023-12-01',
        avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop&crop=face'
      },
      {
        id: '2',
        name: 'MedSupply Solutions',
        contact: 'Sarah Wilson',
        email: 'sarah@medsupply.com',
        phone: '(555) 333-4444',
        address: '321 Commerce St, City, State 12345',
        createdAt: '2023-12-15',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop&crop=face'
      }
    ];

    const sampleTasks = [
      {
        id: '1',
        title: 'Monthly Clean Room Inspection',
        description: 'Perform routine monthly inspection of clean room facilities',
        assignedTo: '2',
        pharmacyId: '1',
        status: 'up-next',
        priority: 'high',
        dueDate: '2024-02-15',
        createdAt: '2024-01-15',
        createdBy: '1',
        order: 0
      },
      {
        id: '2',
        title: 'Equipment Calibration',
        description: 'Calibrate all measurement equipment in clean room',
        assignedTo: '2',
        pharmacyId: '2',
        status: 'in-progress',
        priority: 'medium',
        dueDate: '2024-02-20',
        createdAt: '2024-01-20',
        createdBy: '1',
        order: 0
      },
      {
        id: '3',
        title: 'Documentation Review',
        description: 'Review and update all compliance documentation',
        assignedTo: '1',
        pharmacyId: '1',
        status: 'backlog',
        priority: 'low',
        dueDate: '2024-03-01',
        createdAt: '2024-01-25',
        createdBy: '1',
        order: 0
      },
      {
        id: '4',
        title: 'Staff Training Session',
        description: 'Conduct clean room procedures training for new staff',
        assignedTo: '1',
        pharmacyId: '2',
        status: 'complete',
        priority: 'medium',
        dueDate: '2024-01-30',
        createdAt: '2024-01-10',
        createdBy: '1',
        order: 0
      },
      {
        id: '5',
        title: 'Emergency Equipment Check',
        description: 'Urgent check of emergency safety equipment',
        assignedTo: '2',
        pharmacyId: '1',
        status: 'up-next',
        priority: 'high',
        dueDate: '2024-02-12',
        createdAt: '2024-02-01',
        createdBy: '1',
        order: 1
      },
      {
        id: '6',
        title: 'Routine Maintenance',
        description: 'Regular maintenance of HVAC systems',
        assignedTo: '1',
        pharmacyId: '2',
        status: 'backlog',
        priority: 'medium',
        dueDate: '2024-02-25',
        createdAt: '2024-01-28',
        createdBy: '1',
        order: 1
      }
    ];

    const sampleTaskComments = [
      {
        id: '1',
        taskId: '1',
        content: 'I\'ve scheduled this for next week. Will coordinate with the pharmacy team.',
        authorId: '2',
        authorName: 'Jane Smith',
        authorAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
        createdAt: '2024-01-16T10:30:00Z'
      },
      {
        id: '2',
        taskId: '1',
        content: 'Great! Please make sure to check the new HVAC system during the inspection.',
        authorId: '1',
        authorName: 'John Doe',
        authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
        createdAt: '2024-01-16T14:15:00Z'
      },
      {
        id: '3',
        taskId: '2',
        content: 'Equipment calibration is 50% complete. The particle counters are done.',
        authorId: '2',
        authorName: 'Jane Smith',
        authorAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
        createdAt: '2024-01-22T09:45:00Z'
      }
    ];

    setPharmacies(samplePharmacies);
    setClients(sampleClients);
    setTasks(sampleTasks);
    setTaskComments(sampleTaskComments);
  }, []);

  const addPharmacy = (pharmacy) => {
    const newPharmacy = {
      ...pharmacy,
      id: uuidv4(),
      createdAt: new Date().toISOString().split('T')[0]
    };
    setPharmacies(prev => [...prev, newPharmacy]);
    return newPharmacy;
  };

  const updatePharmacy = (id, updates) => {
    setPharmacies(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const deletePharmacy = (id) => {
    setPharmacies(prev => prev.filter(p => p.id !== id));
  };

  const addClient = (client) => {
    const newClient = {
      ...client,
      id: uuidv4(),
      createdAt: new Date().toISOString().split('T')[0]
    };
    setClients(prev => [...prev, newClient]);
    return newClient;
  };

  const updateClient = (id, updates) => {
    setClients(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const deleteClient = (id) => {
    setClients(prev => prev.filter(c => c.id !== id));
  };

  const addTask = (task) => {
    // Get the current tasks in the target status column
    const columnTasks = tasks.filter(t => t.status === task.status);
    const maxOrder = columnTasks.length > 0 ? Math.max(...columnTasks.map(t => t.order || 0)) : -1;

    const newTask = {
      ...task,
      id: uuidv4(),
      createdAt: new Date().toISOString().split('T')[0],
      order: maxOrder + 1 // Add to end of column
    };
    setTasks(prev => [...prev, newTask]);
    return newTask;
  };

  const updateTask = (id, updates) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const deleteTask = (id) => {
    // Get the task being deleted to know its status and order
    const taskToDelete = tasks.find(t => t.id === id);
    if (taskToDelete) {
      // Remove the task
      setTasks(prev => {
        const filtered = prev.filter(t => t.id !== id);
        // Reorder remaining tasks in the same column
        const columnTasks = filtered.filter(t => t.status === taskToDelete.status);
        const reorderedTasks = filtered.map(task => {
          if (task.status === taskToDelete.status && task.order > taskToDelete.order) {
            return { ...task, order: task.order - 1 };
          }
          return task;
        });
        return reorderedTasks;
      });

      // Also delete related comments
      setTaskComments(prev => prev.filter(c => c.taskId !== id));
    }
  };

  const addComment = (comment) => {
    const newComment = {
      ...comment,
      id: uuidv4(),
      createdAt: new Date().toISOString()
    };
    setComments(prev => [...prev, newComment]);
    return newComment;
  };

  const addTaskComment = (comment) => {
    const newComment = {
      ...comment,
      id: uuidv4(),
      createdAt: new Date().toISOString()
    };
    setTaskComments(prev => [...prev, newComment]);
    return newComment;
  };

  const addFile = (file) => {
    const newFile = {
      ...file,
      id: uuidv4(),
      uploadedAt: new Date().toISOString()
    };
    setFiles(prev => [...prev, newFile]);
    return newFile;
  };

  const value = {
    pharmacies,
    clients,
    tasks,
    comments,
    files,
    taskComments,
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
    addFile
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};