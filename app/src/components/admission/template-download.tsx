import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useDownloadUniversityAdmissionTemplate } from '@rest/api';
import { AlertCircle, Download, FileText } from 'lucide-react';
import React from 'react';
import { toast } from 'sonner';

interface TemplateDownloadProps {
  title?: string;
  description?: string;
  templateName?: string;
}

export default function TemplateDownload({
  title = 'Download Score Template',
  description = 'Download the admission scoring template to bulk upload student scores',
  templateName = 'university_admission_application_score_template.xlsx',
}: TemplateDownloadProps): React.ReactElement {
  const { refetch: refetchTemplate } = useDownloadUniversityAdmissionTemplate({
    query: {
      enabled: false,
      retry: false,
    },
  });

  const handleDownload = async () => {
    try {
      const { data: responseData } = await refetchTemplate();
      const payload: unknown = responseData;

      if (!payload) {
        throw new Error('Failed to download template');
      }

      const blob = payload instanceof Blob ? payload : new Blob([payload as BlobPart]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = templateName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download error:', error);
      toast.error(
        error instanceof Error
          ? error.message
          : 'Failed to download template. Please try again later.'
      );
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-blue-600" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Instructions */}
          <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-3 space-y-2">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
              <div className="text-sm text-blue-800 dark:text-blue-300">
                <p className="font-semibold mb-2">How to use:</p>
                <ol className="space-y-1 list-decimal list-inside">
                  <li>Download the template file below</li>
                  <li>Fill in student information and scores</li>
                  <li>Save the file with your changes</li>
                  <li>Upload it back using the upload form</li>
                </ol>
              </div>
            </div>
          </div>

          {/* Template Preview */}
          <div className="bg-gray-50 dark:bg-gray-900/30 border border-gray-200 dark:border-gray-800 rounded-lg p-3">
            <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wider">
              Template Columns
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div className="text-xs bg-white dark:bg-gray-800 p-2 rounded border border-gray-200 dark:border-gray-700">
                <span className="font-semibold">Application ID</span>
              </div>
              <div className="text-xs bg-white dark:bg-gray-800 p-2 rounded border border-gray-200 dark:border-gray-700">
                <span className="font-semibold">Applicant Name</span>
              </div>
              <div className="text-xs bg-white dark:bg-gray-800 p-2 rounded border border-gray-200 dark:border-gray-700">
                <span className="font-semibold">Average Score</span>
              </div>
            </div>
          </div>

          {/* Download Button */}
          <Button onClick={handleDownload} className="w-full gap-2" size="lg">
            <Download className="h-4 w-4" />
            Download Template
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
