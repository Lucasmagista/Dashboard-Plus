"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export default function AutomationReports() {
  // Aqui você pode buscar e exibir métricas e gráficos reais
  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>Relatórios de Automação</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground">Nenhum relatório disponível.</div>
        </CardContent>
      </Card>
    </div>
  )
}
