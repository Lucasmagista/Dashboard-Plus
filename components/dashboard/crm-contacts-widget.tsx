"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  UserPlus, 
  Search, 
  Star, 
  Mail, 
  Phone, 
  Calendar,
  TrendingUp,
  Filter,
  MoreHorizontal 
} from "lucide-react";

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: "hot" | "warm" | "cold" | "new";
  score: number;
  lastInteraction: string;
  nextFollowUp: string;
  tags: string[];
}

const mockContacts: Contact[] = [
  {
    id: "1",
    name: "Ana Silva",
    email: "ana@empresa.com",
    phone: "(11) 9999-9999",
    company: "TechCorp",
    status: "hot",
    score: 95,
    lastInteraction: "2h atrás",
    nextFollowUp: "Hoje 15:00",
    tags: ["Premium", "Decision Maker"]
  },
  {
    id: "2",
    name: "Carlos Santos",
    email: "carlos@startup.com",
    phone: "(11) 8888-8888",
    company: "StartupX",
    status: "warm",
    score: 78,
    lastInteraction: "1 dia atrás",
    nextFollowUp: "Amanhã",
    tags: ["SaaS", "Interested"]
  },
  {
    id: "3",
    name: "Maria Oliveira",
    email: "maria@corp.com",
    phone: "(11) 7777-7777",
    company: "BigCorp",
    status: "cold",
    score: 45,
    lastInteraction: "1 semana atrás",
    nextFollowUp: "Próxima semana",
    tags: ["Enterprise"]
  }
];

export function CRMContactsWidget() {
  const [contacts] = useState<Contact[]>(mockContacts);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<string>("all");

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.company.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = selectedFilter === "all" || contact.status === selectedFilter;
    
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "hot": return "bg-red-100 text-red-800";
      case "warm": return "bg-yellow-100 text-yellow-800";
      case "cold": return "bg-blue-100 text-blue-800";
      case "new": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "hot": return "Quente";
      case "warm": return "Morno";
      case "cold": return "Frio";
      case "new": return "Novo";
      default: return status;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const totalContacts = contacts.length;
  const hotContacts = contacts.filter(c => c.status === "hot").length;
  const avgScore = contacts.reduce((sum, c) => sum + c.score, 0) / contacts.length;
  const followUpsToday = contacts.filter(c => c.nextFollowUp.includes("Hoje")).length;

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Gestão de Contatos
            </CardTitle>
            <CardDescription>
              Perfil 360° dos seus clientes e prospects
            </CardDescription>
          </div>
          <Button size="sm">
            <UserPlus className="h-4 w-4 mr-1" />
            Novo Contato
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="contacts">Contatos</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total</p>
                    <p className="text-lg font-bold text-blue-600">{totalContacts}</p>
                  </div>
                  <Users className="h-8 w-8 text-blue-500" />
                </div>
              </div>
              
              <div className="bg-red-50 p-3 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Quentes</p>
                    <p className="text-lg font-bold text-red-600">{hotContacts}</p>
                  </div>
                  <Star className="h-8 w-8 text-red-500" />
                </div>
              </div>
              
              <div className="bg-green-50 p-3 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Score Médio</p>
                    <p className="text-lg font-bold text-green-600">{avgScore.toFixed(0)}</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-500" />
                </div>
              </div>
              
              <div className="bg-orange-50 p-3 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Follow-ups Hoje</p>
                    <p className="text-lg font-bold text-orange-600">{followUpsToday}</p>
                  </div>
                  <Calendar className="h-8 w-8 text-orange-500" />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-sm">Próximos Follow-ups</h4>
              {contacts.filter(c => c.nextFollowUp.includes("Hoje")).slice(0, 3).map((contact) => (
                <div key={contact.id} className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                        <Users className="h-5 w-5 text-orange-600" />
                      </div>
                      <div>
                        <p className="font-medium">{contact.name}</p>
                        <p className="text-sm text-gray-600">{contact.company}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-orange-600">
                        {contact.nextFollowUp}
                      </p>
                      <Badge className={getStatusColor(contact.status)}>
                        {getStatusLabel(contact.status)}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="contacts" className="space-y-4">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar contatos..."
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
              {["all", "hot", "warm", "cold", "new"].map((filter) => (
                <Button
                  key={filter}
                  variant={selectedFilter === filter ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedFilter(filter)}
                >
                  {filter === "all" ? "Todos" : getStatusLabel(filter)}
                </Button>
              ))}
            </div>

            <div className="space-y-3">
              {filteredContacts.map((contact) => (
                <div key={contact.id} className="p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <Users className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{contact.name}</h4>
                        <p className="text-sm text-gray-600">{contact.company}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <p className={`font-bold ${getScoreColor(contact.score)}`}>
                          {contact.score}
                        </p>
                        <p className="text-xs text-gray-500">Score</p>
                      </div>
                      <Badge className={getStatusColor(contact.status)}>
                        {getStatusLabel(contact.status)}
                      </Badge>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span className="truncate">{contact.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span>{contact.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span>Última: {contact.lastInteraction}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-gray-400" />
                      <span>Próximo: {contact.nextFollowUp}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 mt-3">
                    {contact.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
