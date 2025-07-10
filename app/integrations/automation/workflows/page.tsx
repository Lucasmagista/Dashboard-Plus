"use client"

import Link from "next/link"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function WorkflowsList() {
  // Aqui você pode buscar a lista de workflows do backend
  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>Workflows de Automação</CardTitle>
        </CardHeader>
        <CardContent>
          <Button asChild>
            <Link href="/integrations/automation/workflows/new">Criar Novo Workflow</Link>
          </Button>
          {/* Listagem de workflows */}
          <div className="mt-4">Nenhum workflow cadastrado ainda.</div>
        </CardContent>
      </Card>
    </div>
  )
}
