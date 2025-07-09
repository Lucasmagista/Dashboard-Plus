"use client"

import { MoreVertical, Star, Trash2, Archive, User, Bell, VolumeX, Volume2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Menu, MenuButton, MenuList, MenuItem } from "@/components/ui/menu"

interface ConversationMenuProps {
  onStar?: () => void
  onArchive?: () => void
  onMute?: () => void
  onUnmute?: () => void
  onDelete?: () => void
  isMuted?: boolean
}

export function ConversationMenu({ onStar, onArchive, onMute, onUnmute, onDelete, isMuted }: ConversationMenuProps) {
  return (
    <Menu>
      <MenuButton as={Button} variant="ghost" size="sm" aria-label="Mais opções">
        <MoreVertical className="h-4 w-4" />
      </MenuButton>
      <MenuList align="end">
        <MenuItem onSelect={onStar}><Star className="w-4 h-4 mr-2" />Favoritar</MenuItem>
        <MenuItem onSelect={onArchive}><Archive className="w-4 h-4 mr-2" />Arquivar</MenuItem>
        {isMuted ? (
          <MenuItem onSelect={onUnmute}><Volume2 className="w-4 h-4 mr-2" />Desmutar</MenuItem>
        ) : (
          <MenuItem onSelect={onMute}><VolumeX className="w-4 h-4 mr-2" />Silenciar</MenuItem>
        )}
        <MenuItem onSelect={onDelete} className="text-red-600"><Trash2 className="w-4 h-4 mr-2" />Excluir conversa</MenuItem>
      </MenuList>
    </Menu>
  )
}
