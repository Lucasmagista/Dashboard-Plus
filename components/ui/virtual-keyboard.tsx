import React, { useState } from "react"
import { cn } from "@/lib/utils"

interface VirtualKeyboardProps {
  onInput: (value: string) => void
  onClose: () => void
  suggestions?: string[]
  visible: boolean
}

const KEYS = [
  ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
  ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
  ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
  ["z", "x", "c", "v", "b", "n", "m"],
]

export function VirtualKeyboard({ onInput, onClose, suggestions = [], visible }: VirtualKeyboardProps) {
  const [shift, setShift] = useState(false)

  if (!visible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t shadow-lg p-2 animate-in fade-in slide-in-from-bottom-8">
      <div className="flex flex-wrap gap-1 mb-2">
        {suggestions.map((s) => (
          <button
            key={s}
            className="px-2 py-1 rounded bg-muted text-xs hover:bg-primary/10"
            onClick={() => onInput(s)}
            type="button"
          >
            {s}
          </button>
        ))}
      </div>
      <div className="flex flex-col gap-1">
        {KEYS.map((row, i) => (
          <div key={i} className="flex gap-1 justify-center">
            {row.map((k) => (
              <button
                key={k}
                className="w-8 h-10 rounded bg-muted text-lg font-medium hover:bg-primary/10"
                onClick={() => onInput(shift ? k.toUpperCase() : k)}
                type="button"
              >
                {shift ? k.toUpperCase() : k}
              </button>
            ))}
            {i === 2 && (
              <button
                className="w-12 h-10 rounded bg-muted text-base font-medium hover:bg-primary/10"
                onClick={() => setShift((s) => !s)}
                type="button"
              >
                Shift
              </button>
            )}
          </div>
        ))}
        <div className="flex gap-1 justify-center mt-1">
          <button
            className="w-16 h-10 rounded bg-muted text-base font-medium hover:bg-primary/10"
            onClick={() => onInput(" ")}
            type="button"
          >
            Espaço
          </button>
          <button
            className="w-16 h-10 rounded bg-destructive text-base font-medium text-white hover:bg-destructive/80"
            onClick={onClose}
            type="button"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  )
}
