import React, { useState } from 'react';
import { motion } from 'framer-motion';
import KanbanColumn from './KanbanColumn';
import KanbanCard from './KanbanCard';
import { useData } from '../../contexts/DataContext';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiArrowUpDown, FiZap } = FiIcons;

const KanbanBoard = ({ tasks, onEditTask, onDeleteTask, onStatusChange, onAddTask, onViewDetails }) => {
  const { pharmacies, updateTask } = useData();
  const [draggedTask, setDraggedTask] = useState(null);
  const [draggedOverColumn, setDraggedOverColumn] = useState(null);
  const [draggedOverIndex, setDraggedOverIndex] = useState(null);
  const [sortByPriority, setSortByPriority] = useState(false);

  const priorityOrder = { 'high': 3, 'medium': 2, 'low': 1 };

  const sortTasks = (tasks) => {
    if (sortByPriority) {
      // Priority sorting: High → Medium → Low, then by due date
      return [...tasks].sort((a, b) => {
        const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
        if (priorityDiff !== 0) return priorityDiff;
        // Secondary sort by due date if priority is same
        return new Date(a.dueDate) - new Date(b.dueDate);
      });
    } else {
      // Manual ordering: Sort by order field, then by creation date for ties
      return [...tasks].sort((a, b) => {
        // If both have order values, sort by order
        if (a.order !== undefined && b.order !== undefined) {
          if (a.order !== b.order) {
            return a.order - b.order;
          }
        }
        // If only one has order, prioritize it
        if (a.order !== undefined && b.order === undefined) return -1;
        if (a.order === undefined && b.order !== undefined) return 1;
        
        // Fallback to creation date for tasks without order
        return new Date(a.createdAt) - new Date(b.createdAt);
      });
    }
  };

  const columns = [
    {
      id: 'backlog',
      title: 'Backlog',
      color: 'bg-gray-500',
      tasks: sortTasks(tasks.filter(task => task.status === 'backlog'))
    },
    {
      id: 'up-next',
      title: 'Up Next',
      color: 'bg-blue-500',
      tasks: sortTasks(tasks.filter(task => task.status === 'up-next'))
    },
    {
      id: 'in-progress',
      title: 'In Progress',
      color: 'bg-yellow-500',
      tasks: sortTasks(tasks.filter(task => task.status === 'in-progress'))
    },
    {
      id: 'complete',
      title: 'Complete',
      color: 'bg-green-500',
      tasks: sortTasks(tasks.filter(task => task.status === 'complete'))
    }
  ];

  const handleDragStart = (task, e) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.target.outerHTML);
  };

  const handleDragEnd = () => {
    setDraggedTask(null);
    setDraggedOverColumn(null);
    setDraggedOverIndex(null);
  };

  const handleDragOver = (e, columnId, index = null) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDraggedOverColumn(columnId);
    setDraggedOverIndex(index);
  };

  const handleDragLeave = (e) => {
    // Only clear if we're leaving the column entirely
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setDraggedOverColumn(null);
      setDraggedOverIndex(null);
    }
  };

  const reorderTasks = (columnId, draggedTaskId, newIndex) => {
    const columnTasks = sortTasks(tasks.filter(task => task.status === columnId));
    const draggedTaskIndex = columnTasks.findIndex(task => task.id === draggedTaskId);
    
    if (draggedTaskIndex === -1 || draggedTaskIndex === newIndex) return;

    // Create a new array with the task moved to the new position
    const reorderedTasks = [...columnTasks];
    const [draggedTask] = reorderedTasks.splice(draggedTaskIndex, 1);
    reorderedTasks.splice(newIndex, 0, draggedTask);

    // Update the order for all tasks in this column
    reorderedTasks.forEach((task, index) => {
      updateTask(task.id, { 
        order: index,
        updatedAt: new Date().toISOString()
      });
    });
  };

  const handleDrop = (e, columnId, dropIndex = null) => {
    e.preventDefault();
    
    if (!draggedTask) return;

    const sourceColumnTasks = sortTasks(tasks.filter(task => task.status === draggedTask.status));
    const targetColumnTasks = sortTasks(tasks.filter(task => task.status === columnId));
    
    // If moving to a different column
    if (draggedTask.status !== columnId) {
      // Update status first
      onStatusChange(draggedTask.id, columnId);
      
      // If dropping at a specific position in the new column
      if (dropIndex !== null && !sortByPriority) {
        // Get the current tasks in the target column (after status change)
        const targetTasks = tasks.filter(task => task.status === columnId);
        
        // Update all tasks in target column to make room
        targetTasks.forEach((task, index) => {
          let newOrder = index;
          if (index >= dropIndex) {
            newOrder = index + 1;
          }
          updateTask(task.id, { 
            order: newOrder,
            updatedAt: new Date().toISOString()
          });
        });
        
        // Set the dragged task's order
        updateTask(draggedTask.id, { 
          status: columnId,
          order: dropIndex,
          updatedAt: new Date().toISOString()
        });
      } else {
        // Add to end of column
        updateTask(draggedTask.id, { 
          status: columnId,
          order: targetColumnTasks.length,
          updatedAt: new Date().toISOString()
        });
      }
    } else if (dropIndex !== null && !sortByPriority) {
      // Reordering within the same column
      reorderTasks(columnId, draggedTask.id, dropIndex);
    }

    setDraggedTask(null);
    setDraggedOverColumn(null);
    setDraggedOverIndex(null);
  };

  const getPharmacyName = (pharmacyId) => {
    const pharmacy = pharmacies.find(p => p.id === pharmacyId);
    return pharmacy?.name || 'Unknown Pharmacy';
  };

  const togglePrioritySort = () => {
    setSortByPriority(!sortByPriority);
  };

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center space-x-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Task Board</h3>
          {!sortByPriority && (
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
              <SafeIcon icon={FiArrowUpDown} className="text-primary-500" />
              <span>Drag to reorder tasks</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={togglePrioritySort}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              sortByPriority
                ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 shadow-sm'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
            title={sortByPriority ? 'Disable priority sorting' : 'Sort by priority (High → Low)'}
          >
            <SafeIcon icon={FiZap} className={`${sortByPriority ? 'text-primary-600 dark:text-primary-400' : ''}`} />
            <span>{sortByPriority ? 'Priority Sort' : 'Manual Order'}</span>
          </button>
        </div>
      </div>

      {/* Kanban Columns */}
      <div className="flex space-x-6 overflow-x-auto pb-4">
        {columns.map((column) => (
          <KanbanColumn
            key={column.id}
            column={column}
            onDrop={(e, dropIndex) => handleDrop(e, column.id, dropIndex)}
            onDragOver={(e, index) => handleDragOver(e, column.id, index)}
            onDragLeave={handleDragLeave}
            onAddTask={() => onAddTask(column.id)}
            isDraggedOver={draggedOverColumn === column.id}
            draggedOverIndex={draggedOverIndex}
            sortByPriority={sortByPriority}
          >
            <div className="space-y-3">
              {column.tasks.map((task, index) => (
                <KanbanCard
                  key={task.id}
                  task={task}
                  index={index}
                  pharmacyName={getPharmacyName(task.pharmacyId)}
                  onEdit={() => onEditTask(task)}
                  onDelete={() => onDeleteTask(task)}
                  onViewDetails={() => onViewDetails(task)}
                  onDragStart={(e) => handleDragStart(task, e)}
                  onDragEnd={handleDragEnd}
                  isDragging={draggedTask?.id === task.id}
                  isDraggedOver={draggedOverColumn === column.id && draggedOverIndex === index}
                  sortByPriority={sortByPriority}
                />
              ))}
            </div>
          </KanbanColumn>
        ))}
      </div>

      {sortByPriority && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <SafeIcon icon={FiZap} className="text-blue-600 dark:text-blue-400" />
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>Priority sorting enabled:</strong> Tasks are automatically ordered by priority (High → Medium → Low) and due date. 
              Drag and drop reordering is disabled in this mode.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default KanbanBoard;