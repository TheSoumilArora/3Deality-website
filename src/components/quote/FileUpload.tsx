'use client'
import React, { useRef } from 'react';
import { Upload, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/card';
import { Button } from '@/ui/button';
import { toast } from 'sonner';

interface FileUploadProps {
  file: File | null;
  onFileSelect: (file: File | null) => void;
}

export function FileUpload({ file, onFileSelect }: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = React.useState(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length > 0) {
      const file = droppedFiles[0];
      if (file.name.toLowerCase().endsWith('.stl')) {
        onFileSelect(file);
        toast.success('STL file uploaded successfully!');
      } else {
        toast.error('Please upload a .stl file');
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.name.toLowerCase().endsWith('.stl')) {
      onFileSelect(selectedFile);
      toast.success('STL file uploaded successfully!');
    } else {
      toast.error('Please upload a .stl file');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Upload className="mr-2 h-5 w-5" />
          Upload STL File
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
            isDragOver 
              ? 'border-primary bg-primary/5' 
              : 'border-gray-300 dark:border-gray-600 hover:border-primary/50'
          }`}
          onDrop={handleDrop}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
        >
          <div className="space-y-4">
            <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="font-semibold mb-2">
                {file ? file.name : 'Drop your STL file here'}
              </h3>
              <p className="text-sm text-muted-foreground">
                Or click to browse files
              </p>
            </div>
            <Button
              onClick={() => fileInputRef.current?.click()}
              variant="outline"
            >
              Browse Files
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".stl"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}