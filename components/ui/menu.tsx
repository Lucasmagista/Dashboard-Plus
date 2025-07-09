"use client"

import * as React from "react"
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu"
import { cn } from "@/lib/utils"

const Menu = DropdownMenuPrimitive.Root
const MenuTrigger = DropdownMenuPrimitive.Trigger
const MenuButton = React.forwardRef<any, any>((props, ref) => (
  <MenuTrigger ref={ref} {...props} />
))
const MenuList = React.forwardRef<any, any>(({ align = "end", ...props }, ref) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content ref={ref} align={align} className={cn("z-50 min-w-[12rem] rounded-md border bg-popover p-1 text-popover-foreground shadow-md", props.className)} {...props} />
  </DropdownMenuPrimitive.Portal>
))
const MenuItem = React.forwardRef<any, any>(({ onSelect, ...props }, ref) => (
  <DropdownMenuPrimitive.Item ref={ref} onSelect={onSelect} className={cn("flex items-center gap-2 px-3 py-2 rounded cursor-pointer hover:bg-muted focus:bg-muted text-sm", props.className)} {...props} />
))

export { Menu, MenuButton, MenuList, MenuItem }
