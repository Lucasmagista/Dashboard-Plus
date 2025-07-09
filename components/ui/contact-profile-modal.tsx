"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

interface ContactProfileModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  contact: {
    name: string
    avatar: string
    platform: string
    assignedTo?: string
    lastSeen: string
    priority: string
    category: string
    sentiment: string
    phone?: string
    email?: string
    company?: string
    notes?: string
  }
}

export function ContactProfileModal({ open, onOpenChange, contact }: ContactProfileModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md w-full">
        <DialogHeader>
          <DialogTitle>Perfil do Contato</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center gap-2 mb-4">
          <Avatar className="w-20 h-20">
            <AvatarImage src={contact.avatar} />
            <AvatarFallback>{contact.name.split(' ').map(n => n[0]).join('').slice(0, 2)}</AvatarFallback>
          </Avatar>
          <h2 className="font-semibold text-lg">{contact.name}</h2>
          <div className="flex gap-2">
            <Badge>{contact.platform}</Badge>
            <Badge>{contact.priority}</Badge>
            <Badge>{contact.category}</Badge>
            <Badge>{contact.sentiment}</Badge>
          </div>
        </div>
        <Separator className="mb-2" />
        <div className="space-y-2 text-sm">
          {contact.phone && <div><b>Telefone:</b> {contact.phone}</div>}
          {contact.email && <div><b>Email:</b> {contact.email}</div>}
          {contact.company && <div><b>Empresa:</b> {contact.company}</div>}
          {contact.assignedTo && <div><b>Atribuído:</b> {contact.assignedTo}</div>}
          <div><b>Última visualização:</b> {contact.lastSeen}</div>
          {contact.notes && <div><b>Notas:</b> {contact.notes}</div>}
        </div>
        <DialogClose asChild>
          <button className="absolute right-4 top-4 text-muted-foreground hover:text-foreground transition" aria-label="Fechar">×</button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  )
}
