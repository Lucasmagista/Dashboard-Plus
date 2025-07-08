"use client"

import React, { useState, useCallback, useEffect } from 'react'
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  GripVertical, 
  Settings, 
  Eye, 
  EyeOff, 
  Plus, 
  Save,
  Undo,
  Layout,
  Grid3X3,
  Maximize2,
  Minimize2
} from 'lucide-react'
import { useLocalStorage } from "@/hooks/use-local-storage"
import { DASHBOARD_WIDGETS, type DashboardWidget } from "@/lib/dashboard-widgets"

interface WidgetLayout {
  id: string
  x: number
  y: number
  width: number
  height: number
  visible: boolean
  minimized: boolean
}

interface DashboardLayout {
  id: string
  name: string
  widgets: WidgetLayout[]
  createdAt: string
  isActive: boolean
}

const DEFAULT_LAYOUT: DashboardLayout = {
  id: 'default',
  name: 'Layout Padrão',
  widgets: [
    { id: 'kpi-vendas', x: 0, y: 0, width: 2, height: 1, visible: true, minimized: false },
    { id: 'contatos-ativos', x: 2, y: 0, width: 2, height: 1, visible: true, minimized: false },
    { id: 'funil-vendas', x: 4, y: 0, width: 2, height: 1, visible: true, minimized: false },
    { id: 'interactive-charts', x: 0, y: 1, width: 4, height: 2, visible: true, minimized: false },
    { id: 'sales-funnel', x: 4, y: 1, width: 2, height: 2, visible: true, minimized: false },
  ],
  createdAt: new Date().toISOString(),
  isActive: true
}

