import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Loader2, Wand2 } from "lucide-react"
import axios from "axios"
import { useToast } from "@/hooks/use-toast"

interface AIAssistantProps {
  currentFile: {
    content: string
    language: string
  }
}

export function AIAssistant({ currentFile }: AIAssistantProps) {
  const [aiSuggestion, setAiSuggestion] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const getAiSuggestion = async () => {
    setIsLoading(true)
    try {
      const res = await axios.post("/api/ai", {
        prompt: currentFile.content,
        language: currentFile.language,
      })
      setAiSuggestion(res.data.suggestion)
      toast({
        title: "AI Suggestion Ready",
        description: "Check out the AI suggestion below!",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get AI suggestion. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-4 h-full flex flex-col">
      <Button onClick={getAiSuggestion} disabled={isLoading} className="mb-4">
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Getting AI Suggestion...
          </>
        ) : (
          <>
            <Wand2 className="mr-2 h-4 w-4" /> Get AI Suggestion
          </>
        )}
      </Button>
      <ScrollArea className="flex-grow">
        <pre className="p-4 whitespace-pre-wrap">{aiSuggestion || "AI suggestion will appear here..."}</pre>
      </ScrollArea>
    </div>
  )
}

