"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function WorkflowCreate() {
  // Formulário para criar workflow
  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>Criar Novo Workflow</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            {/* Campos: nome, integração, triggers, ações, condições, etc */}
            <input className="border p-2 w-full" placeholder="Nome do Workflow" />
            <select className="border p-2 w-full">
              <option>Selecione a Integração</option>
              <option>Zapier</option>
              <option>n8n</option>
              <option>Power Automate</option>
              <option>IFTTT</option>
            </select>
            {/* Adicione campos para triggers, ações, condições */}
            <Button type="submit">Salvar Workflow</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
