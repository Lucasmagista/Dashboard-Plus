"use client"

import { useState } from "react"
import { 
  Layers, 
  ArrowLeft, 
  Palette, 
  Type, 
  Layout, 
  Zap, 
  Copy, 
  Check,
  Eye,
  Code,
  Download
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"

const colors = {
  primary: {
    50: "#eff6ff",
    100: "#dbeafe", 
    200: "#bfdbfe",
    300: "#93c5fd",
    400: "#60a5fa",
    500: "#3b82f6",
    600: "#2563eb",
    700: "#1d4ed8",
    800: "#1e40af",
    900: "#1e3a8a"
  },
  secondary: {
    50: "#f8fafc",
    100: "#f1f5f9",
    200: "#e2e8f0",
    300: "#cbd5e1",
    400: "#94a3b8",
    500: "#64748b",
    600: "#475569",
    700: "#334155",
    800: "#1e293b",
    900: "#0f172a"
  },
  success: {
    50: "#f0fdf4",
    100: "#dcfce7",
    200: "#bbf7d0",
    300: "#86efac",
    400: "#4ade80",
    500: "#22c55e",
    600: "#16a34a",
    700: "#15803d",
    800: "#166534",
    900: "#14532d"
  },
  warning: {
    50: "#fffbeb",
    100: "#fef3c7",
    200: "#fde68a",
    300: "#fcd34d",
    400: "#fbbf24",
    500: "#f59e0b",
    600: "#d97706",
    700: "#b45309",
    800: "#92400e",
    900: "#78350f"
  },
  error: {
    50: "#fef2f2",
    100: "#fee2e2",
    200: "#fecaca",
    300: "#fca5a5",
    400: "#f87171",
    500: "#ef4444",
    600: "#dc2626",
    700: "#b91c1c",
    800: "#991b1b",
    900: "#7f1d1d"
  }
}

const typography = {
  heading: {
    h1: { class: "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl", example: "Heading 1" },
    h2: { class: "scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight", example: "Heading 2" },
    h3: { class: "scroll-m-20 text-2xl font-semibold tracking-tight", example: "Heading 3" },
    h4: { class: "scroll-m-20 text-xl font-semibold tracking-tight", example: "Heading 4" }
  },
  body: {
    large: { class: "text-lg text-muted-foreground", example: "Large body text" },
    default: { class: "leading-7", example: "Default body text" },
    small: { class: "text-sm text-muted-foreground", example: "Small body text" },
    muted: { class: "text-sm text-muted-foreground", example: "Muted text" }
  }
}

const components = [
  {
    name: "Button",
    category: "Actions",
    description: "Botões para ações primárias e secundárias",
    variants: ["default", "destructive", "outline", "secondary", "ghost", "link"],
    sizes: ["default", "sm", "lg", "icon"]
  },
  {
    name: "Card",
    category: "Layout",
    description: "Container flexível para conteúdo",
    variants: ["default", "outline"],
    sizes: ["default"]
  },
  {
    name: "Badge",
    category: "Display",
    description: "Indicadores de status e categorias",
    variants: ["default", "secondary", "destructive", "outline"],
    sizes: ["default", "sm", "lg"]
  },
  {
    name: "Input",
    category: "Forms",
    description: "Campo de entrada de texto",
    variants: ["default", "error"],
    sizes: ["default", "sm", "lg"]
  },
  {
    name: "Alert",
    category: "Feedback",
    description: "Mensagens de alerta e informações",
    variants: ["default", "destructive"],
    sizes: ["default"]
  }
]

export default function DesignSystemPage() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  const [selectedColor, setSelectedColor] = useState<string | null>(null)

  const copyToClipboard = (code: string, id: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(id)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const ColorPalette = ({ name, colors }: { name: string; colors: Record<string, string> }) => (
    <div className="space-y-2">
      <h4 className="font-semibold capitalize">{name}</h4>
      <div className="grid grid-cols-5 gap-2">
        {Object.entries(colors).map(([shade, hex]) => (
          <div 
            key={shade}
            className="group cursor-pointer"
            onClick={() => {
              setSelectedColor(hex)
              copyToClipboard(hex, `color-${name}-${shade}`)
            }}
          >
            <div 
              className={`w-full h-12 rounded-md border shadow-sm group-hover:shadow-md transition-shadow`}
              style={{ backgroundColor: hex }}
            />
            <div className="text-xs text-center mt-1">
              <div className="font-medium">{shade}</div>
              <div className="text-muted-foreground">{hex}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/docs">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para Documentação
          </Button>
        </Link>
      </div>

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Layers className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold">Design System</h1>
            <p className="text-muted-foreground">
              Componentes, cores e padrões visuais do CRM Pro Dashboard
            </p>
          </div>
        </div>

        <div className="flex gap-4 items-center">
          <Badge variant="secondary">v2.0</Badge>
          <Badge variant="outline">Tailwind CSS</Badge>
          <Badge variant="outline">shadcn/ui</Badge>
        </div>
      </div>

      <Tabs defaultValue="colors" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="colors">Cores</TabsTrigger>
          <TabsTrigger value="typography">Tipografia</TabsTrigger>
          <TabsTrigger value="components">Componentes</TabsTrigger>
          <TabsTrigger value="layout">Layout</TabsTrigger>
          <TabsTrigger value="tokens">Tokens</TabsTrigger>
        </TabsList>

        {/* Colors Tab */}
        <TabsContent value="colors" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Paleta de Cores
              </CardTitle>
              <CardDescription>
                Sistema de cores consistente para toda a aplicação
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <ColorPalette name="primary" colors={colors.primary} />
              <ColorPalette name="secondary" colors={colors.secondary} />
              <ColorPalette name="success" colors={colors.success} />
              <ColorPalette name="warning" colors={colors.warning} />
              <ColorPalette name="error" colors={colors.error} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Uso das Cores</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-blue-500" />
                    <div>
                      <p className="font-medium">Primary</p>
                      <p className="text-sm text-muted-foreground">
                        Ações principais, links e elementos de destaque
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-gray-500" />
                    <div>
                      <p className="font-medium">Secondary</p>
                      <p className="text-sm text-muted-foreground">
                        Texto secundário, bordas e elementos de apoio
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-500" />
                    <div>
                      <p className="font-medium">Success</p>
                      <p className="text-sm text-muted-foreground">
                        Mensagens de sucesso e estados positivos
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-yellow-500" />
                    <div>
                      <p className="font-medium">Warning</p>
                      <p className="text-sm text-muted-foreground">
                        Alertas e estados de atenção
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-red-500" />
                    <div>
                      <p className="font-medium">Error</p>
                      <p className="text-sm text-muted-foreground">
                        Erros e estados destrutivos
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Typography Tab */}
        <TabsContent value="typography" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Type className="h-5 w-5" />
                Sistema Tipográfico
              </CardTitle>
              <CardDescription>
                Hierarquia e estilos de texto consistentes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">Títulos</h3>
                <div className="space-y-6">
                  {Object.entries(typography.heading).map(([key, { class: className, example }]) => (
                    <div key={key} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className={className}>{example}</h4>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(className, `heading-${key}`)}
                        >
                          {copiedCode === `heading-${key}` ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      <code className="text-sm bg-muted px-2 py-1 rounded">
                        {className}
                      </code>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold mb-4">Corpo do Texto</h3>
                <div className="space-y-6">
                  {Object.entries(typography.body).map(([key, { class: className, example }]) => (
                    <div key={key} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <p className={className}>{example}</p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(className, `body-${key}`)}
                        >
                          {copiedCode === `body-${key}` ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      <code className="text-sm bg-muted px-2 py-1 rounded">
                        {className}
                      </code>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Components Tab */}
        <TabsContent value="components" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layout className="h-5 w-5" />
                Biblioteca de Componentes
              </CardTitle>
              <CardDescription>
                Componentes reutilizáveis baseados em shadcn/ui
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {components.map((component) => (
                  <Card key={component.name}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{component.name}</CardTitle>
                        <Badge variant="outline">{component.category}</Badge>
                      </div>
                      <CardDescription>{component.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-2">Variantes</h4>
                          <div className="flex flex-wrap gap-2">
                            {component.variants.map((variant) => (
                              <Badge key={variant} variant="secondary">
                                {variant}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Tamanhos</h4>
                          <div className="flex flex-wrap gap-2">
                            {component.sizes.map((size) => (
                              <Badge key={size} variant="outline">
                                {size}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4 mr-1" />
                            Preview
                          </Button>
                          <Button size="sm" variant="outline">
                            <Code className="h-4 w-4 mr-1" />
                            Código
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Component Examples */}
          <Card>
            <CardHeader>
              <CardTitle>Exemplos de Componentes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-3">Botões</h3>
                <div className="flex flex-wrap gap-2">
                  <Button>Primary</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="destructive">Destructive</Button>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Badges</h3>
                <div className="flex flex-wrap gap-2">
                  <Badge>Default</Badge>
                  <Badge variant="secondary">Secondary</Badge>
                  <Badge variant="outline">Outline</Badge>
                  <Badge variant="destructive">Destructive</Badge>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Alertas</h3>
                <div className="space-y-4">
                  <Alert>
                    <AlertDescription>
                      Este é um alerta informativo com estilo padrão.
                    </AlertDescription>
                  </Alert>
                  <Alert variant="destructive">
                    <AlertDescription>
                      Este é um alerta de erro com estilo destrutivo.
                    </AlertDescription>
                  </Alert>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Formulários</h3>
                <div className="space-y-4 max-w-md">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="seu@email.com" />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="notifications" />
                    <Label htmlFor="notifications">Receber notificações</Label>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Cards e Avatares</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarImage src="/placeholder.svg" />
                          <AvatarFallback>JD</AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-lg">João Silva</CardTitle>
                          <CardDescription>joao@empresa.com</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progresso</span>
                          <span>65%</span>
                        </div>
                        <Progress value={65} />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Layout Tab */}
        <TabsContent value="layout" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layout className="h-5 w-5" />
                Sistema de Layout
              </CardTitle>
              <CardDescription>
                Grid, espaçamento e estrutura da interface
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-4">Grid System</h3>
                <div className="grid grid-cols-12 gap-4">
                  {Array.from({ length: 12 }, (_, i) => (
                    <div key={i} className="bg-blue-100 dark:bg-blue-900/20 p-2 text-center text-sm rounded">
                      {i + 1}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-4">Espaçamento</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <p className="text-sm">Pequeno (p-2)</p>
                    <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded">
                      <div className="bg-white dark:bg-gray-700 p-4 rounded">Conteúdo</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm">Médio (p-4)</p>
                    <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded">
                      <div className="bg-white dark:bg-gray-700 p-4 rounded">Conteúdo</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm">Grande (p-6)</p>
                    <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded">
                      <div className="bg-white dark:bg-gray-700 p-4 rounded">Conteúdo</div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-4">Breakpoints</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-3 bg-muted rounded">
                    <span className="font-medium">Mobile</span>
                    <code className="text-sm">&lt; 768px</code>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted rounded">
                    <span className="font-medium">Tablet</span>
                    <code className="text-sm">768px - 1024px</code>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted rounded">
                    <span className="font-medium">Desktop</span>
                    <code className="text-sm">1024px - 1280px</code>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted rounded">
                    <span className="font-medium">Large Desktop</span>
                    <code className="text-sm">&gt; 1280px</code>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tokens Tab */}
        <TabsContent value="tokens" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Design Tokens
              </CardTitle>
              <CardDescription>
                Tokens de design para consistência visual
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-4">Sombras</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border">
                      <p className="text-sm font-medium">Small</p>
                      <code className="text-xs">shadow-sm</code>
                    </div>
                    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md border">
                      <p className="text-sm font-medium">Medium</p>
                      <code className="text-xs">shadow-md</code>
                    </div>
                    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg border">
                      <p className="text-sm font-medium">Large</p>
                      <code className="text-xs">shadow-lg</code>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-4">Bordas</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-white dark:bg-gray-800 rounded border">
                      <p className="text-sm font-medium">None</p>
                      <code className="text-xs">rounded-none</code>
                    </div>
                    <div className="p-4 bg-white dark:bg-gray-800 rounded-md border">
                      <p className="text-sm font-medium">Medium</p>
                      <code className="text-xs">rounded-md</code>
                    </div>
                    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border">
                      <p className="text-sm font-medium">Large</p>
                      <code className="text-xs">rounded-lg</code>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-4">Animações</h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-muted rounded-lg">
                      <p className="text-sm font-medium mb-2">Transições</p>
                      <code className="text-xs">transition-all duration-200 ease-in-out</code>
                    </div>
                    <div className="p-4 bg-muted rounded-lg">
                      <p className="text-sm font-medium mb-2">Hover Effects</p>
                      <code className="text-xs">hover:shadow-md hover:scale-105</code>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recursos para Desenvolvedor</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline" className="justify-start">
                  <Download className="h-4 w-4 mr-2" />
                  Baixar Tokens CSS
                </Button>
                <Button variant="outline" className="justify-start">
                  <Code className="h-4 w-4 mr-2" />
                  Arquivo Tailwind Config
                </Button>
                <Button variant="outline" className="justify-start">
                  <Palette className="h-4 w-4 mr-2" />
                  Paleta Figma
                </Button>
                <Button variant="outline" className="justify-start">
                  <Layout className="h-4 w-4 mr-2" />
                  Storybook
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Quick Links */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Links Úteis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/docs/quick-start">
              <Button variant="outline" className="w-full justify-start">
                <Zap className="h-4 w-4 mr-2" />
                Início Rápido
              </Button>
            </Link>
            <Link href="/docs/guides">
              <Button variant="outline" className="w-full justify-start">
                <Code className="h-4 w-4 mr-2" />
                Guias de Desenvolvimento
              </Button>
            </Link>
            <Link href="https://ui.shadcn.com" target="_blank">
              <Button variant="outline" className="w-full justify-start">
                <Layout className="h-4 w-4 mr-2" />
                shadcn/ui Docs
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
