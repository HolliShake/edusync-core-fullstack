import TitledPage from '@/components/pages/titled.page';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock, MapPin, Users } from 'lucide-react';
import type React from 'react';

export default function ProgramChairAdmissionSchedule(): React.ReactNode {
  return (
    <TitledPage
      title="Admission Schedule"
      description="View and manage admission schedules and events"
    >
      <div className="space-y-6">
        {/* Schedule Overview Card */}
        <Card className="border-2 shadow-lg">
          <CardHeader className="bg-muted/50">
            <CardTitle className="flex items-center gap-3">
              <Calendar className="h-6 w-6 text-primary" />
              <span>Upcoming Events</span>
            </CardTitle>
            <CardDescription>Track important admission dates and schedules</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {/* Sample Schedule Item */}
              <div className="flex items-start gap-4 p-4 rounded-lg border-2 hover:bg-muted/50 transition-colors">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1 space-y-2">
                  <h3 className="font-semibold text-lg">Entrance Examination</h3>
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-4 w-4" />
                      <span>9:00 AM - 12:00 PM</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-4 w-4" />
                      <span>Main Campus</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Users className="h-4 w-4" />
                      <span>150 Applicants</span>
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  View Details
                </Button>
              </div>

              {/* Empty State */}
              <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed rounded-lg">
                <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                  <Calendar className="h-8 w-8 text-primary" />
                </div>
                <p className="text-lg font-semibold mb-2">No upcoming schedules</p>
                <p className="text-sm text-muted-foreground mb-4">
                  Schedule events will appear here
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </TitledPage>
  );
}
