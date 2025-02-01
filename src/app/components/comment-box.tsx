import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Comment {
  id: number
  text: string
  timestamp: Date
}

export function CommentBox() {
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState("")

  const addComment = () => {
    if (newComment.trim()) {
      setComments([...comments, { id: Date.now(), text: newComment, timestamp: new Date() }])
      setNewComment("")
    }
  }

  return (
    <div className="h-full flex flex-col p-4">
      <ScrollArea className="flex-grow mb-4">
        {comments.map((comment) => (
          <div key={comment.id} className="mb-2">
            <p className="text-sm">{comment.text}</p>
            <span className="text-xs text-muted-foreground">{comment.timestamp.toLocaleTimeString()}</span>
          </div>
        ))}
      </ScrollArea>
      <div className="flex space-x-2">
        <Input
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Type your comment..."
          onKeyPress={(e) => e.key === "Enter" && addComment()}
        />
        <Button onClick={addComment}>Send</Button>
      </div>
    </div>
  )
}

