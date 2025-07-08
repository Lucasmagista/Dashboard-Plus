
"use client";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import * as React from "react";

interface FabAction {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}

interface FabProps {
  actions: FabAction[];
  mainIcon?: React.ReactNode;
  label?: string;
  position?: "bottom-right" | "bottom-left";
}

export function Fab({ actions, mainIcon, label, position = "bottom-right" }: FabProps) {
  const [open, setOpen] = React.useState(false);
  return (
    <div
      className={cn(
        "fixed z-50 flex flex-col items-end gap-2",
        position === "bottom-right" ? "right-6 bottom-6" : "left-6 bottom-6"
      )}
    >
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="flex flex-col items-end gap-2 mb-2"
        >
          {actions.map((action, i) => (
            <Button
              key={action.label}
              variant="default"
              size="icon"
              className="shadow-lg bg-primary text-white hover:bg-primary/90"
              aria-label={action.label}
              onClick={() => {
                setOpen(false);
                action.onClick();
              }}
            >
              {action.icon}
            </Button>
          ))}
        </motion.div>
      )}
      <Button
        variant="default"
        size="icon"
        className="rounded-full shadow-xl bg-primary text-white hover:bg-primary/90"
        aria-label={label || "Ações rápidas"}
        onClick={() => setOpen((v) => !v)}
      >
        {mainIcon || <Plus className="h-6 w-6" />}
      </Button>
    </div>
  );
}