export const CustomizableDashboard: React.FC = () => {
  const [layouts, setLayouts] = useLocalStorage<DashboardLayout[]>('dashboard-layouts', [DEFAULT_LAYOUT])
  const [activeLayout, setActiveLayout] = useState<DashboardLayout>(
    layouts.find(l => l.isActive) || DEFAULT_LAYOUT
  )
  const [availableWidgets, setAvailableWidgets] = useState(DASHBOARD_WIDGETS)
  const [isCustomizing, setIsCustomizing] = useState(false)
  const [showLayoutDialog, setShowLayoutDialog] = useState(false)

  // Salvar mudanças automaticamente
  useEffect(() => {
    const updatedLayouts = layouts.map(l => 
      l.id === activeLayout.id ? activeLayout : { ...l, isActive: false }
    )
    if (!updatedLayouts.find(l => l.id === activeLayout.id)) {
      updatedLayouts.push({ ...activeLayout, isActive: true })
    }
    setLayouts(updatedLayouts)
  }, [activeLayout, setLayouts])

  const handleDragEnd = useCallback((result: DropResult) => {
    if (!result.destination) return

    const widgets = Array.from(activeLayout.widgets)
    const [reorderedWidget] = widgets.splice(result.source.index, 1)
    widgets.splice(result.destination.index, 0, reorderedWidget)

    setActiveLayout(prev => ({
      ...prev,
      widgets: widgets.map((widget, index) => ({
        ...widget,
        y: Math.floor(index / 3) // Ajustar posição Y baseado na nova ordem
      }))
    }))
  }, [activeLayout])

  const toggleWidgetVisibility = useCallback((widgetId: string) => {
    setActiveLayout(prev => ({
      ...prev,
      widgets: prev.widgets.map(w => 
        w.id === widgetId ? { ...w, visible: !w.visible } : w
      )
    }))
  }, [])

  const toggleWidgetMinimized = useCallback((widgetId: string) => {
    setActiveLayout(prev => ({
      ...prev,
      widgets: prev.widgets.map(w => 
        w.id === widgetId ? { ...w, minimized: !w.minimized } : w
      )
    }))
  }, [])

  const addWidget = useCallback((widgetId: string) => {
    const existingWidget = activeLayout.widgets.find(w => w.id === widgetId)
    if (existingWidget) {
      // Se já existe, apenas torna visível
      toggleWidgetVisibility(widgetId)
      return
    }

    const newWidget: WidgetLayout = {
      id: widgetId,
      x: 0,
      y: Math.max(...activeLayout.widgets.map(w => w.y + w.height), 0),
      width: 2,
      height: 1,
      visible: true,
      minimized: false
    }

    setActiveLayout(prev => ({
      ...prev,
      widgets: [...prev.widgets, newWidget]
    }))
  }, [activeLayout.widgets, toggleWidgetVisibility])

  const createNewLayout = useCallback(() => {
    const newLayout: DashboardLayout = {
      id: `layout-${Date.now()}`,
      name: `Layout ${layouts.length + 1}`,
      widgets: [...DEFAULT_LAYOUT.widgets],
      createdAt: new Date().toISOString(),
      isActive: true
    }
    setActiveLayout(newLayout)
    setShowLayoutDialog(false)
  }, [layouts.length])

  const switchLayout = useCallback((layoutId: string) => {
    const layout = layouts.find(l => l.id === layoutId)
    if (layout) {
      setActiveLayout({ ...layout, isActive: true })
    }
  }, [layouts])

  const getVisibleWidgets = () => {
    return activeLayout.widgets
      .filter(w => w.visible)
      .sort((a, b) => a.y - b.y || a.x - b.x)
      .map(widgetLayout => {
        const widget = availableWidgets.find(w => w.id === widgetLayout.id)
        return widget ? { ...widget, layout: widgetLayout } : null
      })
      .filter(Boolean) as Array<DashboardWidget & { layout: WidgetLayout }>
  }

  return (
    <div className="space-y-6">
      {/* Header de controles */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold">Dashboard Customizável</h2>
          <Badge variant="outline">{activeLayout.name}</Badge>
        </div>
        
        <div className="flex items-center gap-2">
          <Dialog open={showLayoutDialog} onOpenChange={setShowLayoutDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Layout className="w-4 h-4 mr-2" />
                Layouts
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Gerenciar Layouts</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  {layouts.map(layout => (
                    <div 
                      key={layout.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        layout.id === activeLayout.id 
                          ? 'border-primary bg-primary/5' 
                          : 'border-border hover:bg-muted'
                      }`}
                      onClick={() => switchLayout(layout.id)}
                    >
                      <div className="font-medium">{layout.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {layout.widgets.filter(w => w.visible).length} widgets ativos
                      </div>
                    </div>
                  ))}
                </div>
                <Button onClick={createNewLayout} className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Criar Novo Layout
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Button 
            variant={isCustomizing ? "default" : "outline"} 
            size="sm"
            onClick={() => setIsCustomizing(!isCustomizing)}
          >
            <Settings className="w-4 h-4 mr-2" />
            {isCustomizing ? 'Finalizar' : 'Customizar'}
          </Button>
        </div>
      </div>

      {/* Painel de customização */}
      {isCustomizing && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Personalizar Dashboard</CardTitle>
            <CardDescription>
              Arraste os widgets para reordenar ou use os controles abaixo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="visible" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="visible">Widgets Ativos</TabsTrigger>
                <TabsTrigger value="available">Adicionar Widgets</TabsTrigger>
              </TabsList>
              
              <TabsContent value="visible" className="space-y-4">
                <ScrollArea className="h-48">
                  {activeLayout.widgets.map(widgetLayout => {
                    const widget = availableWidgets.find(w => w.id === widgetLayout.id)
                    if (!widget) return null
                    
                    return (
                      <div key={widget.id} className="flex items-center justify-between p-2 border rounded mb-2">
                        <div className="flex items-center gap-3">
                          <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab" />
                          <widget.icon className="w-4 h-4" />
                          <span className="font-medium">{widget.title}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => toggleWidgetMinimized(widget.id)}
                          >
                            {widgetLayout.minimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                          </Button>
                          <Switch
                            checked={widgetLayout.visible}
                            onCheckedChange={() => toggleWidgetVisibility(widget.id)}
                          />
                        </div>
                      </div>
                    )
                  })}
                </ScrollArea>
              </TabsContent>
              
              <TabsContent value="available" className="space-y-4">
                <ScrollArea className="h-48">
                  {availableWidgets
                    .filter(widget => !activeLayout.widgets.some(w => w.id === widget.id && w.visible))
                    .map(widget => (
                      <div key={widget.id} className="flex items-center justify-between p-2 border rounded mb-2">
                        <div className="flex items-center gap-3">
                          <widget.icon className="w-4 h-4" />
                          <div>
                            <div className="font-medium">{widget.title}</div>
                            <div className="text-sm text-muted-foreground">{widget.description}</div>
                          </div>
                        </div>
                        <Button size="sm" onClick={() => addWidget(widget.id)}>
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      {/* Grid de widgets */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="dashboard-widgets" direction="vertical" isDropDisabled={!isCustomizing}>
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className={`grid gap-4 ${
                isCustomizing 
                  ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                  : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
              }`}
            >
              {getVisibleWidgets().map((widget, index) => (
                <Draggable 
                  key={widget.id} 
                  draggableId={widget.id} 
                  index={index}
                  isDragDisabled={!isCustomizing}
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={`relative transition-transform ${
                        snapshot.isDragging ? 'rotate-2 scale-105' : ''
                      } ${widget.layout.minimized ? 'opacity-60' : ''}`}
                    >
                      <Card className={`${isCustomizing ? 'border-dashed border-2' : ''}`}>
                        {isCustomizing && (
                          <div 
                            {...provided.dragHandleProps}
                            className="absolute top-2 left-2 z-10 cursor-grab active:cursor-grabbing"
                          >
                            <GripVertical className="w-4 h-4 text-muted-foreground" />
                          </div>
                        )}
                        
                        <CardHeader className={`${isCustomizing ? 'pl-8' : ''} ${widget.layout.minimized ? 'pb-2' : ''}`}>
                          <div className="flex items-center justify-between">
                            <CardTitle className="flex items-center gap-2">
                              <widget.icon className="w-5 h-5" />
                              {widget.title}
                            </CardTitle>
                            {isCustomizing && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => toggleWidgetMinimized(widget.id)}
                              >
                                {widget.layout.minimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                              </Button>
                            )}
                          </div>
                          {!widget.layout.minimized && (
                            <CardDescription>{widget.description}</CardDescription>
                          )}
                        </CardHeader>
                        
                        {!widget.layout.minimized && (
                          <CardContent>
                            {widget.render()}
                          </CardContent>
                        )}
                      </Card>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  )
}
