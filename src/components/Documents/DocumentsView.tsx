import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { File, Upload, Download } from 'lucide-react';
import { useTaskContext } from '../../contexts/TaskContext';
import { Task, Document } from '../../types';

const DocumentsView: React.FC = () => {
  const { tasks } = useTaskContext();
  const [uploadedFiles, setUploadedFiles] = useState<Document[]>([]);
  
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };
  
  // Get all documents from tasks
  const documents = useMemo(() => {
    return [...uploadedFiles, ...tasks.reduce((acc: Document[], task: Task) => {
      const taskDocs = task.documents || [];
      return [...acc, ...taskDocs];
    }, [])]
  }, [tasks, uploadedFiles]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="p-6"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Documents</h2>
        <label
          htmlFor="file-upload"
          className="flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors cursor-pointer"
        >
          <Upload className="w-4 h-4 mr-2" />
          Upload Document
          <input
            id="file-upload"
            type="file"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                const newDoc: Document = {
                  id: `local-${Date.now()}`,
                  name: file.name,
                  type: file.type, // Add the file type
                  url: URL.createObjectURL(file),
                  uploadedBy: 'You',
                  uploadedAt: new Date().toISOString()
                };
                setUploadedFiles(prev => [...prev, newDoc]);
              }
            }}
          />
        </label>
      </div>

      <div className="space-y-4">
        {documents.map((doc: Document) => (
          <motion.div
            key={doc.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-card p-4 rounded-lg shadow-sm hover:shadow-md transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-accent rounded-md">
                  <File className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">{doc.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    Uploaded by {doc.uploadedBy} on {formatDate(doc.uploadedAt)}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <a 
                  href={doc.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="p-2 hover:bg-accent rounded-md transition-colors"
                >
                  <Download className="w-4 h-4" />
                </a>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

const DocumentsViewExport = DocumentsView;
export default DocumentsViewExport;
