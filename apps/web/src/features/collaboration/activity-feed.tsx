"use client";

import { Clock } from "lucide-react";

interface Activity {
  id: string;
  user: string;
  action: string;
  target: string;
  timestamp: string;
}

interface ActivityFeedProps {
  activities: Activity[];
}

export const ActivityFeed = ({ activities }: ActivityFeedProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-xs font-medium text-[var(--muted-foreground)] uppercase tracking-wider">
        <Clock size={12} />
        Recent Activity
      </div>
      <div className="space-y-3">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start gap-3 text-sm">
            <div className="w-1.5 h-1.5 mt-1.5 rounded-full bg-[var(--primary)]" />
            <div>
              <p className="text-[var(--foreground)]">
                <span className="font-medium">{activity.user}</span>{" "}
                <span className="text-[var(--muted-foreground)]">{activity.action}</span>{" "}
                <span className="font-medium">{activity.target}</span>
              </p>
              <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
                {activity.timestamp}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
