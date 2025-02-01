import { ScrollArea } from "@/components/ui/scroll-area"

interface ActivityLogProps {
  activities: Array<{ action: string; timestamp: Date }>
}

export function ActivityLog({ activities }: ActivityLogProps) {
  return (
    <ScrollArea className="h-[200px] w-full border rounded-md p-4">
      <h3 className="font-semibold mb-2">Activity Log</h3>
      {activities.map((activity, index) => (
        <div key={index} className="mb-2">
          <span className="text-sm text-muted-foreground">{activity.timestamp.toLocaleTimeString()}:</span>
          <span className="ml-2">{activity.action}</span>
        </div>
      ))}
    </ScrollArea>
  )
}

