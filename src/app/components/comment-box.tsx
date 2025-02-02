import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent } from "@/components/ui/card"
import { Trash2 } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface Comment {
  id: number
  text: string
  timestamp: Date
}

export function CommentBox() {
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState("")

  useEffect(() => {
    const savedComments = localStorage.getItem("comments")
    if (savedComments) {
      setComments(
        JSON.parse(savedComments).map((comment: Comment) => ({
          ...comment,
          timestamp: new Date(comment.timestamp),
        })),
      )
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("comments", JSON.stringify(comments))
  }, [comments])

  const addComment = () => {
    if (newComment.trim()) {
      const newCommentObj = {
        id: Date.now(),
        text: newComment,
        timestamp: new Date(),
      }
      setComments([...comments, newCommentObj])
      setNewComment("")
    }
  }

  const deleteComment = (id: number) => {
    setComments(comments.filter((comment) => comment.id !== id))
  }

  return (
    <div className="h-full flex flex-col p-4 bg-background">
      <h2 className="text-2xl font-bold mb-4">Comments</h2>
      <ScrollArea className="flex-grow mb-4 pr-4">
        {comments.map((comment) => (
          <Card key={comment.id} className="mb-4">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm">{comment.text}</p>
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(comment.timestamp, { addSuffix: true })}
                  </span>
                </div>
                <Button variant="ghost" size="icon" onClick={() => deleteComment(comment.id)} className="ml-2">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </ScrollArea>
      <div className="flex space-x-2">
        <Input
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Type your comment..."
          onKeyPress={(e) => e.key === "Enter" && addComment()}
        />
        <Button onClick={addComment} disabled={!newComment.trim()}>
          Send
        </Button>
      </div>
    </div>
  )
}

