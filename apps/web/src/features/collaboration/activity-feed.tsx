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
    <div className="space-y-4" role="feed" aria-label="Recent activity">
      <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
        <Clock size={12} aria-hidden="true" />
        Recent Activity
      </div>
      <div className="space-y-3" role="list">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start gap-3 text-sm" role="listitem">
            <div className="w-1.5 h-1.5 mt-1.5 rounded-full bg-primary" aria-hidden="true" />
            <div>
              <p className="text-foreground">
                <span className="font-medium">{activity.user}</span>{" "}
                <span className="text-muted-foreground">{activity.action}</span>{" "}
                <span className="font-medium">{activity.target}</span>
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {activity.timestamp}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
