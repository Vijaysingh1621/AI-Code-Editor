import { ScrollArea } from "@/components/ui/scroll-area"
import { formatDistanceToNow } from "date-fns"

interface Activity {
  action: string
  timestamp: Date
  file?: string
  changes?: string
}

interface ActivityLogProps {
  activities: Activity[]
  onActivityClick: (activity: Activity) => void
}

export function ActivityLog({ activities, onActivityClick }: ActivityLogProps) {
  return (
    <ScrollArea className="h-full">
      <div className="space-y-4 p-4">
        {activities.map((activity, index) => (
          <div
            key={index}
            className="bg-background p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => onActivityClick(activity)}
          >
            <div className="font-medium">{activity.action}</div>
            {activity.file && <div className="text-sm text-muted-foreground">File: {activity.file}</div>}
            {activity.changes && (
              <div className="text-sm text-muted-foreground mt-1">
                Changes: {activity.changes.length > 50 ? `${activity.changes.substring(0, 50)}...` : activity.changes}
              </div>
            )}
            <div className="text-xs text-muted-foreground mt-1">
              {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}
