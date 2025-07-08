"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, Database, TrendingUp, Activity, RefreshCw, Settings, ExternalLink } from "lucide-react";

interface BIConnection {
  id: string;
  name: string;
  platform: "powerbi" | "tableau" | "looker" | "qlik";
  status: "connected" | "disconnected" | "syncing";
  reports: number;
  datasets: number;
  lastSync: string;
  url?: string;
}

const mockConnections: BIConnection[] = [
  {
    id: "1",
    name: "Power BI Workspace",
    platform: "powerbi",
    status: "connected",
    reports: 12,
    datasets: 8,
    lastSync: "5 min atrás",
    url: "https://app.powerbi.com/..."
  },
  {
    id: "2",
    name: "Tableau Server",
    platform: "tableau",
    status: "connected",
    reports: 8,
    datasets: 5,
    lastSync: "15 min atrás",
    url: "https://tableau.company.com/..."
  },
  {
    id: "3",
    name: "Looker Studio",
    platform: "looker",
    status: "disconnected",
    reports: 0,
    datasets: 0,
    lastSync: "Nunca"
  }
];

const platformInfo = {
  powerbi: {
    name: "Power BI",
    icon: "📊",
    color: "bg-yellow-100 text-yellow-800"
  },
  tableau: {
    name: "Tableau",
    icon: "📈",
    color: "bg-blue-100 text-blue-800"
  },
  looker: {
    name: "Looker Studio",
    icon: "📉",
    color: "bg-green-100 text-green-800"
  },
  qlik: {
    name: "Qlik Sense",
    icon: "📋",
    color: "bg-purple-100 text-purple-800"
  }
};

export function BIIntegrationWidget() {
  const [connections, setConnections] = useState<BIConnection[]>(mockConnections);
  const [syncingConnections, setSyncingConnections] = useState<Set<string>>(new Set());

  const connectedBIs = connections.filter(c => c.status === "connected");
  const totalReports = connectedBIs.reduce((sum, c) => sum + c.reports, 0);
  const totalDatasets = connectedBIs.reduce((sum, c) => sum + c.datasets, 0);

  const handleSync = (connectionId: string) => {
    setSyncingConnections(prev => new Set(prev).add(connectionId));
    
    setTimeout(() => {
      updateConnectionStatus(connectionId, "connected", "Agora");
      setSyncingConnections(prev => {
        const newSet = new Set(prev);
        newSet.delete(connectionId);
        return newSet;
      });
    }, 2000);
  };

  const updateConnectionStatus = (connectionId: string, status: "connected" | "disconnected" | "syncing", lastSync: string) => {
    setConnections(prev => prev.map(conn => 
      conn.id === connectionId 
        ? { ...conn, status, lastSync }
        : conn
    ));
  };

  const handleConnect = (connectionId: string) => {
    updateConnectionStatus(connectionId, "connected", "Agora");
    setConnections(prev => prev.map(conn => 
      conn.id === connectionId 
        ? { ...conn, reports: 3, datasets: 2 }
        : conn
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "connected": return "bg-green-100 text-green-800";
      case "syncing": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "connected": return "Conectado";
      case "syncing": return "Sincronizando";
      default: return "Desconectado";
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Integrações de BI
            </CardTitle>
            <CardDescription>
              Plataformas de Business Intelligence conectadas
            </CardDescription>
          </div>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-1" />
            Configurar
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="connections">Conexões</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Relatórios</p>
                    <p className="text-lg font-bold text-blue-600">{totalReports}</p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-blue-500" />
                </div>
              </div>
              
              <div className="bg-green-50 p-3 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Datasets</p>
                    <p className="text-lg font-bold text-green-600">{totalDatasets}</p>
                  </div>
                  <Database className="h-8 w-8 text-green-500" />
                </div>
              </div>
              
              <div className="bg-purple-50 p-3 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Plataformas</p>
                    <p className="text-lg font-bold text-purple-600">
                      {connectedBIs.length}/{connections.length}
                    </p>
                  </div>
                  <Activity className="h-8 w-8 text-purple-500" />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-sm">Relatórios Recentes</h4>
              <div className="space-y-2">
                {connectedBIs.slice(0, 3).map((connection) => (
                  <div key={connection.id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">
                          {platformInfo[connection.platform].icon}
                        </span>
                        <div>
                          <p className="font-medium">{connection.name}</p>
                          <p className="text-sm text-gray-600">
                            {connection.reports} relatórios disponíveis
                          </p>
                        </div>
                      </div>
                      {connection.url && (
                        <Button variant="ghost" size="sm" asChild>
                          <a href={connection.url} target="_blank" rel="noopener noreferrer" title="Abrir no BI">
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="connections" className="space-y-4">
            {connections.map((connection) => (
              <div key={connection.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">
                        {platformInfo[connection.platform].icon}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-semibold">{connection.name}</h4>
                      <p className="text-sm text-gray-600">
                        {platformInfo[connection.platform].name}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(connection.status)}>
                      {getStatusLabel(connection.status)}
                    </Badge>
                    {connection.status === "connected" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSync(connection.id)}
                        disabled={syncingConnections.has(connection.id)}
                      >
                        <RefreshCw className={`h-4 w-4 mr-1 ${syncingConnections.has(connection.id) ? 'animate-spin' : ''}`} />
                        Sincronizar
                      </Button>
                    )}
                    {connection.status === "disconnected" && (
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => handleConnect(connection.id)}
                      >
                        <ExternalLink className="h-4 w-4 mr-1" />
                        Conectar
                      </Button>
                    )}
                  </div>
                </div>
                
                {connection.status === "connected" && (
                  <div className="grid grid-cols-2 gap-4 pt-3 border-t">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-600">Relatórios</p>
                        <p className="font-semibold">{connection.reports}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Database className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-600">Datasets</p>
                        <p className="font-semibold">{connection.datasets}</p>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="text-xs text-gray-500 mt-2">
                  Última sincronização: {connection.lastSync}
                </div>
              </div>
            ))}
          </TabsContent>
        </Tabs>
        
        <div className="pt-4 border-t">
          <Button className="w-full" variant="outline">
            <TrendingUp className="h-4 w-4 mr-2" />
            Conectar Nova Plataforma de BI
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
