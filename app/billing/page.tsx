"use client"

import { useState } from "react"
import { useSwipeNavigation } from "@/hooks/use-swipe-navigation"
import { MAIN_ROUTES } from "@/lib/main-routes"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { CreditCard, Download, AlertCircle, CheckCircle, Clock, Settings, Crown } from "lucide-react"

const currentPlan = {
  name: "Empresarial",
  price: 299,
  billing: "mensal",
  features: [
    "Contatos ilimitados",
    "Análises avançadas",
    "Integrações personalizadas",
    "Suporte prioritário",
    "Opções de marca branca",
    "Acesso à API",
    "Segurança avançada",
    "Workflows personalizados",
  ],
  usage: {
    contacts: { used: 2847, limit: "ilimitado" },
    storage: { used: 45.2, limit: 100 },
    apiCalls: { used: 15420, limit: 50000 },
    users: { used: 8, limit: 25 },
  },
}

const plans = [
  {
    name: "Iniciante",
    price: 29,
    yearlyPrice: 290,
    description: "Perfeito para pequenas equipes iniciando",
    features: ["Até 1.000 contatos", "Análises básicas", "Suporte por e-mail", "5 integrações", "2 usuários"],
    popular: false,
  },
  {
    name: "Profissional",
    price: 99,
    yearlyPrice: 990,
    description: "Ideal para empresas em crescimento",
    features: [
      "Até 10.000 contatos",
      "Análises avançadas",
      "Suporte prioritário",
      "20 integrações",
      "10 usuários",
      "Workflows personalizados",
    ],
    popular: true,
  },
  {
    name: "Empresarial",
    price: 299,
    yearlyPrice: 2990,
    description: "Para grandes organizações com necessidades complexas",
    features: [
      "Contatos ilimitados",
      "Análises avançadas",
      "Suporte telefônico 24/7",
      "Integrações ilimitadas",
      "25 usuários",
      "Integrações personalizadas",
      "Opções de marca branca",
    ],
    popular: false,
  },
]

const invoices = [
  {
    id: "FAT-2024-001",
    date: "2024-01-01",
    amount: 299,
    status: "paid",
    description: "Plano Empresarial - Janeiro 2024",
  },
  {
    id: "FAT-2023-012",
    date: "2023-12-01",
    amount: 299,
    status: "paid",
    description: "Plano Empresarial - Dezembro 2023",
  },
  {
    id: "FAT-2023-011",
    date: "2023-11-01",
    amount: 299,
    status: "paid",
    description: "Plano Empresarial - Novembro 2023",
  },
  {
    id: "FAT-2023-010",
    date: "2023-10-01",
    amount: 299,
    status: "paid",
    description: "Plano Empresarial - Outubro 2023",
  },
]

const paymentMethods = [
  {
    id: 1,
    type: "card",
    last4: "4242",
    brand: "Visa",
    expiryMonth: 12,
    expiryYear: 2025,
    isDefault: true,
  },
  {
    id: 2,
    type: "card",
    last4: "5555",
    brand: "Mastercard",
    expiryMonth: 8,
    expiryYear: 2026,
    isDefault: false,
  },
]

