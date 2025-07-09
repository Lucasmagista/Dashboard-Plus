"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Image, FileText, Video } from "lucide-react"
import { cn } from "@/lib/utils"

interface FileItem {
  id: string
  name: string
  url: string
  type: "image" | "video" | "file"
}

interface FilesModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  files: FileItem[]
}

export function FilesModal({ open, onOpenChange, files }: FilesModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl w-full">
        <DialogHeader>
          <DialogTitle>Arquivos da Conversa</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="image" className="w-full mt-4">
          <TabsList className="grid grid-cols-3 w-full mb-4">
            <TabsTrigger value="image"><Image className="w-4 h-4 mr-1" />Imagens</TabsTrigger>
            <TabsTrigger value="video"><Video className="w-4 h-4 mr-1" />Vídeos</TabsTrigger>
            <TabsTrigger value="file"><FileText className="w-4 h-4 mr-1" />Arquivos</TabsTrigger>
          </TabsList>
          <TabsContent value="image">
            <div className="grid grid-cols-3 gap-3">
              {files.filter(f => f.type === "image").map(f => (
                <a key={f.id} href={f.url} target="_blank" rel="noopener noreferrer" className="block">
                  <img src={f.url} alt={f.name} className="rounded shadow w-full aspect-square object-cover" />
                  <div className="text-xs mt-1 truncate text-center">{f.name}</div>
                </a>
              ))}
              {files.filter(f => f.type === "image").length === 0 && <div className="col-span-3 text-center text-muted-foreground">Nenhuma imagem</div>}
            </div>
          </TabsContent>
          <TabsContent value="video">
            <div className="grid grid-cols-2 gap-3">
              {files.filter(f => f.type === "video").map(f => (
                <a key={f.id} href={f.url} target="_blank" rel="noopener noreferrer" className="block">
                  <video src={f.url} controls className="rounded shadow w-full aspect-video object-cover" />
                  <div className="text-xs mt-1 truncate text-center">{f.name}</div>
                </a>
              ))}
              {files.filter(f => f.type === "video").length === 0 && <div className="col-span-2 text-center text-muted-foreground">Nenhum vídeo</div>}
            </div>
          </TabsContent>
          <TabsContent value="file">
            <div className="space-y-2">
              {files.filter(f => f.type === "file").map(f => (
                <a key={f.id} href={f.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-2 rounded hover:bg-muted transition">
                  <FileText className="w-5 h-5 text-muted-foreground" />
                  <span className="truncate text-sm">{f.name}</span>
                </a>
              ))}
              {files.filter(f => f.type === "file").length === 0 && <div className="text-center text-muted-foreground">Nenhum arquivo</div>}
            </div>
          </TabsContent>
        </Tabs>
        <DialogClose asChild>
          <button className="absolute right-4 top-4 text-muted-foreground hover:text-foreground transition" aria-label="Fechar">×</button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  )
}
