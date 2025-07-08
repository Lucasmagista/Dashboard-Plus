"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  MessageSquare, 
  Mail, 
  Phone, 
  Send, 
  Search,
  Filter,
  Star,
  Archive,
  Reply,
  Forward,
  Clock
} from "lucide-react";

interface Message {
  id: string;
  type: "email" | "sms" | "whatsapp" | "chat";
  from: string;
  to: string;
  subject?: string;
  content: string;
  timestamp: string;
  status: "unread" | "read" | "replied" | "archived";
  priority: "high" | "medium" | "low";
  tags: string[];
  attachments?: number;
}

const mockMessages: Message[] = [
  {
    id: "1",
    type: "email",
    from: "ana.silva@empresa.com",
    to: "vendas@crm.com",
    subject: "Proposta de Sistema ERP",
    content: "Gostaria de receber uma proposta detalhada para implementação do sistema ERP...",
    timestamp: "2h atrás",
    status: "unread",
    priority: "high",
    tags: ["Cliente", "Proposta"],
    attachments: 2
  },
  {
    id: "2",
    type: "whatsapp",
    from: "Carlos Santos",
    to: "Suporte",
    content: "Preciso de ajuda com a integração do sistema de pagamentos.",
    timestamp: "3h atrás",
    status: "replied",
    priority: "medium",
    tags: ["Suporte", "Integração"]
  },
  {
    id: "3",
    type: "sms",
    from: "+55 11 99999-9999",
    to: "Marketing",
    content: "Recebi seu material sobre automação. Vamos conversar?",
    timestamp: "5h atrás",
    status: "read",
    priority: "low",
    tags: ["Lead", "Marketing"]
  },
  {
    id: "4",
    type: "chat",
    from: "Maria Oliveira",
    to: "Vendas",
    subject: "Dúvidas sobre licenças",
    content: "Qual o modelo de licenciamento para empresas com mais de 100 usuários?",
    timestamp: "1 dia atrás",
    status: "unread",
    priority: "medium",
    tags: ["Licenças", "Enterprise"]
  }
];

export function UnifiedMessagesWidget() {
  const [messages] = useState<Message[]>(mockMessages);
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  const filteredMessages = messages.filter(message => {
    const matchesSearch = message.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (message.subject && message.subject.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFilter = selectedFilter === "all" || 
                         (selectedFilter === "unread" && message.status === "unread") ||
                         (selectedFilter === "starred" && message.priority === "high") ||
                         message.type === selectedFilter;
    
    return matchesSearch && matchesFilter;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "email": return <Mail className="h-4 w-4" />;
      case "sms": return <Phone className="h-4 w-4" />;
      case "whatsapp": return <MessageSquare className="h-4 w-4" />;
      case "chat": return <MessageSquare className="h-4 w-4" />;
      default: return <MessageSquare className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "email": return "bg-blue-100 text-blue-800";
      case "sms": return "bg-green-100 text-green-800";
      case "whatsapp": return "bg-emerald-100 text-emerald-800";
      case "chat": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "unread": return "bg-red-100 text-red-800";
      case "replied": return "bg-green-100 text-green-800";
      case "read": return "bg-blue-100 text-blue-800";
      case "archived": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "text-red-500";
      case "medium": return "text-yellow-500";
      case "low": return "text-green-500";
      default: return "text-gray-500";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "unread": return "Não lida";
      case "replied": return "Respondida";
      case "read": return "Lida";
      case "archived": return "Arquivada";
      default: return status;
    }
  };

  const unreadCount = messages.filter(m => m.status === "unread").length;
  const todayCount = messages.filter(m => m.timestamp.includes("h atrás")).length;
  const highPriorityCount = messages.filter(m => m.priority === "high").length;

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Central de Mensagens
            </CardTitle>
            <CardDescription>
              Caixa de entrada unificada para todos os canais
            </CardDescription>
          </div>
          <Button size="sm">
            <Send className="h-4 w-4 mr-1" />
            Nova Mensagem
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="inbox" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="inbox">Caixa de Entrada</TabsTrigger>
            <TabsTrigger value="sent">Enviadas</TabsTrigger>
            <TabsTrigger value="analytics">Métricas</TabsTrigger>
          </TabsList>
          
          <TabsContent value="inbox" className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-red-50 p-3 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Não Lidas</p>
                    <p className="text-lg font-bold text-red-600">{unreadCount}</p>
                  </div>
                  <MessageSquare className="h-8 w-8 text-red-500" />
                </div>
              </div>
              
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Hoje</p>
                    <p className="text-lg font-bold text-blue-600">{todayCount}</p>
                  </div>
                  <Clock className="h-8 w-8 text-blue-500" />
                </div>
              </div>
              
              <div className="bg-orange-50 p-3 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Urgentes</p>
                    <p className="text-lg font-bold text-orange-600">{highPriorityCount}</p>
                  </div>
                  <Star className="h-8 w-8 text-orange-500" />
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar mensagens..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex gap-2 flex-wrap">
              {["all", "unread", "email", "whatsapp", "sms", "chat"].map((filter) => (
                <Button
                  key={filter}
                  variant={selectedFilter === filter ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedFilter(filter)}
                  className="capitalize"
                >
                  {filter === "all" ? "Todas" : filter}
                </Button>
              ))}
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Mensagens ({filteredMessages.length})</h4>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {filteredMessages.map((message) => (
                    <div 
                      key={message.id} 
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedMessage?.id === message.id ? 'bg-blue-50 border-blue-300' : 'hover:bg-gray-50'
                      } ${message.status === 'unread' ? 'border-l-4 border-l-red-500' : ''}`}
                      onClick={() => setSelectedMessage(message)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge className={getTypeColor(message.type)}>
                            {getTypeIcon(message.type)}
                            <span className="ml-1 capitalize">{message.type}</span>
                          </Badge>
                          <Badge className={getStatusColor(message.status)}>
                            {getStatusLabel(message.status)}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className={`h-4 w-4 ${getPriorityColor(message.priority)}`} />
                          <span className="text-xs text-gray-500">{message.timestamp}</span>
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <p className="font-medium text-sm">{message.from}</p>
                        {message.subject && (
                          <p className="font-medium text-sm">{message.subject}</p>
                        )}
                        <p className="text-sm text-gray-600 line-clamp-2">{message.content}</p>
                      </div>
                      
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex gap-1">
                          {message.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        {message.attachments && (
                          <span className="text-xs text-gray-500">
                            📎 {message.attachments} anexos
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Detalhes da Mensagem</h4>
                {selectedMessage ? (
                  <div className="border rounded-lg p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge className={getTypeColor(selectedMessage.type)}>
                          {getTypeIcon(selectedMessage.type)}
                          <span className="ml-1 capitalize">{selectedMessage.type}</span>
                        </Badge>
                        <Badge className={getStatusColor(selectedMessage.status)}>
                          {getStatusLabel(selectedMessage.status)}
                        </Badge>
                      </div>
                      <span className="text-sm text-gray-500">{selectedMessage.timestamp}</span>
                    </div>
                    
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm font-medium">De: </span>
                        <span className="text-sm">{selectedMessage.from}</span>
                      </div>
                      <div>
                        <span className="text-sm font-medium">Para: </span>
                        <span className="text-sm">{selectedMessage.to}</span>
                      </div>
                      {selectedMessage.subject && (
                        <div>
                          <span className="text-sm font-medium">Assunto: </span>
                          <span className="text-sm">{selectedMessage.subject}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="border-t pt-3">
                      <p className="text-sm">{selectedMessage.content}</p>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Reply className="h-4 w-4 mr-1" />
                        Responder
                      </Button>
                      <Button size="sm" variant="outline">
                        <Forward className="h-4 w-4 mr-1" />
                        Encaminhar
                      </Button>
                      <Button size="sm" variant="outline">
                        <Archive className="h-4 w-4 mr-1" />
                        Arquivar
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="border rounded-lg p-8 text-center text-gray-500">
                    <MessageSquare className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                    <p>Selecione uma mensagem para ver os detalhes</p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="sent" className="space-y-4">
            <div className="text-center py-8 text-gray-500">
              <Send className="h-12 w-12 mx-auto mb-2 text-gray-300" />
              <p>Mensagens enviadas aparecerão aqui</p>
            </div>
          </TabsContent>
          
          <TabsContent value="analytics" className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="text-center">
                  <p className="text-sm text-gray-600">Taxa de Resposta</p>
                  <p className="text-2xl font-bold text-blue-600">87%</p>
                </div>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <div className="text-center">
                  <p className="text-sm text-gray-600">Tempo Médio</p>
                  <p className="text-2xl font-bold text-green-600">2h 15m</p>
                </div>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg">
                <div className="text-center">
                  <p className="text-sm text-gray-600">Satisfação</p>
                  <p className="text-2xl font-bold text-purple-600">4.8/5</p>
                </div>
              </div>
              <div className="bg-orange-50 p-3 rounded-lg">
                <div className="text-center">
                  <p className="text-sm text-gray-600">Conversões</p>
                  <p className="text-2xl font-bold text-orange-600">23%</p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
