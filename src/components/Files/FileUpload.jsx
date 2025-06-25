import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';

const { FiUpload, FiFile, FiDownload, FiTrash2, FiPaperclip } = FiIcons;

const FileUpload = ({ pharmacyId }) => {
  const { files, addFile } = useData();
  const { user } = useAuth();
  const [dragActive, setDragActive] = useState(false);

  const pharmacyFiles = files
    .filter(f => f.pharmacyId === pharmacyId)
    .sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (fileList) => {
    Array.from(fileList).forEach(file => {
      // In a real app, you'd upload to a server
      const fileData = {
        pharmacyId,
        name: file.name,
        size: file.size,
        type: file.type,
        url: URL.createObjectURL(file), // Temporary URL for demo
        uploadedBy: user.id,
        uploaderName: user.name
      };

      addFile(fileData);
      toast.success(`${file.name} uploaded successfully`);
    });
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive 
            ? 'border-primary-400 bg-primary-50 dark:bg-primary-900/20' 
            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <SafeIcon icon={FiUpload} className="mx-auto text-gray-400 dark:text-gray-500 text-4xl mb-4" />
        <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Drop files here or click to upload
        </p>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Support for PDF, DOC, DOCX, XLS, XLSX, and image files
        </p>
        <input
          type="file"
          multiple
          onChange={handleFileInput}
          className="hidden"
          id="file-upload"
          accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.gif"
        />
        <label
          htmlFor="file-upload"
          className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg transition-colors cursor-pointer inline-block"
        >
          Choose Files
        </label>
      </div>

      {/* Files List */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Uploaded Files ({pharmacyFiles.length})
        </h3>

        {pharmacyFiles.length === 0 ? (
          <div className="text-center py-8">
            <SafeIcon icon={FiFile} className="mx-auto text-gray-400 dark:text-gray-500 text-3xl mb-2" />
            <p className="text-gray-500 dark:text-gray-500">No files uploaded yet.</p>
          </div>
        ) : (
          pharmacyFiles.map((file, index) => (
            <motion.div
              key={file.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 flex items-center justify-between hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                  <SafeIcon icon={FiPaperclip} className="text-gray-600 dark:text-gray-400" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">{file.name}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {formatFileSize(file.size)} • Uploaded by {file.uploaderName} •{' '}
                    {formatDistanceToNow(new Date(file.uploadedAt), { addSuffix: true })}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <a
                  href={file.url}
                  download={file.name}
                  className="p-2 text-gray-400 dark:text-gray-500 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                  title="Download"
                >
                  <SafeIcon icon={FiDownload} />
                </a>
                <button
                  className="p-2 text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                  title="Delete"
                >
                  <SafeIcon icon={FiTrash2} />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default FileUpload;