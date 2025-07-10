"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export default function AutomationLogs() {
  // Aqui você pode buscar logs reais do backend
  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>Logs de Execução</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground">Nenhum log encontrado.</div>
        </CardContent>
      </Card>
    </div>
  )
}
