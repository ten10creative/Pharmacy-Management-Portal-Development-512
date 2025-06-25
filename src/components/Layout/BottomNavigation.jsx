import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiGrid, FiUsers, FiCheckSquare, FiFileText, FiHome } = FiIcons;

const BottomNavigation = () => {
  const location = useLocation();

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: FiGrid },
    { path: '/pharmacies', label: 'Pharmacies', icon: FiHome },
    { path: '/crm', label: 'CRM', icon: FiUsers },
    { path: '/tasks', label: 'Tasks', icon: FiCheckSquare },
    { path: '/documents', label: 'Documents', icon: FiFileText }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg z-50 md:hidden transition-colors">
      <div className="grid grid-cols-5 h-16">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center space-y-1 transition-colors duration-200 relative ${
                isActive
                  ? 'text-primary-600 dark:text-primary-400'
                  : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
              }`}
            >
              <SafeIcon icon={item.icon} className="text-lg" />
              <span className="text-xs font-medium truncate max-w-full px-1">
                {item.label}
              </span>
              {isActive && (
                <motion.div
                  layoutId="activeBottomTab"
                  className="absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-primary-600 dark:bg-primary-400 rounded-full"
                  initial={false}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavigation;