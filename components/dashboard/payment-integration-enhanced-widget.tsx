"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  CreditCard, 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  CheckCircle, 
  AlertTriangle, 
  Clock,
  Repeat,
  QrCode,
  Shield,
  Zap,
  RefreshCw
} from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

interface PaymentProvider {
  id: string
  name: string
  type: 'gateway' | 'digital' | 'crypto' | 'bank'
  icon: any
  connected: boolean
  fees: number
  dailyLimit: number
  monthlyVolume: number
  status: 'active' | 'inactive' | 'maintenance'
  features: string[]
}

interface Transaction {
  id: string
  amount: number
  currency: string
  method: string
  status: 'success' | 'pending' | 'failed' | 'refunded'
  customer: string
  date: Date
  provider: string
  fees: number
}

interface RecurringPayment {
  id: string
  planName: string
  amount: number
  frequency: 'monthly' | 'yearly' | 'weekly'
  customers: number
  nextCharge: Date
  status: 'active' | 'paused' | 'cancelled'
}

export const PaymentIntegrationWidget: React.FC = () => {
  const [providers, setProviders] = useState<PaymentProvider[]>([
    {
      id: 'stripe',
      name: 'Stripe',
      type: 'gateway',
      icon: CreditCard,
      connected: true,
      fees: 2.9,
      dailyLimit: 100000,
      monthlyVolume: 850000,
      status: 'active',
      features: ['Cartões', 'PIX', 'Boleto', 'Assinaturas']
    },
    {
      id: 'mercadopago',
      name: 'Mercado Pago',
      type: 'gateway',
      icon: DollarSign,
      connected: true,
      fees: 3.5,
      dailyLimit: 50000,
      monthlyVolume: 320000,
      status: 'active',
      features: ['PIX', 'Cartões', 'Boleto', 'Parcelamento']
    },
    {
      id: 'pix',
      name: 'PIX Automático',
      type: 'bank',
      icon: QrCode,
      connected: true,
      fees: 0,
      dailyLimit: 1000000,
      monthlyVolume: 1200000,
      status: 'active',
      features: ['Transferência instantânea', 'QR Code', '24/7']
    },
    {
      id: 'paypal',
      name: 'PayPal',
      type: 'digital',
      icon: Shield,
      connected: false,
      fees: 4.4,
      dailyLimit: 25000,
      monthlyVolume: 0,
      status: 'inactive',
      features: ['Internacional', 'Proteção ao comprador', 'Cartões']
    }
  ])

  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: '1',
      amount: 1250.00,
      currency: 'BRL',
      method: 'PIX',
      status: 'success',
      customer: 'João Silva',
      date: new Date(Date.now() - 5 * 60 * 1000),
      provider: 'pix',
      fees: 0
    },
    {
      id: '2',
      amount: 850.00,
      currency: 'BRL',
      method: 'Cartão de Crédito',
      status: 'success',
      customer: 'Maria Santos',
      date: new Date(Date.now() - 15 * 60 * 1000),
      provider: 'stripe',
      fees: 24.65
    },
    {
      id: '3',
      amount: 2100.00,
      currency: 'BRL',
      method: 'Boleto',
      status: 'pending',
      customer: 'TechCorp Ltd.',
      date: new Date(Date.now() - 60 * 60 * 1000),
      provider: 'mercadopago',
      fees: 3.50
    }
  ])

  const [recurringPayments, setRecurringPayments] = useState<RecurringPayment[]>([
    {
      id: '1',
      planName: 'CRM Pro Mensal',
      amount: 149.90,
      frequency: 'monthly',
      customers: 125,
      nextCharge: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      status: 'active'
    },
    {
      id: '2',
      planName: 'CRM Enterprise Anual',
      amount: 1599.90,
      frequency: 'yearly',
      customers: 15,
      nextCharge: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      status: 'active'
    }
  ])

  const [chartData] = useState([
    { name: 'Jan', stripe: 45000, mercadopago: 32000, pix: 85000 },
    { name: 'Fev', stripe: 52000, mercadopago: 28000, pix: 92000 },
    { name: 'Mar', stripe: 48000, mercadopago: 35000, pix: 98000 },
    { name: 'Abr', stripe: 61000, mercadopago: 42000, pix: 105000 },
    { name: 'Mai', stripe: 55000, mercadopago: 38000, pix: 115000 },
    { name: 'Jun', stripe: 67000, mercadopago: 45000, pix: 125000 }
  ])

  const [pieData] = useState([
    { name: 'PIX', value: 45, color: '#00ff00' },
    { name: 'Cartão', value: 35, color: '#0088fe' },
    { name: 'Boleto', value: 15, color: '#ffbb28' },
    { name: 'Outros', value: 5, color: '#ff8042' }
  ])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'pending': return <Clock className="w-4 h-4 text-yellow-500" />
      case 'failed': return <AlertTriangle className="w-4 h-4 text-red-500" />
      case 'refunded': return <RefreshCw className="w-4 h-4 text-blue-500" />
      default: return <Clock className="w-4 h-4 text-gray-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      success: 'default',
      pending: 'secondary',
      failed: 'destructive',
      refunded: 'outline'
    } as const

    const labels = {
      success: 'Aprovado',
      pending: 'Pendente',
      failed: 'Falhou',
      refunded: 'Estornado'
    }

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'secondary'}>
        {labels[status as keyof typeof labels] || status}
      </Badge>
    )
  }

  const totalRevenue = transactions
    .filter(t => t.status === 'success')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalFees = transactions
    .filter(t => t.status === 'success')
    .reduce((sum, t) => sum + t.fees, 0)

  const recurringRevenue = recurringPayments
    .filter(p => p.status === 'active')
    .reduce((sum, p) => sum + (p.amount * p.customers), 0)

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="w-5 h-5" />
          Integração de Pagamentos
        </CardTitle>
        <CardDescription>
          Gateways de pagamento e processamento de transações
        </CardDescription>
      </CardHeader>

      <CardContent>
        {/* Métricas principais */}
        <div className="grid gap-4 md:grid-cols-3 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium">Receita Total</span>
              </div>
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(totalRevenue)}
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <TrendingUp className="w-3 h-3 text-green-500" />
                +12.5% vs mês anterior
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Repeat className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium">Receita Recorrente</span>
              </div>
              <div className="text-2xl font-bold text-blue-600">
                {formatCurrency(recurringRevenue)}
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <TrendingUp className="w-3 h-3 text-green-500" />
                +8.3% vs mês anterior
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <span className="text-sm font-medium">Taxas Totais</span>
              </div>
              <div className="text-2xl font-bold text-red-600">
                {formatCurrency(totalFees)}
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <TrendingDown className="w-3 h-3 text-red-500" />
                -2.1% vs mês anterior
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="providers" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="providers">Provedores</TabsTrigger>
            <TabsTrigger value="transactions">Transações</TabsTrigger>
            <TabsTrigger value="recurring">Recorrentes</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Provedores de Pagamento */}
          <TabsContent value="providers" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {providers.map(provider => (
                <Card key={provider.id} className={`${
                  provider.connected ? 'border-green-200 bg-green-50/50' : 'border-gray-200'
                }`}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <provider.icon className="w-5 h-5" />
                        <span className="font-medium">{provider.name}</span>
                      </div>
                      <Badge 
                        variant={provider.status === 'active' ? 'default' : 'secondary'}
                      >
                        {provider.status === 'active' ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </div>

                    {provider.connected && (
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Taxa:</span>
                            <div className="font-medium">{provider.fees}%</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Volume mensal:</span>
                            <div className="font-medium">
                              {formatCurrency(provider.monthlyVolume)}
                            </div>
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Limite diário</span>
                            <span>
                              {formatCurrency(provider.monthlyVolume / 30)} / {formatCurrency(provider.dailyLimit)}
                            </span>
                          </div>
                          <Progress 
                            value={(provider.monthlyVolume / 30 / provider.dailyLimit) * 100} 
                            className="h-2"
                          />
                        </div>

                        <div className="flex flex-wrap gap-1">
                          {provider.features.map((feature, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2 mt-4">
                      <Button
                        size="sm"
                        variant={provider.connected ? "outline" : "default"}
                        className="flex-1"
                      >
                        {provider.connected ? 'Configurar' : 'Conectar'}
                      </Button>
                      {provider.connected && (
                        <Button size="sm" variant="ghost">
                          <Zap className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Transações Recentes */}
          <TabsContent value="transactions" className="space-y-4">
            <div className="space-y-3">
              {transactions.map(transaction => (
                <Card key={transaction.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-muted rounded">
                          {getStatusIcon(transaction.status)}
                        </div>
                        <div>
                          <h4 className="font-medium">{transaction.customer}</h4>
                          <p className="text-sm text-muted-foreground">
                            {transaction.method} • {transaction.provider}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">
                          {formatCurrency(transaction.amount)}
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(transaction.status)}
                          {transaction.fees > 0 && (
                            <span className="text-xs text-muted-foreground">
                              Taxa: {formatCurrency(transaction.fees)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Pagamentos Recorrentes */}
          <TabsContent value="recurring" className="space-y-4">
            <div className="space-y-3">
              {recurringPayments.map(payment => (
                <Card key={payment.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded">
                          <Repeat className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">{payment.planName}</h4>
                          <p className="text-sm text-muted-foreground">
                            {payment.customers} clientes • {payment.frequency}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">
                          {formatCurrency(payment.amount * payment.customers)}/mês
                        </div>
                        <Badge variant={payment.status === 'active' ? 'default' : 'secondary'}>
                          {payment.status === 'active' ? 'Ativo' : 'Pausado'}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Analytics */}
          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Volume por Gateway</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip 
                        formatter={(value: any) => [formatCurrency(value), '']}
                      />
                      <Line type="monotone" dataKey="pix" stroke="#00ff00" strokeWidth={2} />
                      <Line type="monotone" dataKey="stripe" stroke="#0088fe" strokeWidth={2} />
                      <Line type="monotone" dataKey="mercadopago" stroke="#ffbb28" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Métodos de Pagamento</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label={({ name, value }) => `${name} ${value}%`}
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
