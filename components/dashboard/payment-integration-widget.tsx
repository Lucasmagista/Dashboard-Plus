"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreditCard, DollarSign, TrendingUp, CheckCircle, AlertCircle, Settings } from "lucide-react";

interface PaymentProvider {
  id: string;
  name: string;
  type: "gateway" | "digital_wallet" | "bank";
  status: "active" | "inactive" | "pending";
  transactions: number;
  volume: number;
  fee: number;
}

const mockProviders: PaymentProvider[] = [
  {
    id: "1",
    name: "Stripe",
    type: "gateway",
    status: "active",
    transactions: 1234,
    volume: 45680.50,
    fee: 3.2
  },
  {
    id: "2",
    name: "PayPal",
    type: "digital_wallet",
    status: "active",
    transactions: 987,
    volume: 28340.30,
    fee: 4.1
  },
  {
    id: "3",
    name: "PagSeguro",
    type: "gateway",
    status: "pending",
    transactions: 0,
    volume: 0,
    fee: 3.8
  }
];

export function PaymentIntegrationWidget() {
  const [providers] = useState<PaymentProvider[]>(mockProviders);

  const totalVolume = providers.reduce((sum, provider) => sum + provider.volume, 0);
  const totalTransactions = providers.reduce((sum, provider) => sum + provider.transactions, 0);
  const activeProviders = providers.filter(p => p.status === "active").length;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active": return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "pending": return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      default: return <AlertCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "gateway": return "Gateway";
      case "digital_wallet": return "Carteira Digital";
      case "bank": return "Banco";
      default: return type;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "active": return "Ativo";
      case "pending": return "Pendente";
      default: return "Inativo";
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Integrações de Pagamento
            </CardTitle>
            <CardDescription>
              Provedores de pagamento conectados
            </CardDescription>
          </div>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-1" />
            Gerenciar
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-green-50 p-3 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Volume Total</p>
                <p className="text-lg font-bold text-green-600">
                  R$ {totalVolume.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </div>
          
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Transações</p>
                <p className="text-lg font-bold text-blue-600">{totalTransactions}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-purple-50 p-3 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Provedores Ativos</p>
                <p className="text-lg font-bold text-purple-600">
                  {activeProviders}/{providers.length}
                </p>
              </div>
              <CreditCard className="h-8 w-8 text-purple-500" />
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="font-semibold text-sm">Provedores Configurados</h4>
          {providers.map((provider) => (
            <div key={provider.id} className="p-3 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <CreditCard className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <h5 className="font-semibold">{provider.name}</h5>
                    <p className="text-sm text-gray-600">{getTypeLabel(provider.type)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(provider.status)}
                  <Badge variant={provider.status === "active" ? "default" : "secondary"}>
                    {getStatusLabel(provider.status)}
                  </Badge>
                </div>
              </div>
              
              {provider.status === "active" && (
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Transações:</span>
                    <span className="font-medium ml-1">{provider.transactions}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Volume:</span>
                    <span className="font-medium ml-1">
                      R$ {provider.volume.toLocaleString('pt-BR')}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Taxa:</span>
                    <span className="font-medium ml-1">{provider.fee}%</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="pt-2 border-t">
          <Button className="w-full" variant="outline">
            <CreditCard className="h-4 w-4 mr-2" />
            Adicionar Novo Provedor
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
