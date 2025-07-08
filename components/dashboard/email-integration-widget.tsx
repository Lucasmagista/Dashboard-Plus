"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { 
  Mail, 
  Settings,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Clock,
  Users,
  Send,
  Inbox,
  Archive,
  Trash2,
  Star,
  Reply,
  Forward,
  Paperclip,
  Calendar,
  Phone,
  Plus,
  Filter,
  Search
} from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format, formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"

interface EmailAccount {
  id: string
  email: string
  provider: 'gmail' | 'outlook'
  displayName: string
  isConnected: boolean
  lastSync: Date
  unreadCount: number
  syncEnabled: boolean
  settings: {
    autoSync: boolean
    syncInterval: number
    syncFolders: string[]
    trackOpens: boolean
    trackClicks: boolean
  }
}

interface EmailMessage {
  id: string
  accountId: string
  subject: string
  from: {
    name: string
    email: string
  }
  to: Array<{
    name: string
    email: string
  }>
  body: string
  isRead: boolean
  isImportant: boolean
  hasAttachments: boolean
  receivedAt: Date
  folder: string
  labels: string[]
  crmContact?: {
    id: string
    name: string
    company: string
  }
  thread: {
    id: string
    messageCount: number
  }
}

interface SyncStatus {
  isRunning: boolean
  lastSync: Date
  totalMessages: number
  newMessages: number
  errors: string[]
  progress: number
}

const SYNC_INTERVALS = [
  { value: 5, label: '5 minutos' },
  { value: 15, label: '15 minutos' },
  { value: 30, label: '30 minutos' },
  { value: 60, label: '1 hora' },
  { value: 240, label: '4 horas' },
]

const EMAIL_FOLDERS = [
  { id: 'inbox', name: 'Caixa de Entrada', icon: Inbox },
  { id: 'sent', name: 'Enviados', icon: Send },
  { id: 'drafts', name: 'Rascunhos', icon: Clock },
  { id: 'important', name: 'Importantes', icon: Star },
  { id: 'archive', name: 'Arquivo', icon: Archive },
  { id: 'trash', name: 'Lixeira', icon: Trash2 },
]

