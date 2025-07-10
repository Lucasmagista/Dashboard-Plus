"use client"

import { useParams } from "next/navigation"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

export default function IntegrationDetail() {
  const params = useParams();
  const integration = params.integration;

  // Simulação de dados da integração (substitua por fetch real)
  const integrationData = {
    name: integration,
    authenticated: false,
    triggers: [
      { id: 1, name: "Novo Lead", enabled: true },
      { id: 2, name: "Atualização de Status", enabled: false },
    ],
    fields: [
      { id: 1, label: "API Key", value: "", type: "password" },
      { id: 2, label: "Webhook URL", value: "", type: "text" },
    ],
    status: "Não autenticado",
    logs: [
      { id: 1, date: "2025-07-09 10:00", event: "Tentativa de autenticação", result: "Falha" },
      { id: 2, date: "2025-07-08 18:30", event: "Trigger executado", result: "Sucesso" },
    ]
  }

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Configuração da Integração: {integrationData.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-2 text-muted-foreground">Status: <span className="font-semibold">{integrationData.status}</span></p>
          <Separator className="my-4" />
          {/* Autenticação */}
          <form className="space-y-4 mb-4">
            {integrationData.fields.map(field => (
              <div key={field.id}>
                <label className="block text-sm font-medium mb-1">{field.label}</label>
                <input
                  type={field.type}
                  className="border p-2 rounded w-full"
                  placeholder={field.label}
                  value={field.value}
                  // onChange={...}
                />
              </div>
            ))}
            <Button type="submit">{integrationData.authenticated ? "Atualizar Autenticação" : "Autenticar"}</Button>
          </form>
          <Separator className="my-4" />
          {/* Triggers configuráveis */}
          <div className="mb-4">
            <h3 className="font-semibold mb-2">Triggers Disponíveis</h3>
            <ul className="space-y-2">
              {integrationData.triggers.map(trigger => (
                <li key={trigger.id} className="flex items-center justify-between">
                  <span>{trigger.name}</span>
                  <Button size="sm" variant={trigger.enabled ? "default" : "outline"}>
                    {trigger.enabled ? "Desativar" : "Ativar"}
                  </Button>
                </li>
              ))}
            </ul>
          </div>
          <Separator className="my-4" />
          {/* Logs da integração */}
          <div>
            <h3 className="font-semibold mb-2">Logs Recentes</h3>
            <ul className="text-xs text-muted-foreground space-y-1">
              {integrationData.logs.map(log => (
                <li key={log.id}>
                  <span className="font-mono">[{log.date}]</span> {log.event} - <span className={log.result === "Sucesso" ? "text-green-600" : "text-red-600"}>{log.result}</span>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
