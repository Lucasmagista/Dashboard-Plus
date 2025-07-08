"use client"

import React, { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  Cloud, 
  CloudDownload, 
  CloudUpload, 
  HardDrive, 
  RefreshCw, 
  Check, 
  AlertTriangle, 
  X,
  FolderSync,
  Shield,
  Clock,
  FileText,
  Image,
  Video,
  Archive
} from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface CloudProvider {
  id: 'google-drive' | 'onedrive' | 'dropbox' | 's3'
  name: string
  icon: any
  connected: boolean
  totalSpace: number
  usedSpace: number
  lastSync: Date
  autoSync: boolean
  syncStatus: 'idle' | 'syncing' | 'error' | 'success'
}

interface BackupFile {
  id: string
  name: string
  type: 'document' | 'image' | 'video' | 'database' | 'settings'
  size: number
  lastModified: Date
  synced: boolean
  provider: string
  versions: number
}

export const CloudStorageWidget: React.FC = () => {
  const [providers, setProviders] = useState<CloudProvider[]>([
    {
      id: 'google-drive',
      name: 'Google Drive',
      icon: Cloud,
      connected: true,
      totalSpace: 15 * 1024 * 1024 * 1024, // 15GB
      usedSpace: 8.2 * 1024 * 1024 * 1024, // 8.2GB
      lastSync: new Date(Date.now() - 5 * 60 * 1000),
      autoSync: true,
      syncStatus: 'success'
    },
    {
      id: 'onedrive',
      name: 'OneDrive',
      icon: Cloud,
      connected: true,
      totalSpace: 5 * 1024 * 1024 * 1024, // 5GB
      usedSpace: 2.1 * 1024 * 1024 * 1024, // 2.1GB
      lastSync: new Date(Date.now() - 15 * 60 * 1000),
      autoSync: true,
      syncStatus: 'idle'
    },
    {
      id: 'dropbox',
      name: 'Dropbox Business',
      icon: Cloud,
      connected: false,
      totalSpace: 0,
      usedSpace: 0,
      lastSync: new Date(),
      autoSync: false,
      syncStatus: 'idle'
    },
    {
      id: 's3',
      name: 'Amazon S3',
      icon: Archive,
      connected: true,
      totalSpace: 100 * 1024 * 1024 * 1024, // 100GB
      usedSpace: 45 * 1024 * 1024 * 1024, // 45GB
      lastSync: new Date(Date.now() - 2 * 60 * 1000),
      autoSync: true,
      syncStatus: 'success'
    }
  ])

  const [files, setFiles] = useState<BackupFile[]>([
    {
      id: '1',
      name: 'contacts_backup_2025-07-07.json',
      type: 'database',
      size: 15.8 * 1024 * 1024, // 15.8MB
      lastModified: new Date(Date.now() - 30 * 60 * 1000),
      synced: true,
      provider: 'google-drive',
      versions: 5
    },
    {
      id: '2',
      name: 'dashboard_settings.json',
      type: 'settings',
      size: 2.3 * 1024, // 2.3KB
      lastModified: new Date(Date.now() - 2 * 60 * 60 * 1000),
      synced: true,
      provider: 'onedrive',
      versions: 12
    },
    {
      id: '3',
      name: 'company_presentation.pdf',
      type: 'document',
      size: 8.5 * 1024 * 1024, // 8.5MB
      lastModified: new Date(Date.now() - 24 * 60 * 60 * 1000),
      synced: false,
      provider: 'google-drive',
      versions: 3
    },
    {
      id: '4',
      name: 'product_images.zip',
      type: 'image',
      size: 125 * 1024 * 1024, // 125MB
      lastModified: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      synced: true,
      provider: 's3',
      versions: 2
    }
  ])

  const [isBackingUp, setIsBackingUp] = useState(false)
  const [backupProgress, setBackupProgress] = useState(0)

  // Simular sincronização
  const syncProvider = useCallback(async (providerId: string) => {
    setProviders(prev => prev.map(p => 
      p.id === providerId ? { ...p, syncStatus: 'syncing' } : p
    ))

    // Simular processo de sync
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 200))
      setBackupProgress(i)
    }

    setProviders(prev => prev.map(p => 
      p.id === providerId 
        ? { ...p, syncStatus: 'success', lastSync: new Date() }
        : p
    ))
    setBackupProgress(0)
  }, [])

  // Backup completo
  const performFullBackup = useCallback(async () => {
    setIsBackingUp(true)
    setBackupProgress(0)

    const steps = [
      'Coletando dados de contatos...',
      'Exportando configurações...',
      'Compactando arquivos...',
      'Enviando para Google Drive...',
      'Enviando para OneDrive...',
      'Verificando integridade...',
      'Backup concluído!'
    ]

    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 1000))
      setBackupProgress(((i + 1) / steps.length) * 100)
    }

    // Adicionar novo arquivo de backup
    const newBackup: BackupFile = {
      id: Date.now().toString(),
      name: `full_backup_${format(new Date(), 'yyyy-MM-dd_HH-mm')}.zip`,
      type: 'database',
      size: 85 * 1024 * 1024, // 85MB
      lastModified: new Date(),
      synced: true,
      provider: 'google-drive',
      versions: 1
    }

    setFiles(prev => [newBackup, ...prev])
    setIsBackingUp(false)
    setBackupProgress(0)
  }, [])

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'document': return FileText
      case 'image': return Image
      case 'video': return Video
      case 'database': return HardDrive
      case 'settings': return Shield
      default: return FileText
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <Check className="w-4 h-4 text-green-500" />
      case 'syncing': return <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />
      case 'error': return <X className="w-4 h-4 text-red-500" />
      default: return <Clock className="w-4 h-4 text-gray-500" />
    }
  }

  const toggleAutoSync = (providerId: string) => {
    setProviders(prev => prev.map(p => 
      p.id === providerId ? { ...p, autoSync: !p.autoSync } : p
    ))
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Cloud className="w-5 h-5" />
              Armazenamento em Nuvem
            </CardTitle>
            <CardDescription>
              Backup automático e sincronização de dados
            </CardDescription>
          </div>
          <Button 
            onClick={performFullBackup} 
            disabled={isBackingUp}
            className="flex items-center gap-2"
          >
            {isBackingUp ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Fazendo Backup...
              </>
            ) : (
              <>
                <CloudUpload className="w-4 h-4" />
                Backup Completo
              </>
            )}
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="providers" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="providers">Provedores</TabsTrigger>
            <TabsTrigger value="files">Arquivos</TabsTrigger>
            <TabsTrigger value="versions">Versões</TabsTrigger>
          </TabsList>

          {/* Provedores de Nuvem */}
          <TabsContent value="providers" className="space-y-4">
            {isBackingUp && (
              <Card className="border-blue-200 bg-blue-50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <RefreshCw className="w-5 h-5 text-blue-600 animate-spin" />
                    <span className="font-medium">Backup em andamento...</span>
                  </div>
                  <Progress value={backupProgress} className="h-2" />
                  <p className="text-sm text-muted-foreground mt-2">
                    {backupProgress.toFixed(0)}% concluído
                  </p>
                </CardContent>
              </Card>
            )}

            <div className="grid gap-4 md:grid-cols-2">
              {providers.map(provider => (
                <Card key={provider.id} className={`${
                  provider.connected ? 'border-green-200 bg-green-50/50' : 'border-gray-200'
                }`}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <provider.icon className="w-5 h-5" />
                        <span className="font-medium">{provider.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(provider.syncStatus)}
                        <Badge variant={provider.connected ? "default" : "secondary"}>
                          {provider.connected ? "Conectado" : "Desconectado"}
                        </Badge>
                      </div>
                    </div>

                    {provider.connected && (
                      <>
                        <div className="space-y-3">
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Armazenamento</span>
                              <span>
                                {formatBytes(provider.usedSpace)} / {formatBytes(provider.totalSpace)}
                              </span>
                            </div>
                            <Progress 
                              value={(provider.usedSpace / provider.totalSpace) * 100} 
                              className="h-2"
                            />
                          </div>

                          <div className="flex items-center justify-between text-sm">
                            <span>Última sincronização:</span>
                            <span className="text-muted-foreground">
                              {format(provider.lastSync, 'HH:mm', { locale: ptBR })}
                            </span>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-sm">Sync automático:</span>
                            <Switch
                              checked={provider.autoSync}
                              onCheckedChange={() => toggleAutoSync(provider.id)}
                            />
                          </div>
                        </div>

                        <div className="flex gap-2 mt-4">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => syncProvider(provider.id)}
                            disabled={provider.syncStatus === 'syncing'}
                            className="flex-1"
                          >
                            <FolderSync className="w-4 h-4 mr-2" />
                            Sincronizar
                          </Button>
                        </div>
                      </>
                    )}

                    {!provider.connected && (
                      <Button className="w-full" variant="outline">
                        <Cloud className="w-4 h-4 mr-2" />
                        Conectar
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Lista de Arquivos */}
          <TabsContent value="files" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Arquivos Sincronizados</h3>
              <Badge variant="secondary">
                {files.length} arquivos
              </Badge>
            </div>

            <ScrollArea className="h-96">
              <div className="space-y-2">
                {files.map(file => {
                  const FileIcon = getFileIcon(file.type)
                  const provider = providers.find(p => p.id === file.provider)
                  
                  return (
                    <Card key={file.id} className="p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="p-2 bg-muted rounded">
                            <FileIcon className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm truncate">
                              {file.name}
                            </h4>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <span>{formatBytes(file.size)}</span>
                              <span>•</span>
                              <span>{provider?.name}</span>
                              <span>•</span>
                              <span>{file.versions} versões</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant={file.synced ? "default" : "destructive"}
                            className="text-xs"
                          >
                            {file.synced ? "Sincronizado" : "Pendente"}
                          </Badge>
                          <Button size="sm" variant="ghost">
                            <CloudDownload className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  )
                })}
              </div>
            </ScrollArea>
          </TabsContent>

          {/* Controle de Versões */}
          <TabsContent value="versions" className="space-y-4">
            <div className="text-center py-8">
              <Archive className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-medium mb-2">Versionamento de Arquivos</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Mantenha múltiplas versões dos seus arquivos importantes
              </p>
              <Button variant="outline">
                Configurar Versionamento
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
