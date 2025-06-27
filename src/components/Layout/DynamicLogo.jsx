import React from 'react';
import { useAppSettings } from '../../contexts/AppSettingsContext';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiActivity } = FiIcons;

const DynamicLogo = ({ className = "w-10 h-10", textSize = "text-xl", showText = true, iconClassName = "text-white text-xl" }) => {
  const { getAppName, getAppTagline, getAppLogo, getPrimaryColor } = useAppSettings();

  const appName = getAppName();
  const appTagline = getAppTagline();
  const appLogo = getAppLogo();
  const primaryColor = getPrimaryColor();

  return (
    <div className="flex items-center space-x-3">
      {appLogo ? (
        <img
          src={appLogo}
          alt={`${appName} logo`}
          className={`${className} rounded-lg object-cover flex-shrink-0`}
        />
      ) : (
        <div 
          className={`${className} rounded-lg flex items-center justify-center flex-shrink-0`}
          style={{ backgroundColor: primaryColor }}
        >
          <SafeIcon icon={FiActivity} className={iconClassName} />
        </div>
      )}
      
      {showText && (
        <div className="min-w-0">
          <h1 className={`${textSize} font-bold text-gray-900 dark:text-white truncate`}>
            {appName}
          </h1>
          {appTagline && (
            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
              {appTagline}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default DynamicLogo;