"use client"

import { useState, useRef, useEffect } from "react"
import dynamic from "next/dynamic"
import axios from "axios"
import { motion } from "framer-motion"
import {
  Loader2,
  Code2,
  Wand2,
  FolderTree,
  Play,
  Save,
  Trash2,
  Plus,
  FileIcon,
  FileTextIcon,
  FileJsonIcon,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  ArrowRight,
  Mic,
  Copy,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/hooks/use-toast"
import { ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { executeCode, testCode } from "../services/codeExecutionService"
import { useTheme } from "next-themes"
import { ThemeProvider } from "next-themes"
import { ActivityLog } from "./activity-log"
import { useUndo } from "@/hooks/use-undo"
import { CommentBox } from "./comment-box"
import ReactMarkdown from "react-markdown"
import { Resizable } from "re-resizable"
import { useClerk, UserButton } from "@clerk/nextjs"
import CodingLoader from "./coding-loader"

// Dynamically import Monaco Editor
const MonacoEditor = dynamic(() => import("@monaco-editor/react"), { ssr: false })

const themes = [
  { value: "vs-dark", label: "Dark" },
  { value: "light", label: "Light" },
  { value: "hc-black", label: "High Contrast" },
  { value: "monokai", label: "Monokai" },
  { value: "github", label: "GitHub" },
  { value: "solarized-dark", label: "Solarized Dark" },
  { value: "solarized-light", label: "Solarized Light" },
]

const languages = [
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "python", label: "Python" },
  { value: "java", label: "Java" },
]

const fontSizes = [
  { value: "12", label: "12px" },
  { value: "14", label: "14px" },
  { value: "16", label: "16px" },
  { value: "18", label: "18px" },
  { value: "20", label: "20px" },
  { value: "22", label: "22px" },
  { value: "24", label: "24px" },
]

interface File {
  name: string
  language: string
  content: string
}

export default function CodeEditor() {
  const [files, setFiles] = useState<File[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("codeEditorFiles")
      return saved
        ? JSON.parse(saved)
        : [
            { name: "main.js", language: "javascript", content: "console.log('Hello, world!');" },
            { name: "styles.css", language: "css", content: "body { font-family: sans-serif; }" },
          ]
    }
    return []
  })
  const [currentFile, setCurrentFile] = useState<File>(files[0] || { name: "", language: "javascript", content: "" })
  const [aiSuggestion, setAiSuggestion] = useState("")
  const [editorTheme, setEditorTheme] = useState("vs-dark")
  const [isLoading, setIsLoading] = useState(false)
  const [isRunning, setIsRunning] = useState(false)
  const [consoleOutput, setConsoleOutput] = useState("")
  const [testResults, setTestResults] = useState<string[]>([])
  const [isAddFileModalOpen, setIsAddFileModalOpen] = useState(false)
  const [newFileName, setNewFileName] = useState("")
  const [newFileLanguage, setNewFileLanguage] = useState("javascript")
  const [fontSize, setFontSize] = useState("16")
  const [accentColor, setAccentColor] = useState("#007acc")
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const editorRef = useRef<any>(null)
  const { toast } = useToast()
  const { theme, setTheme } = useTheme()
  const [activities, setActivities] = useState<Array<{ action: string; timestamp: Date }>>([])
  const { state, setState, undo, redo, canUndo, canRedo } = useUndo(currentFile.content)
  const [rightPanelWidth, setRightPanelWidth] = useState(400) // Increased from 300 to 400
  const [aiInput, setAiInput] = useState("")
  const [activeTab, setActiveTab] = useState("activity")
  const { user } = useClerk()

  useEffect(() => {
    localStorage.setItem("codeEditorFiles", JSON.stringify(files))
  }, [files])

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

  const getAiSuggestion = async (input = "", event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setIsLoading(true)
    setActiveTab("ai")
    try {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${process.env.NEXT_PUBLIC_GEMINI_KEY}`,
        {
          contents: [
            {
              role: "user",
              parts: [{ text: input || currentFile.content }],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 500,
          },
        },
      )

      const suggestion = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "No suggestion available."

      setAiSuggestion(suggestion)

      toast({
        title: "AI Suggestion Ready",
        description: "Check out the AI suggestion!",
      })
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Error fetching AI suggestion:", error.response?.data || error.message)
      } else {
        console.error("Error fetching AI suggestion:", error)
      }
      toast({
        title: "Error",
        description: axios.isAxiosError(error)
          ? error.response?.data?.error?.message || "Failed to get AI suggestion."
          : "Failed to get AI suggestion.",
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
      setState(value)
      setCurrentFile({ ...currentFile, content: value })
      setFiles(files.map((f) => (f.name === currentFile.name ? { ...f, content: value } : f)))
      setActivities((prev) => [{ action: "Edited " + currentFile.name, timestamp: new Date() }, ...prev])
    }
  }

  const addNewFile = () => {
    if (newFileName && newFileLanguage) {
      const newFile: File = {
        name: newFileName,
        language: newFileLanguage,
        content: "",
      }
      setFiles([...files, newFile])
      setCurrentFile(newFile)
      setIsAddFileModalOpen(false)
      setNewFileName("")
      setNewFileLanguage("javascript")
    }
  }

  const runCode = async () => {
    setIsRunning(true)
    setConsoleOutput("Running code...\n")
    try {
      const result = await executeCode(currentFile.language, currentFile.content)
      setConsoleOutput(
        (prev) => prev + ("Output :" + result.output || "") + (result.error ? `Error: ${result.error}` : ""),
      )
    } catch (error) {
      setConsoleOutput((prev) => prev + `Error: ${error}\n`)
    } finally {
      setIsRunning(false)
    }
  }

  const runTests = async () => {
    setTestResults([])
    setConsoleOutput("Running tests...\n")
    try {
      const mockTestCases = ["Test 1", "Test 2", "Test 3"]
      const results = await testCode(currentFile.language, currentFile.content, mockTestCases)
      setTestResults(results)
      setConsoleOutput((prev) => prev + `Test Results: ${results.join(", ")}\n`)
    } catch (error) {
      setConsoleOutput((prev) => prev + `Error running tests: ${error}\n`)
    }
  }

  const clearAllHistory = () => {
    localStorage.removeItem("codeEditorFiles")
    setFiles([{ name: "main.js", language: "javascript", content: "console.log('Hello, world!');" }])
    setCurrentFile({ name: "main.js", language: "javascript", content: "console.log('Hello, world!');" })
    toast({
      title: "History Cleared",
      description: "All saved files have been removed.",
    })
  }

  const getFileIcon = (language: string) => {
    switch (language) {
      case "javascript":
        return <FileIcon className="mr-2 h-4 w-4" />
      case "typescript":
        return <FileTextIcon className="mr-2 h-4 w-4" />
      case "python":
        return <FileIcon className="mr-2 h-4 w-4" />
      case "java":
        return <FileJsonIcon className="mr-2 h-4 w-4" />
      default:
        return <FileIcon className="mr-2 h-4 w-4" />
    }
  }

  const clearAndSaveAiSuggestion = () => {
    localStorage.setItem("lastAiSuggestion", aiSuggestion)
    setAiSuggestion("")
    toast({
      title: "AI Suggestion Saved",
      description: "The last AI suggestion has been saved and cleared.",
    })
  }

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      value={{
        light: "light",
        dark: "dark",
        system: "system",
      }}
    >
      <div
        className={`h-screen flex flex-col ${theme === "dark" ? "dark" : ""}`}
        style={{ "--accent-color": accentColor } as React.CSSProperties}
      >
        <div className="flex justify-between items-center p-4 bg-background">
          <h1 className="text-2xl font-bold flex items-center">
            <Code2 className="mr-2" />CodeCraft
          </h1>
          <div className="flex space-x-4">
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
            <Select value={editorTheme} onValueChange={setEditorTheme}>
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
            <Select value={fontSize} onValueChange={setFontSize}>
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Font Size" />
              </SelectTrigger>
              <SelectContent>
                {fontSizes.map((size) => (
                  <SelectItem key={size.value} value={size.value}>
                    {size.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button variant="outline" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
              {theme === "dark" ? "🌞" : "🌙"}
            </Button>
            <div className="flex space-x-2 items-center">
              <UserButton/>
            </div>
          </div>
        </div>
        <div className="flex-grow flex overflow-hidden">
          <ResizablePanelGroup direction="horizontal" className="flex-grow">
            <ResizablePanel
              defaultSize={20}
              minSize={isSidebarCollapsed ? 5 : 15}
              maxSize={isSidebarCollapsed ? 5 : 30}
            >
              <div className="h-full bg-background p-4 overflow-auto relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                >
                  {isSidebarCollapsed ? <ChevronRight /> : <ChevronLeft />}
                </Button>
                {!isSidebarCollapsed && (
                  <>
                    <h2 className="text-lg font-semibold mb-4 flex items-center">
                      <FolderTree className="mr-2" /> Files
                    </h2>
                    <ScrollArea className="h-[calc(100%-6rem)]">
                      {files.map((file) => (
                        <div
                          key={file.name}
                          className={`p-2 cursor-pointer rounded flex items-center ${
                            file.name === currentFile.name ? "bg-accent" : "hover:bg-accent/50"
                          }`}
                          onClick={() => {
                            setCurrentFile(file)
                            setState(file.content)
                          }}
                        >
                          {getFileIcon(file.language)}
                          {file.name}
                        </div>
                      ))}
                    </ScrollArea>
                    <Dialog open={isAddFileModalOpen} onOpenChange={setIsAddFileModalOpen}>
                      <DialogTrigger asChild>
                        <Button className="w-full mt-4">
                          <Plus className="mr-2 h-4 w-4" /> Add New File
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add New File</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                              Name
                            </Label>
                            <Input
                              id="name"
                              value={newFileName}
                              onChange={(e) => setNewFileName(e.target.value)}
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="language" className="text-right">
                              Language
                            </Label>
                            <Select value={newFileLanguage} onValueChange={setNewFileLanguage}>
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
                          </div>
                        </div>
                        <Button onClick={addNewFile}>Add File</Button>
                      </DialogContent>
                    </Dialog>
                  </>
                )}
              </div>
            </ResizablePanel>
            <ResizablePanel defaultSize={60}>
              <div className="flex flex-col h-full">
                <div className="flex-grow overflow-hidden">
                  <MonacoEditor
                    height="100%"
                    language={currentFile.language}
                    value={state}
                    onChange={handleEditorChange}
                    theme={editorTheme}
                    onMount={handleEditorDidMount}
                    options={{
                      minimap: { enabled: false },
                      fontSize: Number.parseInt(fontSize),
                      lineNumbers: "on",
                      roundedSelection: false,
                      scrollBeyondLastLine: false,
                      readOnly: false,
                      automaticLayout: true,
                    }}
                  />
                </div>
                <div className="h-1/3 bg-black text-green-400 p-4 font-mono overflow-auto">
                  <h3 className="text-lg font-semibold mb-2">Console Output</h3>
                  <ScrollArea className="h-[calc(100%-2rem)]">
                    <pre className="whitespace-pre-wrap">{consoleOutput || "Console output will appear here..."}</pre>
                  </ScrollArea>
                </div>
              </div>
            </ResizablePanel>
            <Resizable
              size={{ width: rightPanelWidth, height: "100%" }}
              onResizeStop={(e, direction, ref, d) => {
                setRightPanelWidth(rightPanelWidth + d.width)
              }}
              minWidth={200}
              maxWidth={600}
            >
              <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
                <TabsList className="justify-start">
                  <TabsTrigger value="activity">Activity Log</TabsTrigger>
                  <TabsTrigger value="ai">AI Suggestion</TabsTrigger>
                  <TabsTrigger value="comments">Comments</TabsTrigger>
                </TabsList>
                <TabsContent value="activity" className="flex-grow overflow-auto">
                  <ActivityLog activities={activities} onActivityClick={(activity) => console.log(activity)} />
                </TabsContent>
                <TabsContent value="ai" className="flex-grow overflow-auto p-4">
                  <ScrollArea className="h-full">
                    {isLoading ? (
                      <div className="flex items-center justify-center h-full">
                        <CodingLoader />
                      </div>
                    ) : (
                      <div className="bg-background p-6 rounded-lg shadow-lg">
                        <ReactMarkdown className="prose dark:prose-invert max-w-none mb-4">
                          {aiSuggestion || "AI suggestion will appear here..."}
                        </ReactMarkdown>
                        <div className="flex justify-between mt-4">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => navigator.clipboard.writeText(aiSuggestion)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button onClick={() => handleEditorChange(aiSuggestion)}>
                            <ArrowRight className="mr-2 h-4 w-4" /> Apply to Editor
                          </Button>
                          <Button onClick={clearAndSaveAiSuggestion}>
                            <Save className="mr-2 h-4 w-4" /> Save 
                          </Button>
                        </div>
                      </div>
                    )}
                    <div className="p-4 border-t">
                      <div className="flex items-center mb-2">
                        <Input
                          placeholder="Ask for help..."
                          value={aiInput}
                          onChange={(e) => setAiInput(e.target.value)}
                          className="flex-grow mr-2"
                        />
                        <Button size="icon">
                          <Mic />
                        </Button>
                      </div>
                      <div className="text-sm text-muted-foreground mb-2">
                        Sample prompts: "Optimize this code", "Explain this function", "Add comments"
                      </div>
                      <Button
                        onClick={(event) => getAiSuggestion(aiInput, event)}
                        disabled={isLoading}
                        className="w-full h-10 relative overflow-hidden"
                      >
                        {isLoading ? (
                          <div className="absolute inset-0 flex items-center justify-center bg-primary">
                            <CodingLoader />
                          </div>
                        ) : (
                          <>Generate</>
                        )}
                      </Button>
                    </div>
                  </ScrollArea>
                </TabsContent>
                <TabsContent value="comments" className="flex-grow overflow-hidden">
                  <CommentBox />
                </TabsContent>
              </Tabs>
            </Resizable>
          </ResizablePanelGroup>
        </div>
        <motion.div
          className="p-4 bg-background"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex space-x-2">
            <Button
              onClick={(event) => getAiSuggestion("", event)}
              disabled={isLoading}
              className="relative overflow-hidden h-10"
            >
              {isLoading ? (
                <div className="absolute inset-0 flex items-center justify-center bg-primary">
                  <CodingLoader />
                </div>
              ) : (
                <>
                  <Wand2 className="mr-2 h-4 w-4" /> Get AI Suggestion
                </>
              )}
            </Button>
            <Button onClick={runCode} disabled={isRunning}>
              {isRunning ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Running Code...
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" /> Run Code
                </>
              )}
            </Button>
            <Button onClick={runTests}>
              <Play className="mr-2 h-4 w-4" /> Run Tests
            </Button>
            <Button onClick={() => toast({ title: "Saved", description: "Your code has been saved." })}>
              <Save className="mr-2 h-4 w-4" /> Save
            </Button>
            <Button onClick={clearAllHistory} variant="destructive">
              <Trash2 className="mr-2 h-4 w-4" /> Clear All History
            </Button>
            <Button onClick={undo} disabled={!canUndo}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Undo
            </Button>
            <Button onClick={redo} disabled={!canRedo}>
              <ArrowRight className="mr-2 h-4 w-4" /> Redo
            </Button>
          </div>
        </motion.div>
        <Toaster />
      </div>
    </ThemeProvider>
  )
}

