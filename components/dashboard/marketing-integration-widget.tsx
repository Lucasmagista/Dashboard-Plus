"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mail, Users, BarChart3, TrendingUp, ExternalLink, Settings } from "lucide-react";

interface MarketingPlatform {
  id: string;
  name: string;
  type: "email" | "social" | "ads" | "automation";
  status: "connected" | "disconnected";
  subscribers?: number;
  campaigns?: number;
  engagement?: number;
  spend?: number;
}

const mockPlatforms: MarketingPlatform[] = [
  {
    id: "1",
    name: "Mailchimp",
    type: "email",
    status: "connected",
    subscribers: 12500,
    campaigns: 24,
    engagement: 23.5
  },
  {
    id: "2",
    name: "HubSpot",
    type: "automation",
    status: "connected",
    subscribers: 8900,
    campaigns: 15,
    engagement: 28.7
  },
  {
    id: "3",
    name: "Facebook Ads",
    type: "ads",
    status: "connected",
    spend: 5680.50,
    campaigns: 8,
    engagement: 12.3
  },
  {
    id: "4",
    name: "RD Station",
    type: "automation",
    status: "disconnected",
    subscribers: 0,
    campaigns: 0,
    engagement: 0
  }
];

export function MarketingIntegrationWidget() {
  const [platforms] = useState<MarketingPlatform[]>(mockPlatforms);

  const connectedPlatforms = platforms.filter(p => p.status === "connected");
  const totalSubscribers = connectedPlatforms.reduce((sum, p) => sum + (p.subscribers || 0), 0);
  const totalCampaigns = connectedPlatforms.reduce((sum, p) => sum + (p.campaigns || 0), 0);
  const totalSpend = connectedPlatforms.reduce((sum, p) => sum + (p.spend || 0), 0);
  const avgEngagement = connectedPlatforms.length > 0 
    ? connectedPlatforms.reduce((sum, p) => sum + (p.engagement || 0), 0) / connectedPlatforms.length
    : 0;

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "email": return <Mail className="h-5 w-5 text-blue-500" />;
      case "social": return <Users className="h-5 w-5 text-purple-500" />;
      case "ads": return <BarChart3 className="h-5 w-5 text-red-500" />;
      case "automation": return <TrendingUp className="h-5 w-5 text-green-500" />;
      default: return <Mail className="h-5 w-5 text-gray-500" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "email": return "Email Marketing";
      case "social": return "Redes Sociais";
      case "ads": return "Publicidade";
      case "automation": return "Automação";
      default: return type;
    }
  };

  const getPlatformMetrics = (platform: MarketingPlatform) => {
    const metrics = [];
    
    if (platform.subscribers) {
      metrics.push({
        label: "Assinantes",
        value: platform.subscribers.toLocaleString('pt-BR'),
        icon: <Users className="h-4 w-4" />
      });
    }
    
    if (platform.campaigns) {
      metrics.push({
        label: "Campanhas",
        value: platform.campaigns.toString(),
        icon: <Mail className="h-4 w-4" />
      });
    }
    
    if (platform.engagement) {
      metrics.push({
        label: "Engajamento",
        value: `${platform.engagement.toFixed(1)}%`,
        icon: <TrendingUp className="h-4 w-4" />
      });
    }
    
    if (platform.spend) {
      metrics.push({
        label: "Investimento",
        value: `R$ ${platform.spend.toLocaleString('pt-BR')}`,
        icon: <BarChart3 className="h-4 w-4" />
      });
    }
    
    return metrics;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Integrações de Marketing
            </CardTitle>
            <CardDescription>
              Plataformas de marketing conectadas
            </CardDescription>
          </div>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-1" />
            Configurar
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Assinantes</p>
                <p className="text-lg font-bold text-blue-600">
                  {totalSubscribers.toLocaleString('pt-BR')}
                </p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-green-50 p-3 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Campanhas</p>
                <p className="text-lg font-bold text-green-600">{totalCampaigns}</p>
              </div>
              <Mail className="h-8 w-8 text-green-500" />
            </div>
          </div>
          
          <div className="bg-purple-50 p-3 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Engajamento</p>
                <p className="text-lg font-bold text-purple-600">
                  {avgEngagement.toFixed(1)}%
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-500" />
            </div>
          </div>
          
          <div className="bg-red-50 p-3 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Investimento</p>
                <p className="text-lg font-bold text-red-600">
                  R$ {totalSpend.toLocaleString('pt-BR')}
                </p>
              </div>
              <BarChart3 className="h-8 w-8 text-red-500" />
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="font-semibold text-sm">Plataformas Conectadas</h4>
          {platforms.map((platform) => (
            <div key={platform.id} className="p-3 border rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center">
                    {getTypeIcon(platform.type)}
                  </div>
                  <div>
                    <h5 className="font-semibold">{platform.name}</h5>
                    <p className="text-sm text-gray-600">{getTypeLabel(platform.type)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={platform.status === "connected" ? "default" : "secondary"}>
                    {platform.status === "connected" ? "Conectado" : "Desconectado"}
                  </Badge>
                  {platform.status === "disconnected" && (
                    <Button variant="outline" size="sm">
                      <ExternalLink className="h-4 w-4 mr-1" />
                      Conectar
                    </Button>
                  )}
                </div>
              </div>
              
              {platform.status === "connected" && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {getPlatformMetrics(platform).map((metric) => (
                    <div key={metric.label} className="flex items-center gap-2 text-sm">
                      <span className="text-gray-500">{metric.icon}</span>
                      <div>
                        <p className="text-gray-600">{metric.label}:</p>
                        <p className="font-medium">{metric.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="pt-2 border-t">
          <Button className="w-full" variant="outline">
            <Mail className="h-4 w-4 mr-2" />
            Conectar Nova Plataforma
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
