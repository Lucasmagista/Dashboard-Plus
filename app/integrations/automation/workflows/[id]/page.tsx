"use client"

import { useParams } from "next/navigation"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function WorkflowDetail() {
  const params = useParams();
  const id = params.id;

  // Aqui você pode buscar dados reais do workflow
  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>Detalhes do Workflow #{id}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Configuração, triggers, ações e histórico deste workflow.</p>
          <Button variant="outline">Editar Workflow</Button>
        </CardContent>
      </Card>
    </div>
  )
}
