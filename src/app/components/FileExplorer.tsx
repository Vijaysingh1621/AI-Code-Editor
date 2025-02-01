import { FolderTree, Plus, FileIcon, FileTextIcon, FileJsonIcon } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface File {
  name: string
  language: string
  content: string
}

interface FileExplorerProps {
  files: File[]
  currentFile: File
  setCurrentFile: (file: File) => void
  isAddFileModalOpen: boolean
  setIsAddFileModalOpen: (isOpen: boolean) => void
  newFileName: string
  setNewFileName: (name: string) => void
  newFileLanguage: string
  setNewFileLanguage: (language: string) => void
  addNewFile: () => void
}

export function FileExplorer({
  files,
  currentFile,
  setCurrentFile,
  isAddFileModalOpen,
  setIsAddFileModalOpen,
  newFileName,
  setNewFileName,
  newFileLanguage,
  setNewFileLanguage,
  addNewFile,
}: FileExplorerProps) {
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

  return (
    <div className="h-full bg-background p-4 overflow-auto">
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
            onClick={() => setCurrentFile(file)}
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
                  {["javascript", "typescript", "python", "java"].map((lang) => (
                    <SelectItem key={lang} value={lang}>
                      {lang}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button onClick={addNewFile}>Add File</Button>
        </DialogContent>
      </Dialog>
    </div>
  )
}

