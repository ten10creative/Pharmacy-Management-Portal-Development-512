import React from 'react';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import ProfileDropdown from './ProfileDropdown';
import NotificationDropdown from '../Notifications/NotificationDropdown';

const { FiMenu } = FiIcons;

const Header = ({ onMenuToggle, isMobile }) => {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors">
      <div className="flex items-center justify-between px-4 md:px-6 py-4">
        <div className="flex items-center space-x-4">
          {/* Mobile menu button */}
          {isMobile && (
            <button
              onClick={onMenuToggle}
              className="p-2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors md:hidden"
            >
              <SafeIcon icon={FiMenu} className="text-xl" />
            </button>
          )}

          <div className="flex-1">
            <h2 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white">
              Welcome back!
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base hidden sm:block">
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 md:space-x-4">
          <NotificationDropdown />
          <ProfileDropdown />
        </div>
      </div>
    </header>
  );
};

export default Header;