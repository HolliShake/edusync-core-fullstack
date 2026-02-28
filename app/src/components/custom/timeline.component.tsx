import React from 'react';

export interface TimelineLog {
  key: string;
  dateTime: string;
  label: string;
  description?: string;
  user?: string;
  color?: string;
  background?: string;
}

interface TimelineProps {
  logs: TimelineLog[];
}

export const Timeline: React.FC<TimelineProps> = ({ logs }) => {
  return (
    <div className="relative">
      {/* Continuous vertical line */}
      <div className="absolute left-[9px] top-2 bottom-2 w-[2px] bg-border" />
      <div className="space-y-6">
        {logs.map((log) => (
          <div key={log.key} className="relative pl-8 group">
            {/* Timeline dot with dynamic color and background */}
            <div
              className={`absolute left-0 top-1.5 w-5 h-5 rounded-full border-4 border-background z-10 shadow-sm ${log.background || 'bg-muted'}`}
              style={{
                borderColor: log.color || 'hsl(var(--muted))',
                backgroundColor: log.background || 'hsl(var(--muted))',
              }}
            />
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span
                  className={`text-sm font-semibold capitalize ${log.color || 'text-foreground'}`}
                >
                  {log.label}
                </span>
                <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                  {new Date(log.dateTime ?? '').toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
              <span className="text-xs text-muted-foreground">
                {new Date(log.dateTime ?? '').toLocaleDateString(undefined, {
                  weekday: 'short',
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
                {log.user ? ` • by ${log.user}` : ''}
              </span>
              {log.description && (
                <p className="text-xs text-muted-foreground mt-1 bg-muted/30 p-2 rounded border border-border/50">
                  {log.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
