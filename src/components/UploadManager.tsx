import React, { useState } from 'react';
import { Upload, FileText, Image, AlertCircle, CheckCircle, X } from 'lucide-react';

const UploadManager: React.FC = () => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFiles = (files: File[]) => {
    files.forEach(file => {
      if (file.type === 'application/pdf' || file.type.startsWith('image/')) {
        setUploadedFiles(prev => [...prev, file]);
        simulateUpload(file);
      }
    });
  };

  const simulateUpload = (file: File) => {
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        const currentProgress = prev[file.name] || 0;
        const newProgress = currentProgress + 10;
        
        if (newProgress >= 100) {
          clearInterval(interval);
          return { ...prev, [file.name]: 100 };
        }
        
        return { ...prev, [file.name]: newProgress };
      });
    }, 200);
  };

  const removeFile = (fileName: string) => {
    setUploadedFiles(prev => prev.filter(file => file.name !== fileName));
    setUploadProgress(prev => {
      const newProgress = { ...prev };
      delete newProgress[fileName];
      return newProgress;
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (file: File) => {
    if (file.type === 'application/pdf') {
      return <FileText className="h-8 w-8 text-red-500" />;
    } else if (file.type.startsWith('image/')) {
      return <Image className="h-8 w-8 text-blue-500" />;
    }
    return <FileText className="h-8 w-8 text-gray-500" />;
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Upload Manager</h1>
        <p className="text-gray-600">Upload invoices and documents for processing</p>
      </div>

      {/* Upload Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Files Uploaded</p>
              <p className="text-2xl font-bold text-gray-900">{uploadedFiles.length}</p>
            </div>
            <Upload className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Processing Queue</p>
              <p className="text-2xl font-bold text-gray-900">
                {uploadedFiles.filter(file => (uploadProgress[file.name] || 0) < 100).length}
              </p>
            </div>
            <AlertCircle className="h-8 w-8 text-yellow-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Processed</p>
              <p className="text-2xl font-bold text-gray-900">
                {uploadedFiles.filter(file => (uploadProgress[file.name] || 0) === 100).length}
              </p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Size</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatFileSize(uploadedFiles.reduce((sum, file) => sum + file.size, 0))}
              </p>
            </div>
            <FileText className="h-8 w-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Upload Area */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive 
              ? 'border-blue-400 bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Drop files here or click to browse
          </h3>
          <p className="text-gray-600 mb-4">
            Supports PDF and image files up to 10MB each
          </p>
          <input
            type="file"
            multiple
            accept=".pdf,image/*"
            onChange={(e) => handleFiles(Array.from(e.target.files || []))}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors cursor-pointer"
          >
            <Upload className="h-4 w-4 mr-2" />
            Select Files
          </label>
        </div>
      </div>

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Uploaded Files</h2>
          <div className="space-y-4">
            {uploadedFiles.map((file, index) => {
              const progress = uploadProgress[file.name] || 0;
              const isComplete = progress === 100;
              
              return (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    {getFileIcon(file)}
                    <div>
                      <p className="font-medium text-gray-900">{file.name}</p>
                      <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="w-32">
                      <div className="bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${
                            isComplete ? 'bg-green-500' : 'bg-blue-500'
                          }`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {isComplete ? 'Complete' : `${progress}%`}
                      </p>
                    </div>
                    
                    {isComplete && (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    )}
                    
                    <button
                      onClick={() => removeFile(file.name)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Processing Instructions */}
      <div className="bg-blue-50 rounded-xl p-6 mt-8">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">Processing Instructions</h3>
        <ul className="text-blue-800 space-y-1">
          <li>• PDF files will be processed using OCR for text extraction</li>
          <li>• Invoice data will be automatically parsed and validated</li>
          <li>• SKU mappings will be applied based on retailer information</li>
          <li>• Processing status will be updated in real-time</li>
          <li>• Errors will be flagged for manual review</li>
        </ul>
      </div>
    </div>
  );
};

export default UploadManager;