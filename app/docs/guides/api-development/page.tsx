"use client";

import React from "react";
import { ArrowLeft, Code, Database, Key, Globe, Clock, Star } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";

export default function APIdevelopmentGuide() {
  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <Link href="/docs/guides">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar aos Guias
          </Button>
        </Link>
        
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 rounded-lg bg-gray-100 dark:bg-gray-900/20">
            <Code className="h-8 w-8 text-gray-600 dark:text-gray-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Desenvolvendo com a API</h1>
            <p className="text-muted-foreground">
              Guia para desenvolvedores integrarem sistemas externos via API REST
            </p>
          </div>
        </div>

        <div className="flex gap-2 mb-6">
          <Badge variant="outline">Desenvolvimento</Badge>
          <Badge className="bg-red-100 text-red-800">Avançado</Badge>
          <Badge variant="secondary">
            <Clock className="h-3 w-3 mr-1" />
            45 min
          </Badge>
          <Badge variant="secondary">
            <Star className="h-3 w-3 mr-1" />
            4.5
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="auth" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="auth">Autenticação</TabsTrigger>
          <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
          <TabsTrigger value="sdks">SDKs</TabsTrigger>
        </TabsList>

        <TabsContent value="auth" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                Autenticação por API Key
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-muted">
                  <code className="text-sm">
                    Authorization: Bearer your_api_key_here
                  </code>
                </div>
                <p className="text-sm text-muted-foreground">
                  Inclua seu token de API no header Authorization de todas as requisições.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="endpoints" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Endpoints Principais
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 rounded-lg border">
                  <div className="font-semibold">GET /api/v1/contacts</div>
                  <div className="text-sm text-muted-foreground">Listar contatos</div>
                </div>
                <div className="p-4 rounded-lg border">
                  <div className="font-semibold">POST /api/v1/contacts</div>
                  <div className="text-sm text-muted-foreground">Criar novo contato</div>
                </div>
                <div className="p-4 rounded-lg border">
                  <div className="font-semibold">PUT /api/v1/contacts/:id</div>
                  <div className="text-sm text-muted-foreground">Atualizar contato</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="webhooks" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Configuração de Webhooks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Globe className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Configure webhooks para receber notificações em tempo real
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sdks" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>SDKs Disponíveis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="p-4 rounded-lg border text-center">
                  <div className="font-semibold">JavaScript/Node.js</div>
                  <div className="text-sm text-muted-foreground">SDK oficial</div>
                </div>
                <div className="p-4 rounded-lg border text-center">
                  <div className="font-semibold">Python</div>
                  <div className="text-sm text-muted-foreground">SDK oficial</div>
                </div>
                <div className="p-4 rounded-lg border text-center">
                  <div className="font-semibold">PHP</div>
                  <div className="text-sm text-muted-foreground">SDK oficial</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
