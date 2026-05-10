import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { UniversityAdmissionApplication } from '@rest/models';
import { format, formatDistanceToNow, isPast, parseISO } from 'date-fns';
import jsPDF from 'jspdf';
import {
  Building2,
  CalendarCheck,
  Clock,
  DoorOpen,
  Download,
  GraduationCap,
  MapPin,
  QrCode,
  Share2,
  Timer,
} from 'lucide-react';
import type React from 'react';
import { useCallback, useMemo } from 'react';

interface GuestAdmissionExamBannerStep3Props {
  selectedApplication: UniversityAdmissionApplication | null;
}

export default function GuestAdmissionExamBannerStep3({
  selectedApplication,
}: GuestAdmissionExamBannerStep3Props): React.ReactNode {
  const schedule = useMemo(
    () => selectedApplication?.university_admission_schedule,
    [selectedApplication]
  );

  const examDate = useMemo(() => {
    if (!schedule?.start_date) return null;
    return parseISO(schedule.start_date);
  }, [schedule]);

  const examEndDate = useMemo(() => {
    if (!schedule?.end_date) return null;
    return parseISO(schedule.end_date);
  }, [schedule]);

  const timeUntilExam = useMemo(() => {
    if (!examDate) return null;
    if (isPast(examDate)) return 'Exam day has passed';
    return formatDistanceToNow(examDate, { addSuffix: true });
  }, [examDate]);

  const handleDownloadQR = useCallback(async () => {
    if (!selectedApplication?.qr_code || !examDate) return;

    try {
      // Convert SVG to canvas image
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const img = new Image();
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        const imgData = canvas.toDataURL('image/png');

        // Create PDF
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4',
        });

        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const margin = 15;
        let yPosition = margin;

        // Title
        pdf.setFontSize(24);
        pdf.setTextColor(20, 20, 20);
        pdf.text('Admission Examination', margin, yPosition);
        yPosition += 10;

        // Subtitle
        pdf.setFontSize(12);
        pdf.setTextColor(100, 100, 100);
        pdf.text('QR Code & Instructions', margin, yPosition);
        yPosition += 12;

        // Separator line
        pdf.setDrawColor(200, 200, 200);
        pdf.line(margin, yPosition - 2, pageWidth - margin, yPosition - 2);
        yPosition += 8;

        // Application ID
        pdf.setFontSize(10);
        pdf.setTextColor(60, 60, 60);
        pdf.text(`Application ID: ${selectedApplication.temporary_id}`, margin, yPosition);
        yPosition += 8;

        // Candidate Name
        if (selectedApplication.user?.name) {
          pdf.text(`Candidate: ${selectedApplication.user.name}`, margin, yPosition);
          yPosition += 8;
        }

        // Exam Date
        pdf.text(`Date: ${format(examDate, 'MMMM d, yyyy (EEEE)')}`, margin, yPosition);
        yPosition += 12;

        // QR Code Section Header
        pdf.setFontSize(12);
        pdf.setTextColor(20, 20, 20);
        pdf.text('Your QR Code', margin, yPosition);
        yPosition += 8;

        // Add QR code image centered
        const qrSize = 60;
        const qrX = (pageWidth - qrSize) / 2;
        pdf.addImage(imgData, 'PNG', qrX, yPosition, qrSize, qrSize);
        yPosition += qrSize + 12;

        // Instructions Section
        pdf.setFontSize(11);
        pdf.setTextColor(20, 20, 20);
        pdf.text('Instructions:', margin, yPosition);
        yPosition += 7;

        // Instructions text with wrapping
        pdf.setFontSize(9);
        pdf.setTextColor(60, 60, 60);

        const instructions = [
          '• Present this QR code at the testing center for verification',
          '• Keep a copy of this document or screenshot on your phone',
          '• Arrive at least 30 minutes before your scheduled time',
          '• Bring a valid ID and this application confirmation',
        ];

        instructions.forEach((instruction) => {
          const wrapped = pdf.splitTextToSize(instruction, pageWidth - 2 * margin);
          pdf.text(wrapped, margin, yPosition);
          yPosition += 6;
        });

        yPosition += 8;

        // Footer
        pdf.setFontSize(8);
        pdf.setTextColor(150, 150, 150);
        pdf.text(
          `Generated on ${format(new Date(), 'MMMM d, yyyy h:mm a')}`,
          margin,
          pageHeight - 10
        );

        // Save PDF
        pdf.save(`admission-qr-${selectedApplication.temporary_id}.pdf`);
      };

      img.src = selectedApplication.qr_code;
    } catch (error) {
      console.error('Failed to generate PDF:', error);
    }
  }, [
    selectedApplication?.qr_code,
    selectedApplication?.temporary_id,
    selectedApplication?.user?.name,
    examDate,
  ]);

  const handleShareQR = useCallback(async () => {
    if (
      !selectedApplication?.qr_code ||
      typeof navigator === 'undefined' ||
      !('share' in navigator)
    )
      return;

    try {
      // Convert SVG to canvas image
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const img = new Image();
      img.onload = async () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        const imgData = canvas.toDataURL('image/png');

        // Create PDF
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4',
        });

        const pageWidth = pdf.internal.pageSize.getWidth();
        const margin = 15;
        let yPosition = margin;

        // Title
        pdf.setFontSize(24);
        pdf.setTextColor(20, 20, 20);
        pdf.text('Admission Examination', margin, yPosition);
        yPosition += 10;

        // Subtitle
        pdf.setFontSize(12);
        pdf.setTextColor(100, 100, 100);
        pdf.text('QR Code & Instructions', margin, yPosition);
        yPosition += 12;

        // Separator line
        pdf.setDrawColor(200, 200, 200);
        pdf.line(margin, yPosition - 2, pageWidth - margin, yPosition - 2);
        yPosition += 8;

        // Application ID
        pdf.setFontSize(10);
        pdf.setTextColor(60, 60, 60);
        pdf.text(`Application ID: ${selectedApplication.temporary_id}`, margin, yPosition);
        yPosition += 8;

        // Candidate Name
        if (selectedApplication.user?.name) {
          pdf.text(`Candidate: ${selectedApplication.user.name}`, margin, yPosition);
          yPosition += 8;
        }

        // Exam Date
        if (examDate) {
          pdf.text(`Date: ${format(examDate, 'MMMM d, yyyy (EEEE)')}`, margin, yPosition);
          yPosition += 12;
        }

        // QR Code Section Header
        pdf.setFontSize(12);
        pdf.setTextColor(20, 20, 20);
        pdf.text('Your QR Code', margin, yPosition);
        yPosition += 8;

        // Add QR code image centered
        const qrSize = 60;
        const qrX = (pageWidth - qrSize) / 2;
        pdf.addImage(imgData, 'PNG', qrX, yPosition, qrSize, qrSize);
        yPosition += qrSize + 12;

        // Instructions Section
        pdf.setFontSize(11);
        pdf.setTextColor(20, 20, 20);
        pdf.text('Instructions:', margin, yPosition);
        yPosition += 7;

        // Instructions text with wrapping
        pdf.setFontSize(9);
        pdf.setTextColor(60, 60, 60);

        const instructions = [
          '• Present this QR code at the testing center for verification',
          '• Keep a copy of this document or screenshot on your phone',
          '• Arrive at least 30 minutes before your scheduled time',
          '• Bring a valid ID and this application confirmation',
        ];

        instructions.forEach((instruction) => {
          const wrapped = pdf.splitTextToSize(instruction, pageWidth - 2 * margin);
          pdf.text(wrapped, margin, yPosition);
          yPosition += 6;
        });

        // Convert PDF to blob for sharing
        const pdfBlob = pdf.output('blob');
        const file = new File([pdfBlob], `admission-qr-${selectedApplication.temporary_id}.pdf`, {
          type: 'application/pdf',
        });

        navigator.share({
          title: 'My Admission QR Code',
          text: `My admission examination QR code for ${selectedApplication.temporary_id}`,
          files: [file],
        });
      };

      img.src = selectedApplication.qr_code;
    } catch (error) {
      console.error('Failed to share QR code:', error);
    }
  }, [
    selectedApplication?.qr_code,
    selectedApplication?.temporary_id,
    selectedApplication?.user?.name,
    examDate,
  ]);

  if (!selectedApplication) {
    return (
      <div className="flex items-center justify-center py-16 text-muted-foreground">
        No application selected
      </div>
    );
  }

  if (!schedule) {
    return (
      <div className="flex items-center justify-center py-16 text-muted-foreground">
        No schedule information available
      </div>
    );
  }

  const room = schedule.testing_center?.room;
  const building = room?.building;
  const campus = building?.campus;
  const admission = schedule.university_admission;
  const examPassed = examDate ? isPast(examDate) : false;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Examination Details</h2>
        <p className="text-muted-foreground mt-1">
          Your exam schedule has been confirmed. Review the details below.
        </p>
      </div>

      {/* Hero card */}
      <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent_60%)]" />
        <CardContent className="relative p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <p className="text-sm font-medium opacity-80 uppercase tracking-wider">
                {admission?.title ?? 'Admission Examination'}
              </p>
              <p className="text-3xl sm:text-4xl font-bold tracking-tight">
                {examDate ? format(examDate, 'MMMM d, yyyy') : 'Date TBD'}
              </p>
              <p className="text-lg opacity-90">{examDate ? format(examDate, 'EEEE') : ''}</p>
            </div>
            <div className="flex flex-col items-start sm:items-end gap-2">
              <Badge
                variant="secondary"
                className={`text-sm px-3 py-1 ${
                  examPassed ? 'bg-white/20 text-white border-white/30' : 'bg-white/90 text-primary'
                }`}
              >
                <Timer className="h-3.5 w-3.5 mr-1.5" />
                {timeUntilExam ?? 'Pending'}
              </Badge>
              {examDate && examEndDate && (
                <span className="text-sm opacity-80 font-medium">
                  {format(examDate, 'h:mm a')} &ndash; {format(examEndDate, 'h:mm a')}
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* QR Code Section */}
      {selectedApplication?.qr_code && (
        <Card className="overflow-hidden border-0 shadow-md">
          <CardContent className="p-6 sm:p-8">
            <div className="grid gap-8 sm:grid-cols-2 items-center">
              {/* QR Code Display */}
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-primary/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative bg-white p-4 rounded-xl shadow-md border border-primary/10">
                    <img
                      src={selectedApplication.qr_code}
                      alt="Admission QR Code"
                      className="w-48 h-48 sm:w-56 sm:h-56"
                    />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground text-center">
                  ID: {selectedApplication.temporary_id}
                </p>
              </div>

              {/* Information & Actions */}
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <QrCode className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-semibold">Your Admission QR Code</h3>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Save or download this QR code. You'll need to present it on your exam day for
                    quick verification at the testing center.
                  </p>
                </div>

                <Separator />

                <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-3 space-y-2">
                  <p className="text-xs font-semibold text-blue-900 dark:text-blue-200 uppercase tracking-wider">
                    What's in the code?
                  </p>
                  <ul className="text-xs text-blue-800 dark:text-blue-300 space-y-1">
                    <li>✓ Your Application ID</li>
                    <li>✓ Your Full Name</li>
                    <li>✓ Test Center Verification</li>
                  </ul>
                </div>

                <div className="flex flex-col gap-2 pt-2">
                  <Button onClick={handleDownloadQR} variant="default" className="w-full gap-2">
                    <Download className="h-4 w-4" />
                    Download QR Code
                  </Button>
                  {typeof navigator !== 'undefined' && 'share' in navigator && (
                    <Button onClick={handleShareQR} variant="outline" className="w-full gap-2">
                      <Share2 className="h-4 w-4" />
                      Share QR Code
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Detail cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Time */}
        <Card className="shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                <Clock className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Time Slot
                </p>
                <p className="text-sm font-semibold mt-0.5">
                  {examDate ? format(examDate, 'h:mm a') : 'TBD'}
                  {examEndDate ? ` – ${format(examEndDate, 'h:mm a')}` : ''}
                </p>
                {examDate && (
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {format(examDate, 'MMM d, yyyy')}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Location */}
        <Card className="shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                <MapPin className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Location
                </p>
                <p className="text-sm font-semibold mt-0.5 truncate">
                  {room?.name ?? 'Room TBD'}
                  {room?.room_code ? ` (${room.room_code})` : ''}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5 truncate">
                  {building?.name ?? ''}
                  {room?.floor ? `, Floor ${room.floor}` : ''}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Campus */}
        <Card className="shadow-sm sm:col-span-2 lg:col-span-1">
          <CardContent className="p-5">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400">
                <Building2 className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Campus
                </p>
                <p className="text-sm font-semibold mt-0.5 truncate">
                  {campus?.name ?? 'Campus TBD'}
                </p>
                {schedule.testing_center?.code && (
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Center: {schedule.testing_center.code}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reminders */}
      <Card className="shadow-sm border-amber-200 bg-amber-50/50 dark:border-amber-800 dark:bg-amber-900/10">
        <CardContent className="p-5 space-y-3">
          <div className="flex items-center gap-2">
            <CalendarCheck className="h-4.5 w-4.5 text-amber-600 dark:text-amber-400" />
            <h3 className="font-semibold text-sm text-amber-800 dark:text-amber-200">
              Exam Day Reminders
            </h3>
          </div>
          <Separator className="bg-amber-200 dark:bg-amber-800" />
          <ul className="grid gap-2 text-sm text-amber-700 dark:text-amber-300">
            <li className="flex items-start gap-2">
              <Clock className="h-4 w-4 shrink-0 mt-0.5" />
              Arrive at least 30 minutes before your scheduled time.
            </li>
            <li className="flex items-start gap-2">
              <DoorOpen className="h-4 w-4 shrink-0 mt-0.5" />
              Bring a valid ID and your application reference number.
            </li>
            <li className="flex items-start gap-2">
              <GraduationCap className="h-4 w-4 shrink-0 mt-0.5" />
              No electronic devices are allowed inside the testing room.
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
