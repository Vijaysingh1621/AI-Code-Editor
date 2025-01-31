"use client"

import { useState, useRef, useEffect } from "react"
import dynamic from "next/dynamic"
import axios from "axios"
import { motion } from "framer-motion"
import { Loader2, Code2, Wand2, FolderTree, Play, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/hooks/use-toast"
import { ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { ScrollArea } from "@/components/ui/scroll-area"

// Dynamically import Monaco Editor
const MonacoEditor = dynamic(() => import("@monaco-editor/react"), { ssr: false })

const themes = [
  { value: "vs-dark", label: "Dark" },
  { value: "light", label: "Light" },
  { value: "hc-black", label: "High Contrast" },
]

const languages = [
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "python", label: "Python" },
  { value: "java", label: "Java" },
]

interface File {
  name: string
  language: string
  content: string
}

export default function CodeEditor() {
  const [files, setFiles] = useState<File[]>([
    { name: "main.js", language: "javascript", content: "console.log('Hello, world!');" },
    { name: "styles.css", language: "css", content: "body { font-family: sans-serif; }" },
  ])
  const [currentFile, setCurrentFile] = useState<File>(files[0])
  const [aiSuggestion, setAiSuggestion] = useState("")
  const [theme, setTheme] = useState("vs-dark")
  const [isLoading, setIsLoading] = useState(false)
  const [consoleOutput, setConsoleOutput] = useState("")
  const editorRef = useRef<any>(null)
  const { toast } = useToast()

  useEffect(() => {
    // Custom scrollbar styles
    const style = document.createElement("style")
    style.textContent = `
      .monaco-editor .scrollbar .slider {
        background: rgba(100, 100, 100, 0.4) !important;
        border-radius: 10px !important;
      }
      .monaco-editor .scrollbar .slider:hover {
        background: rgba(100, 100, 100, 0.7) !important;
      }
    `
    document.head.appendChild(style)
    return () => {
      document.head.removeChild(style)
    }
  }, [])

  const getAiSuggestion = async () => {
    setIsLoading(true)
    try {
      const res = await axios.post("/api/ai", { prompt: currentFile.content })
      setAiSuggestion(res.data.suggestion)
      toast({
        title: "AI Suggestion Ready",
        description: "Check out the AI tab for the suggestion!",
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

  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor
  }

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      setCurrentFile({ ...currentFile, content: value })
    }
  }

  const addNewFile = () => {
    const newFileName = prompt("Enter the name of the new file:")
    if (newFileName) {
      const newFile: File = {
        name: newFileName,
        language: "javascript",
        content: "",
      }
      setFiles([...files, newFile])
      setCurrentFile(newFile)
    }
  }

  const runCode = () => {
    setConsoleOutput("")
    const originalLog = console.log
    console.log = (...args) => {
      setConsoleOutput((prev) => prev + args.join(" ") + "\n")
      originalLog(...args)
    }

    try {
      // eslint-disable-next-line no-eval
      eval(currentFile.content)
    } catch (error) {
      if (error instanceof Error) {
        setConsoleOutput(error.toString())
      }
    }

    console.log = originalLog
  }

  return (
    <ResizablePanelGroup direction="horizontal" className="h-screen">
      <ResizablePanel defaultSize={20} minSize={15}>
        <div className="h-full bg-muted p-4">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <FolderTree className="mr-2" /> Files
          </h2>
          <ScrollArea className="h-[calc(100%-6rem)]">
            {files.map((file) => (
              <div
                key={file.name}
                className={`p-2 cursor-pointer rounded ${
                  file.name === currentFile.name ? "bg-accent" : "hover:bg-accent/50"
                }`}
                onClick={() => setCurrentFile(file)}
              >
                {file.name}
              </div>
            ))}
          </ScrollArea>
          <Button onClick={addNewFile} className="w-full mt-4">
            Add New File
          </Button>
        </div>
      </ResizablePanel>
      <ResizablePanel defaultSize={80}>
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-center p-4 bg-background">
            <h1 className="text-2xl font-bold flex items-center">
              <Code2 className="mr-2" /> Advanced Code Editor
            </h1>
            <div className="flex space-x-2">
              <Select
                value={currentFile.language}
                onValueChange={(value) => setCurrentFile({ ...currentFile, language: value })}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select Language" />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang.value} value={lang.value}>
                      {lang.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={theme} onValueChange={setTheme}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select Theme" />
                </SelectTrigger>
                <SelectContent>
                  {themes.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Tabs defaultValue="editor" className="flex-grow flex flex-col">
            <TabsList>
              <TabsTrigger value="editor">Editor</TabsTrigger>
              <TabsTrigger value="ai">AI Suggestion</TabsTrigger>
              <TabsTrigger value="console">Console</TabsTrigger>
            </TabsList>
            <TabsContent value="editor" className="flex-grow">
              <MonacoEditor
                height="100%"
                language={currentFile.language}
                value={currentFile.content}
                onChange={handleEditorChange}
                theme={theme}
                onMount={handleEditorDidMount}
                options={{
                  minimap: { enabled: true },
                  fontSize: 16,
                  lineNumbers: "on",
                  roundedSelection: false,
                  scrollBeyondLastLine: false,
                  readOnly: false,
                  scrollbar: {
                    vertical: "visible",
                    horizontal: "visible",
                    verticalScrollbarSize: 17,
                    horizontalScrollbarSize: 17,
                    verticalHasArrows: false,
                    horizontalHasArrows: false,
                    arrowSize: 30,
                  },
                }}
              />
            </TabsContent>
            <TabsContent value="ai">
              <ScrollArea className="h-full">
                <pre className="p-4 whitespace-pre-wrap">{aiSuggestion || "AI suggestion will appear here..."}</pre>
              </ScrollArea>
            </TabsContent>
            <TabsContent value="console">
              <ScrollArea className="h-full">
                <pre className="p-4 font-mono bg-black text-green-400 whitespace-pre-wrap">
                  {consoleOutput || "Console output will appear here..."}
                </pre>
              </ScrollArea>
            </TabsContent>
          </Tabs>
          <motion.div
            className="p-4 bg-background"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex space-x-2">
              <Button onClick={getAiSuggestion} disabled={isLoading}>
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
              <Button onClick={runCode}>
                <Play className="mr-2 h-4 w-4" /> Run Code
              </Button>
              <Button onClick={() => toast({ title: "Saved", description: "Your code has been saved." })}>
                <Save className="mr-2 h-4 w-4" /> Save
              </Button>
            </div>
          </motion.div>
        </div>
      </ResizablePanel>
      <Toaster />
    </ResizablePanelGroup>
  )
}

