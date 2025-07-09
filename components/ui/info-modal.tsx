"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"

interface InfoModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  children: React.ReactNode
}

export function InfoModal({ open, onOpenChange, title, children }: InfoModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md w-full">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <Separator className="mb-2" />
        <div className="text-sm">
          {children}
        </div>
        <DialogClose asChild>
          <button className="absolute right-4 top-4 text-muted-foreground hover:text-foreground transition" aria-label="Fechar">×</button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  )
}
