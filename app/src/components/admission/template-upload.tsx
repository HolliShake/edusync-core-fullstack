import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUploadUniversityAdmissionScores } from '@rest/api';
import { AlertTriangle, CheckCircle, Upload } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';

interface TemplateUploadProps {
  title?: string;
  description?: string;
  onUploadSuccess?: (result: unknown) => void;
}

type UploadStatus = 'idle' | 'uploading' | 'success' | 'error';

export default function TemplateUpload({
  title = 'Upload Scores',
  description = 'Upload the completed XLSX with columns: Application ID, Applicant Name, Average Score',
  onUploadSuccess,
}: TemplateUploadProps): React.ReactElement {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<UploadStatus>('idle');
  const [message, setMessage] = useState<string>('');
  const { mutateAsync: uploadScores, isPending: isLoading } = useUploadUniversityAdmissionScores();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setStatus('idle');
      setMessage('');
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setStatus('error');
      setMessage('Please select a file');
      return;
    }

    setStatus('uploading');
    setMessage('Uploading file...');

    try {
      const result = await uploadScores({
        data: {
          file,
        },
      });

      toast.success('File uploaded successfully!');
      setStatus('success');
      setMessage('File uploaded successfully!');
      setFile(null);
      onUploadSuccess?.(result);

      // Reset form after 2 seconds
      setTimeout(() => {
        setStatus('idle');
        setMessage('');
      }, 2000);
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'Upload failed');
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5 text-green-600" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* File Input */}
          <div className="space-y-2">
            <Label htmlFor="file-upload">Select File</Label>
            <Input
              id="file-upload"
              type="file"
              accept=".xlsx"
              onChange={handleFileChange}
              disabled={isLoading}
              className="cursor-pointer"
            />
            <p className="text-xs text-muted-foreground">Supported format: XLSX (Max 10MB)</p>
          </div>

          {/* Selected File Info */}
          {file && (
            <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
              <p className="text-sm font-semibold text-blue-800 dark:text-blue-300">
                Selected File:
              </p>
              <p className="text-sm text-blue-700 dark:text-blue-400 mt-1">{file.name}</p>
              <p className="text-xs text-blue-600 dark:text-blue-500 mt-1">
                Size: {(file.size / 1024).toFixed(2)} KB
              </p>
            </div>
          )}

          {/* Status Message */}
          {message && (
            <div
              className={`rounded-lg p-3 flex items-start gap-2 ${
                status === 'success'
                  ? 'bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800'
                  : status === 'error'
                    ? 'bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800'
                    : 'bg-gray-50 dark:bg-gray-900/30 border border-gray-200 dark:border-gray-800'
              }`}
            >
              {status === 'success' && (
                <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 mt-0.5 shrink-0" />
              )}
              {status === 'error' && (
                <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400 mt-0.5 shrink-0" />
              )}
              <p
                className={`text-sm ${
                  status === 'success'
                    ? 'text-green-800 dark:text-green-300'
                    : status === 'error'
                      ? 'text-red-800 dark:text-red-300'
                      : 'text-gray-800 dark:text-gray-300'
                }`}
              >
                {message}
              </p>
            </div>
          )}

          {/* Upload Button */}
          <Button
            onClick={handleUpload}
            disabled={!file || isLoading}
            className="w-full"
            size="lg"
            variant={status === 'success' ? 'outline' : 'default'}
          >
            {isLoading
              ? 'Uploading...'
              : status === 'success'
                ? 'Uploaded Successfully'
                : 'Upload File'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