export function EmailIntegrationWidget() {
  const [accounts, setAccounts] = useState<EmailAccount[]>([])
  const [messages, setMessages] = useState<EmailMessage[]>([])
  const [syncStatus, setSyncStatus] = useState<SyncStatus | null>(null)
  const [selectedAccount, setSelectedAccount] = useState<EmailAccount | null>(null)
  const [selectedFolder, setSelectedFolder] = useState('inbox')
  const [searchQuery, setSearchQuery] = useState('')
  const [showConnectionDialog, setShowConnectionDialog] = useState(false)
  const [newAccountEmail, setNewAccountEmail] = useState('')
  const [selectedProvider, setSelectedProvider] = useState<'gmail' | 'outlook'>('gmail')

  // Carregar dados mockados
  useEffect(() => {
    const mockAccounts: EmailAccount[] = [
      {
        id: 'acc_1',
        email: 'vendas@empresa.com',
        provider: 'gmail',
        displayName: 'Equipe de Vendas',
        isConnected: true,
        lastSync: new Date(Date.now() - 5 * 60 * 1000),
        unreadCount: 12,
        syncEnabled: true,
        settings: {
          autoSync: true,
          syncInterval: 15,
          syncFolders: ['inbox', 'sent', 'important'],
          trackOpens: true,
          trackClicks: true
        }
      },
      {
        id: 'acc_2',
        email: 'suporte@empresa.com',
        provider: 'outlook',
        displayName: 'Suporte ao Cliente',
        isConnected: false,
        lastSync: new Date(Date.now() - 2 * 60 * 60 * 1000),
        unreadCount: 0,
        syncEnabled: false,
        settings: {
          autoSync: false,
          syncInterval: 30,
          syncFolders: ['inbox'],
          trackOpens: false,
          trackClicks: false
        }
      }
    ]

    const mockMessages: EmailMessage[] = [
      {
        id: 'msg_1',
        accountId: 'acc_1',
        subject: 'Proposta comercial - Empresa ABC',
        from: {
          name: 'João Silva',
          email: 'joao@empresaabc.com'
        },
        to: [{
          name: 'Vendas',
          email: 'vendas@empresa.com'
        }],
        body: 'Olá, gostaria de solicitar uma proposta comercial para nosso novo projeto...',
        isRead: false,
        isImportant: true,
        hasAttachments: true,
        receivedAt: new Date(Date.now() - 30 * 60 * 1000),
        folder: 'inbox',
        labels: ['proposta', 'importante'],
        crmContact: {
          id: 'contact_1',
          name: 'João Silva',
          company: 'Empresa ABC'
        },
        thread: {
          id: 'thread_1',
          messageCount: 3
        }
      },
      {
        id: 'msg_2',
        accountId: 'acc_1',
        subject: 'Re: Reunião de acompanhamento',
        from: {
          name: 'Maria Santos',
          email: 'maria@clientexyz.com'
        },
        to: [{
          name: 'Vendas',
          email: 'vendas@empresa.com'
        }],
        body: 'Perfeito! Confirmo nossa reunião para amanhã às 14h...',
        isRead: true,
        isImportant: false,
        hasAttachments: false,
        receivedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        folder: 'inbox',
        labels: ['reuniao'],
        crmContact: {
          id: 'contact_2',
          name: 'Maria Santos',
          company: 'Cliente XYZ'
        },
        thread: {
          id: 'thread_2',
          messageCount: 5
        }
      }
    ]

    setAccounts(mockAccounts)
    setMessages(mockMessages)
    if (mockAccounts.length > 0) {
      setSelectedAccount(mockAccounts[0])
    }
  }, [])

  // Conectar nova conta
  const connectAccount = () => {
    if (!newAccountEmail.trim()) return

    const newAccount: EmailAccount = {
      id: `acc_${Date.now()}`,
      email: newAccountEmail.trim(),
      provider: selectedProvider,
      displayName: newAccountEmail.trim(),
      isConnected: false,
      lastSync: new Date(),
      unreadCount: 0,
      syncEnabled: false,
      settings: {
        autoSync: false,
        syncInterval: 15,
        syncFolders: ['inbox'],
        trackOpens: false,
        trackClicks: false
      }
    }

    setAccounts([...accounts, newAccount])
    setNewAccountEmail('')
    setShowConnectionDialog(false)

    // Simular processo de conexão
    setTimeout(() => {
      setAccounts(prev => prev.map(acc => 
        acc.id === newAccount.id 
          ? { ...acc, isConnected: true, syncEnabled: true }
          : acc
      ))
    }, 2000)
  }

  // Iniciar sincronização
  const startSync = (accountId: string) => {
    setSyncStatus({
      isRunning: true,
      lastSync: new Date(),
      totalMessages: 0,
      newMessages: 0,
      errors: [],
      progress: 0
    })

    // Simular progresso de sincronização
    let progress = 0
    const interval = setInterval(() => {
      progress += Math.random() * 15
      if (progress >= 100) {
        progress = 100
        clearInterval(interval)
        
        // Finalizar sincronização
        setTimeout(() => {
          setSyncStatus({
            isRunning: false,
            lastSync: new Date(),
            totalMessages: 156,
            newMessages: 12,
            errors: [],
            progress: 100
          })

          // Atualizar conta
          setAccounts(prev => prev.map(acc => 
            acc.id === accountId 
              ? { ...acc, lastSync: new Date(), unreadCount: acc.unreadCount + 5 }
              : acc
          ))
        }, 1000)
      } else {
        setSyncStatus(prev => prev ? { ...prev, progress } : null)
      }
    }, 500)
  }

  // Filtrar mensagens
  const filteredMessages = messages.filter(message => {
    if (selectedAccount && message.accountId !== selectedAccount.id) return false
    if (selectedFolder && message.folder !== selectedFolder) return false
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        message.subject.toLowerCase().includes(query) ||
        message.from.name.toLowerCase().includes(query) ||
        message.from.email.toLowerCase().includes(query) ||
        message.body.toLowerCase().includes(query)
      )
    }
    return true
  })

  // Marcar como lida
  const markAsRead = (messageId: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, isRead: true } : msg
    ))
  }

  // Atualizar configurações da conta
  const updateAccountSettings = (accountId: string, settings: Partial<EmailAccount['settings']>) => {
    setAccounts(prev => prev.map(acc => 
      acc.id === accountId 
        ? { ...acc, settings: { ...acc.settings, ...settings } }
        : acc
    ))
  }

  const unreadCount = messages.filter(m => !m.isRead && selectedAccount && m.accountId === selectedAccount.id).length

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Integração de Email
              {unreadCount > 0 && (
                <Badge variant="destructive" className="rounded-full px-2 py-1 text-xs">
                  {unreadCount}
                </Badge>
              )}
            </CardTitle>
            <CardDescription>
              Sincronização bidirecional com Gmail e Outlook
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setShowConnectionDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Conectar
            </Button>
            {selectedAccount && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => startSync(selectedAccount.id)}
                disabled={syncStatus?.isRunning}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${syncStatus?.isRunning ? 'animate-spin' : ''}`} />
                Sincronizar
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="messages" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="messages">Mensagens</TabsTrigger>
            <TabsTrigger value="accounts">Contas</TabsTrigger>
            <TabsTrigger value="sync">Sincronização</TabsTrigger>
            <TabsTrigger value="settings">Configurações</TabsTrigger>
          </TabsList>

          <TabsContent value="messages" className="space-y-4">
            {/* Filtros e busca */}
            <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2">
                <Select value={selectedAccount?.id || ''} onValueChange={(value) => {
                  const account = accounts.find(a => a.id === value)
                  setSelectedAccount(account || null)
                }}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Selecionar conta" />
                  </SelectTrigger>
                  <SelectContent>
                    {accounts.map(account => (
                      <SelectItem key={account.id} value={account.id}>
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${account.isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
                          {account.email}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedFolder} onValueChange={setSelectedFolder}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {EMAIL_FOLDERS.map(folder => {
                      const FolderIcon = folder.icon
                      return (
                        <SelectItem key={folder.id} value={folder.id}>
                          <div className="flex items-center gap-2">
                            <FolderIcon className="h-4 w-4" />
                            {folder.name}
                          </div>
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex-1 flex items-center gap-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar mensagens..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="border-0 bg-transparent"
                />
              </div>
            </div>

            {/* Lista de mensagens */}
            <div className="space-y-2">
              {filteredMessages.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Mail className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhuma mensagem encontrada</p>
                  <p className="text-sm">Verifique os filtros ou conecte uma conta de email</p>
                </div>
              ) : (
                filteredMessages.map(message => (
                  <div
                    key={message.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      !message.isRead ? 'bg-blue-50 border-blue-200' : 'bg-background hover:bg-muted/50'
                    }`}
                    onClick={() => markAsRead(message.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-primary">
                            {message.from.name.charAt(0)}
                          </span>
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm">{message.from.name}</span>
                          <span className="text-xs text-muted-foreground">{message.from.email}</span>
                          {message.isImportant && <Star className="h-3 w-3 text-yellow-500" />}
                          {message.hasAttachments && <Paperclip className="h-3 w-3 text-muted-foreground" />}
                          {!message.isRead && <div className="w-2 h-2 bg-blue-500 rounded-full" />}
                        </div>

                        <h4 className="font-medium text-sm mb-1">{message.subject}</h4>
                        <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                          {message.body}
                        </p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>{formatDistanceToNow(message.receivedAt, { locale: ptBR })} atrás</span>
                            {message.thread.messageCount > 1 && (
                              <span>{message.thread.messageCount} mensagens</span>
                            )}
                            {message.crmContact && (
                              <div className="flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                {message.crmContact.name}
                              </div>
                            )}
                          </div>

                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="sm" className="p-1">
                              <Reply className="h-3 w-3" />
                            </Button>
                            <Button variant="ghost" size="sm" className="p-1">
                              <Forward className="h-3 w-3" />
                            </Button>
                            <Button variant="ghost" size="sm" className="p-1">
                              <Archive className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>

                        {message.labels.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {message.labels.map(label => (
                              <Badge key={label} variant="secondary" className="text-xs">
                                {label}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="accounts" className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium">Contas Conectadas</h3>
                <p className="text-sm text-muted-foreground">
                  {accounts.filter(a => a.isConnected).length} de {accounts.length} contas ativas
                </p>
              </div>
              <Button onClick={() => setShowConnectionDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Nova Conta
              </Button>
            </div>

            <div className="grid gap-4">
              {accounts.map(account => (
                <div key={account.id} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${account.isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
                      <div>
                        <h4 className="font-medium">{account.displayName}</h4>
                        <p className="text-sm text-muted-foreground">{account.email}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <Badge variant="outline" className="text-xs">
                            {account.provider.toUpperCase()}
                          </Badge>
                          <span>
                            Última sync: {formatDistanceToNow(account.lastSync, { locale: ptBR })} atrás
                          </span>
                          <span>{account.unreadCount} não lidas</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Switch
                        checked={account.syncEnabled}
                        onCheckedChange={(enabled) => {
                          setAccounts(prev => prev.map(acc => 
                            acc.id === account.id ? { ...acc, syncEnabled: enabled } : acc
                          ))
                        }}
                      />
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          setAccounts(prev => prev.filter(a => a.id !== account.id))
                        }}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="sync" className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-4">Status de Sincronização</h3>
              
              {syncStatus ? (
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      {syncStatus.isRunning ? (
                        <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
                      ) : (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      )}
                      <span className="font-medium">
                        {syncStatus.isRunning ? 'Sincronizando...' : 'Última Sincronização'}
                      </span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {format(syncStatus.lastSync, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                    </span>
                  </div>

                  {syncStatus.isRunning && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span>Progresso</span>
                        <span>{Math.round(syncStatus.progress)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all duration-500"
                          style={{ width: `${syncStatus.progress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Total de mensagens:</span>
                      <div className="font-medium">{syncStatus.totalMessages}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Novas mensagens:</span>
                      <div className="font-medium text-green-600">{syncStatus.newMessages}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Erros:</span>
                      <div className="font-medium text-red-600">{syncStatus.errors.length}</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <RefreshCw className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhuma sincronização executada ainda</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            {selectedAccount ? (
              <div>
                <h3 className="text-lg font-medium mb-4">Configurações - {selectedAccount.email}</h3>
                
                <div className="space-y-6">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-3">Sincronização Automática</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="auto-sync">Sincronização Automática</Label>
                          <p className="text-sm text-muted-foreground">
                            Sincronizar mensagens automaticamente
                          </p>
                        </div>
                        <Switch
                          id="auto-sync"
                          checked={selectedAccount.settings.autoSync}
                          onCheckedChange={(autoSync) => 
                            updateAccountSettings(selectedAccount.id, { autoSync })
                          }
                        />
                      </div>

                      <div>
                        <Label htmlFor="sync-interval">Intervalo de Sincronização</Label>
                        <Select 
                          value={selectedAccount.settings.syncInterval.toString()} 
                          onValueChange={(value) => 
                            updateAccountSettings(selectedAccount.id, { syncInterval: parseInt(value) })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {SYNC_INTERVALS.map(interval => (
                              <SelectItem key={interval.value} value={interval.value.toString()}>
                                {interval.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-3">Rastreamento</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="track-opens">Rastrear Aberturas</Label>
                          <p className="text-sm text-muted-foreground">
                            Acompanhar quando emails são abertos
                          </p>
                        </div>
                        <Switch
                          id="track-opens"
                          checked={selectedAccount.settings.trackOpens}
                          onCheckedChange={(trackOpens) => 
                            updateAccountSettings(selectedAccount.id, { trackOpens })
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="track-clicks">Rastrear Cliques</Label>
                          <p className="text-sm text-muted-foreground">
                            Acompanhar cliques em links dos emails
                          </p>
                        </div>
                        <Switch
                          id="track-clicks"
                          checked={selectedAccount.settings.trackClicks}
                          onCheckedChange={(trackClicks) => 
                            updateAccountSettings(selectedAccount.id, { trackClicks })
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Settings className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Selecione uma conta para ver as configurações</p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Dialog para conectar nova conta */}
        {showConnectionDialog && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-background p-6 rounded-lg border max-w-md w-full">
              <h3 className="text-lg font-medium mb-4">Conectar Nova Conta</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="provider">Provedor</Label>
                  <Select value={selectedProvider} onValueChange={(value) => setSelectedProvider(value as 'gmail' | 'outlook')}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gmail">Gmail</SelectItem>
                      <SelectItem value="outlook">Outlook</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={newAccountEmail}
                    onChange={(e) => setNewAccountEmail(e.target.value)}
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowConnectionDialog(false)}>
                    Cancelar
                  </Button>
                  <Button 
                    onClick={connectAccount}
                    disabled={!newAccountEmail.trim()}
                  >
                    Conectar
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