export default function BillingPage() {
  // Swipe navigation entre rotas principais
  const bindSwipe = useSwipeNavigation(MAIN_ROUTES)
  const [isUpgradeDialogOpen, setIsUpgradeDialogOpen] = useState(false)
  const [isAddPaymentOpen, setIsAddPaymentOpen] = useState(false)
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly")
  const [selectedPlan, setSelectedPlan] = useState(currentPlan.name)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "failed":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "paid":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />
      case "failed":
        return <AlertCircle className="h-4 w-4 text-red-600" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />
    }
  }

  return (
    <SidebarInset {...bindSwipe()}>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/">Painel</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Faturamento</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Faturamento</h1>
            <p className="text-muted-foreground">Gerencie sua assinatura, cobranças e métodos de pagamento</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Baixar Fatura
            </Button>
            <Dialog open={isUpgradeDialogOpen} onOpenChange={setIsUpgradeDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Crown className="mr-2 h-4 w-4" />
                  Fazer Upgrade
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[900px] p-0 overflow-hidden bg-gradient-to-br from-blue-50 via-white to-white border-0 shadow-2xl">
                <DialogHeader className="px-8 pt-8 pb-2">
                  <DialogTitle className="text-3xl font-bold mb-1 flex items-center gap-2">
                    <Crown className="h-7 w-7 text-yellow-500" /> Escolha seu Plano
                  </DialogTitle>
                  <DialogDescription className="text-lg text-muted-foreground">Selecione o plano que melhor atende suas necessidades.</DialogDescription>
                </DialogHeader>
                <div className="px-8 pb-8">
                  <div className="flex items-center justify-center gap-4 mb-8">
                    <Button
                      variant={billingCycle === "monthly" ? "default" : "outline"}
                      className={`rounded-full px-6 py-2 text-base font-semibold ${billingCycle === "monthly" ? "ring-2 ring-primary" : ""}`}
                      onClick={() => setBillingCycle("monthly")}
                    >
                      Mensal
                    </Button>
                    <Button
                      variant={billingCycle === "yearly" ? "default" : "outline"}
                      className={`rounded-full px-6 py-2 text-base font-semibold ${billingCycle === "yearly" ? "ring-2 ring-primary" : ""}`}
                      onClick={() => setBillingCycle("yearly")}
                    >
                      Anual <span className="ml-2 text-green-600 font-bold">(Economize 20%)</span>
                    </Button>
                  </div>
                  <div className="grid gap-8 md:grid-cols-3">
                    {plans.map((plan) => {
                      const isCurrent = plan.name === currentPlan.name;
                      const isSelected = selectedPlan === plan.name;
                      return (
                        <Card
                          key={plan.name}
                          className={`relative group transition-all duration-200 border-2 ${isSelected ? "border-primary shadow-xl scale-105" : "border-gray-200 hover:border-primary/60 hover:shadow-lg"} ${isCurrent ? "opacity-80" : ""}`}
                          onClick={() => !isCurrent && setSelectedPlan(plan.name)}
                          style={{ cursor: isCurrent ? "not-allowed" : "pointer" }}
                        >
                          {plan.popular && (
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                              <span className="inline-block bg-gradient-to-r from-primary to-blue-500 text-white text-xs font-bold px-4 py-1 rounded-full shadow-lg border-2 border-white">Mais Popular</span>
                            </div>
                          )}
                          <CardHeader className="text-center pb-2 pt-8">
                            <CardTitle className="text-2xl font-bold mb-2">{plan.name}</CardTitle>
                            <div className="text-4xl font-extrabold mb-1">
                              R$ {billingCycle === "monthly" ? plan.price : plan.yearlyPrice}
                              <span className="text-base font-normal text-muted-foreground">/{billingCycle === "monthly" ? "mês" : "ano"}</span>
                            </div>
                            <CardDescription className="text-base mb-2">{plan.description}</CardDescription>
                          </CardHeader>
                          <CardContent className="pb-4">
                            <ul className="space-y-3 text-base">
                              {plan.features.map((feature, index) => (
                                <li key={index} className="flex items-center gap-2">
                                  <CheckCircle className="h-5 w-5 text-green-600" />
                                  <span>{feature}</span>
                                </li>
                              ))}
                            </ul>
                            <Button
                              className={`w-full mt-6 py-3 text-lg font-bold rounded-lg transition-all duration-150 ${isCurrent ? "bg-zinc-800 text-gray-500 cursor-not-allowed dark:bg-zinc-900" : isSelected ? "bg-primary text-white shadow-lg" : "bg-zinc-900 text-primary border border-primary hover:bg-primary hover:text-white dark:bg-zinc-900"}`}
                              variant={isCurrent ? "outline" : isSelected ? "default" : "outline"}
                              disabled={isCurrent}
                              onClick={e => { e.stopPropagation(); if (!isCurrent) setSelectedPlan(plan.name); }}
                            >
                              {isCurrent ? "Plano Atual" : isSelected ? "Selecionado" : "Selecionar Plano"}
                            </Button>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                  <div className="flex justify-end mt-8 gap-2">
                    <Button variant="outline" size="lg" className="px-8 py-2 text-base" onClick={() => setIsUpgradeDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button
                      size="lg"
                      className="px-8 py-2 text-base font-bold"
                      disabled={selectedPlan === currentPlan.name}
                      onClick={() => setIsUpgradeDialogOpen(false)}
                    >
                      Confirmar Upgrade
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Current Plan Overview */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center space-x-2">
                  <Crown className="h-5 w-5 text-yellow-500" />
                  <span>Plano {currentPlan.name}</span>
                </CardTitle>
                <CardDescription>
                  R$ {currentPlan.price}/{currentPlan.billing} • Próxima cobrança: 1 de fevereiro de 2024
                </CardDescription>
              </div>
              <Badge className="bg-green-100 text-green-800">Ativo</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h4 className="text-sm font-medium mb-3">Recursos do Plano</h4>
                <ul className="space-y-2 text-sm">
                  {currentPlan.features.map((feature, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-3">Resumo de Uso</h4>
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm">Contatos</span>
                      <span className="text-sm font-medium">
                        {currentPlan.usage.contacts.used.toLocaleString()} / {currentPlan.usage.contacts.limit}
                      </span>
                    </div>
                    {currentPlan.usage.contacts.limit !== "ilimitado" && (
                      <Progress value={(currentPlan.usage.contacts.used / 10000) * 100} className="h-2" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm">Armazenamento</span>
                      <span className="text-sm font-medium">
                        {currentPlan.usage.storage.used} GB / {currentPlan.usage.storage.limit} GB
                      </span>
                    </div>
                    <Progress
                      value={(currentPlan.usage.storage.used / currentPlan.usage.storage.limit) * 100}
                      className="h-2"
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm">Chamadas de API</span>
                      <span className="text-sm font-medium">
                        {currentPlan.usage.apiCalls.used.toLocaleString()} / {currentPlan.usage.apiCalls.limit.toLocaleString()}
                      </span>
                    </div>
                    <Progress
                      value={(currentPlan.usage.apiCalls.used / currentPlan.usage.apiCalls.limit) * 100}
                      className="h-2"
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm">Usuários</span>
                      <span className="text-sm font-medium">
                        {currentPlan.usage.users.used} / {currentPlan.usage.users.limit}
                      </span>
                    </div>
                    <Progress
                      value={(currentPlan.usage.users.used / currentPlan.usage.users.limit) * 100}
                      className="h-2"
                    />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="invoices" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="invoices">Faturas</TabsTrigger>
            <TabsTrigger value="payment-methods">Métodos de Pagamento</TabsTrigger>
            <TabsTrigger value="usage">Detalhes de Uso</TabsTrigger>
          </TabsList>

          <TabsContent value="invoices" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Histórico de Faturas</CardTitle>
                <CardDescription>Visualize e baixe suas faturas anteriores</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Fatura</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Descrição</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoices.map((invoice) => (
                      <TableRow key={invoice.id}>
                        <TableCell className="font-medium">{invoice.id}</TableCell>
                        <TableCell>{new Date(invoice.date).toLocaleDateString()}</TableCell>
                        <TableCell>{invoice.description}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(invoice.status)}
                            <Badge className={getStatusColor(invoice.status)}>{invoice.status === "paid" ? "Paga" : invoice.status}</Badge>
                          </div>
                        </TableCell>
                        <TableCell>R$ {invoice.amount}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4 mr-1" />
                            Baixar
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payment-methods" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Métodos de Pagamento</CardTitle>
                    <CardDescription>Gerencie seus métodos de pagamento e informações de cobrança</CardDescription>
                  </div>
                  <Dialog open={isAddPaymentOpen} onOpenChange={setIsAddPaymentOpen}>
                    <DialogTrigger asChild>
                      <Button>Adicionar Método</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Adicionar Método de Pagamento</DialogTitle>
                        <DialogDescription>Adicione um novo cartão de crédito ou débito à sua conta.</DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="card-number" className="text-right">
                            Número do Cartão
                          </Label>
                          <Input id="card-number" placeholder="1234 5678 9012 3456" className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="expiry" className="text-right">
                            Validade
                          </Label>
                          <Input id="expiry" placeholder="MM/AA" className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="cvc" className="text-right">
                            CVC
                          </Label>
                          <Input id="cvc" placeholder="123" className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="name" className="text-right">
                            Nome no Cartão
                          </Label>
                          <Input id="name" placeholder="João da Silva" className="col-span-3" />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="submit" onClick={() => setIsAddPaymentOpen(false)}>
                          Adicionar Cartão
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {paymentMethods.map((method) => (
                    <div key={method.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100">
                          <CreditCard className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="font-medium">
                            {method.brand} final {method.last4}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Vencimento {method.expiryMonth}/{method.expiryYear}
                          </div>
                        </div>
                        {method.isDefault && <Badge variant="secondary">Padrão</Badge>}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <Settings className="h-4 w-4 mr-1" />
                          Editar
                        </Button>
                        {!method.isDefault && (
                          <Button variant="outline" size="sm">
                            Definir como Padrão
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="usage" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Tendências de Uso Mensal</CardTitle>
                  <CardDescription>Acompanhe seus padrões de uso ao longo do tempo</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Chamadas de API</span>
                        <span className="text-sm text-muted-foreground">15.420 / 50.000</span>
                      </div>
                      <Progress value={30.84} className="h-2" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Armazenamento Utilizado</span>
                        <span className="text-sm text-muted-foreground">45,2 GB / 100 GB</span>
                      </div>
                      <Progress value={45.2} className="h-2" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Usuários Ativos</span>
                        <span className="text-sm text-muted-foreground">8 / 25</span>
                      </div>
                      <Progress value={32} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Alertas de Uso</CardTitle>
                  <CardDescription>Monitore seus limites de uso e receba notificações</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <div>
                        <div className="text-sm font-medium">Todos os sistemas normais</div>
                        <div className="text-xs text-muted-foreground">Uso dentro dos limites</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                      <AlertCircle className="h-5 w-5 text-blue-600" />
                      <div>
                        <div className="text-sm font-medium">Armazenamento em 45%</div>
                        <div className="text-xs text-muted-foreground">Considere fazer upgrade se o uso aumentar</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Detalhamento de Uso</CardTitle>
                <CardDescription>Visão detalhada do consumo de recursos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">2.847</div>
                    <div className="text-sm text-muted-foreground">Total de Contatos</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">15.420</div>
                    <div className="text-sm text-muted-foreground">Chamadas de API no Mês</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">45,2 GB</div>
                    <div className="text-sm text-muted-foreground">Armazenamento Utilizado</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">8</div>
                    <div className="text-sm text-muted-foreground">Usuários Ativos</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </SidebarInset>
  )
}
