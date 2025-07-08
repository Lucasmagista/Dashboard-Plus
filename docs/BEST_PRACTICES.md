# 📚 Best Practices - CRM Pro Dashboard

<div align="center">

![Best Practices](https://img.shields.io/badge/Best%20Practices-Tested-green?style=for-the-badge&logo=checkmarx)
![Quality](https://img.shields.io/badge/Quality-Enterprise-blue?style=for-the-badge)

**Melhores práticas para desenvolvimento, deployment e manutenção do CRM Pro Dashboard**

</div>

---

## 🎯 Visão Geral

Este documento consolida as melhores práticas estabelecidas para o desenvolvimento e operação do CRM Pro Dashboard, garantindo qualidade, segurança, performance e manutenibilidade do código.

---

## 💻 Desenvolvimento

### 🏗️ Arquitetura de Código

#### Estrutura de Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── ui/             # Componentes base (shadcn/ui)
│   ├── dashboard/      # Componentes específicos do dashboard
│   └── forms/          # Componentes de formulários
├── lib/                # Utilitários e configurações
│   ├── api.ts          # Cliente API
│   ├── auth.ts         # Configuração de autenticação
│   ├── utils.ts        # Utilitários gerais
│   └── validations.ts  # Schemas de validação
├── hooks/              # Custom hooks
├── pages/              # Páginas Next.js
│   ├── api/            # API routes
│   └── dashboard/      # Páginas do dashboard
├── styles/             # Estilos globais
└── types/              # Definições TypeScript
```

#### Convenções de Nomenclatura

```typescript
// ✅ Bom - PascalCase para componentes
export function UserProfile() {}
export const DashboardCard = () => {}

// ✅ Bom - camelCase para funções e variáveis
const getUserData = async () => {}
const isUserLoggedIn = true

// ✅ Bom - UPPER_SNAKE_CASE para constantes
const API_BASE_URL = 'https://api.example.com'
const MAX_RETRY_ATTEMPTS = 3

// ✅ Bom - kebab-case para arquivos
user-profile.tsx
dashboard-card.component.tsx
api-client.service.ts

// ❌ Evitar - Nomes genéricos
const data = getUserData() // Use: const userData = getUserData()
const temp = calculate()   // Use: const calculatedValue = calculate()
```

#### Organização de Imports

```typescript
// ✅ Ordem recomendada de imports
// 1. React e bibliotecas externas
import React, { useState, useEffect } from 'react'
import { NextPage } from 'next'
import { useQuery } from '@tanstack/react-query'

// 2. Imports relativos de componentes
import { Button } from '@/components/ui/button'
import { DashboardCard } from '@/components/dashboard/dashboard-card'

// 3. Hooks customizados
import { useAuth } from '@/hooks/use-auth'
import { useLocalStorage } from '@/hooks/use-local-storage'

// 4. Utilitários e tipos
import { cn } from '@/lib/utils'
import { User, Dashboard } from '@/types'

// 5. Imports de estilo (se necessário)
import styles from './component.module.css'
```

### ⚛️ React/Next.js Best Practices

#### Componentes Funcionais

```typescript
// ✅ Bom - Componente funcional com TypeScript
interface UserCardProps {
  user: User
  onEdit?: (user: User) => void
  className?: string
}

export function UserCard({ user, onEdit, className }: UserCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  
  const handleEdit = useCallback(() => {
    setIsEditing(true)
    onEdit?.(user)
  }, [user, onEdit])

  return (
    <div className={cn('user-card', className)}>
      <h3>{user.name}</h3>
      <Button onClick={handleEdit}>Editar</Button>
    </div>
  )
}

// ✅ Bom - Uso de memo para otimização
export const UserCard = memo(function UserCard({ user, onEdit }: UserCardProps) {
  // ... componente
})
```

#### Custom Hooks

```typescript
// ✅ Bom - Custom hook bem estruturado
export function useUser(userId: string) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!userId) return

    const fetchUser = async () => {
      try {
        setLoading(true)
        setError(null)
        const userData = await api.getUser(userId)
        setUser(userData)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro desconhecido')
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [userId])

  const refetch = useCallback(() => {
    // Lógica de refetch
  }, [userId])

  return { user, loading, error, refetch }
}
```

#### Performance Optimization

```typescript
// ✅ Bom - Uso correto de useMemo e useCallback
export function ExpensiveComponent({ data, onFilter }: Props) {
  // ✅ Memoize cálculos pesados
  const processedData = useMemo(() => {
    return data.map(item => ({
      ...item,
      calculated: heavyCalculation(item)
    }))
  }, [data])

  // ✅ Memoize callbacks para evitar re-renders
  const handleFilter = useCallback((filterValue: string) => {
    onFilter(filterValue)
  }, [onFilter])

  // ✅ Lazy loading para componentes pesados
  const HeavyChart = lazy(() => import('./heavy-chart'))

  return (
    <div>
      <Suspense fallback={<ChartSkeleton />}>
        <HeavyChart data={processedData} />
      </Suspense>
    </div>
  )
}
```

### 🎨 UI/UX Best Practices

#### Design System

```typescript
// ✅ Bom - Uso consistente do design system
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function DashboardCard({ title, children }: Props) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  )
}

// ✅ Variantes do design system
const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
      },
    },
  }
)
```

#### Responsividade

```css
/* ✅ Bom - Mobile-first approach */
.dashboard-card {
  @apply p-4 rounded-lg shadow-sm border;
  
  /* Mobile por padrão */
  grid-column: span 1;
  
  /* Tablet */
  @media (min-width: 768px) {
    grid-column: span 2;
  }
  
  /* Desktop */
  @media (min-width: 1024px) {
    grid-column: span 3;
  }
}

/* ✅ Uso de classes utilitárias Tailwind */
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <Card className="col-span-1 md:col-span-2 lg:col-span-1" />
</div>
```

#### Acessibilidade

```typescript
// ✅ Bom - Componentes acessíveis
export function AccessibleButton({ children, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className={cn('focus:ring-2 focus:ring-primary focus:outline-none', props.className)}
      aria-label={props['aria-label']}
    >
      {children}
    </button>
  )
}

// ✅ Landmarks e estrutura semântica
export function DashboardLayout({ children }: Props) {
  return (
    <div className="min-h-screen bg-background">
      <header role="banner">
        <Navigation />
      </header>
      <main role="main" aria-label="Conteúdo principal">
        {children}
      </main>
      <footer role="contentinfo">
        <Footer />
      </footer>
    </div>
  )
}
```

### 🔧 API e Backend

#### API Routes Structure

```typescript
// ✅ Bom - Estrutura consistente de API
// pages/api/users/[id].ts
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // ✅ Validação de método HTTP
  if (!['GET', 'PUT', 'DELETE'].includes(req.method || '')) {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // ✅ Validação de autenticação
    const session = await getServerSession(req, res, authOptions)
    if (!session) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    // ✅ Validação de entrada
    const { id } = req.query
    const userId = z.string().uuid().parse(id)

    switch (req.method) {
      case 'GET':
        return await handleGetUser(req, res, userId)
      case 'PUT':
        return await handleUpdateUser(req, res, userId)
      case 'DELETE':
        return await handleDeleteUser(req, res, userId)
    }
  } catch (error) {
    // ✅ Tratamento de erro consistente
    console.error('API Error:', error)
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid input', details: error.issues })
    }
    
    return res.status(500).json({ error: 'Internal server error' })
  }
}
```

#### Database Queries

```typescript
// ✅ Bom - Queries otimizadas com Prisma
export async function getUsersWithStats(filters: UserFilters) {
  return await prisma.user.findMany({
    where: {
      ...(filters.status && { status: filters.status }),
      ...(filters.search && {
        OR: [
          { name: { contains: filters.search, mode: 'insensitive' } },
          { email: { contains: filters.search, mode: 'insensitive' } }
        ]
      })
    },
    include: {
      _count: {
        select: {
          leads: true,
          deals: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    },
    take: filters.limit || 20,
    skip: (filters.page - 1) * (filters.limit || 20)
  })
}

// ✅ Transações para operações complexas
export async function createUserWithProfile(userData: CreateUserData) {
  return await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        name: userData.name,
        email: userData.email
      }
    })

    const profile = await tx.profile.create({
      data: {
        userId: user.id,
        bio: userData.bio,
        avatar: userData.avatar
      }
    })

    return { user, profile }
  })
}
```

#### Error Handling

```typescript
// ✅ Bom - Classes de erro customizadas
export class APIError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message)
    this.name = 'APIError'
  }
}

export class ValidationError extends APIError {
  constructor(message: string, public field?: string) {
    super(message, 400, 'VALIDATION_ERROR')
  }
}

// ✅ Middleware de tratamento de erro
export function withErrorHandling(handler: NextApiHandler): NextApiHandler {
  return async (req, res) => {
    try {
      await handler(req, res)
    } catch (error) {
      if (error instanceof APIError) {
        return res.status(error.statusCode).json({
          error: error.message,
          code: error.code
        })
      }

      // Log do erro para monitoramento
      console.error('Unhandled API Error:', error)
      
      res.status(500).json({
        error: 'Internal server error',
        code: 'INTERNAL_ERROR'
      })
    }
  }
}
```

---

## 🔐 Segurança

### 🛡️ Autenticação e Autorização

#### NextAuth.js Configuration

```typescript
// ✅ Bom - Configuração segura do NextAuth
export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await verifyCredentials(credentials.email, credentials.password)
        return user || null
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 horas
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
    maxAge: 24 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      session.user.id = token.id
      session.user.role = token.role
      return session
    }
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  }
}
```

#### Role-Based Access Control

```typescript
// ✅ Bom - RBAC middleware
export function withAuth(requiredRole?: UserRole) {
  return function (handler: NextApiHandler): NextApiHandler {
    return async (req, res) => {
      const session = await getServerSession(req, res, authOptions)
      
      if (!session) {
        return res.status(401).json({ error: 'Unauthorized' })
      }

      if (requiredRole && !hasRole(session.user.role, requiredRole)) {
        return res.status(403).json({ error: 'Forbidden' })
      }

      // Adicionar usuário ao request
      req.user = session.user
      return handler(req, res)
    }
  }
}

// ✅ Uso do middleware
export default withAuth('ADMIN')(async function handler(req, res) {
  // Só admins podem acessar
})
```

### 🔒 Validação e Sanitização

#### Zod Schemas

```typescript
// ✅ Bom - Schemas de validação robustos
export const createUserSchema = z.object({
  name: z.string()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres')
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, 'Nome deve conter apenas letras'),
  
  email: z.string()
    .email('Email inválido')
    .max(255, 'Email muito longo'),
  
  password: z.string()
    .min(8, 'Senha deve ter pelo menos 8 caracteres')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, 
           'Senha deve conter ao menos: 1 minúscula, 1 maiúscula, 1 número e 1 símbolo'),
  
  role: z.enum(['USER', 'ADMIN', 'MANAGER']).default('USER'),
  
  profile: z.object({
    bio: z.string().max(500).optional(),
    avatar: z.string().url().optional()
  }).optional()
})

// ✅ Validação em API routes
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const validatedData = createUserSchema.parse(req.body)
    // Usar dados validados...
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Dados inválidos',
        details: error.issues
      })
    }
  }
}
```

#### Sanitização de Entrada

```typescript
// ✅ Bom - Sanitização de dados
import DOMPurify from 'isomorphic-dompurify'
import validator from 'validator'

export function sanitizeUserInput(input: any) {
  if (typeof input === 'string') {
    // Remover HTML malicioso
    const clean = DOMPurify.sanitize(input)
    // Escapar caracteres especiais
    return validator.escape(clean)
  }
  
  if (Array.isArray(input)) {
    return input.map(sanitizeUserInput)
  }
  
  if (typeof input === 'object' && input !== null) {
    const sanitized: any = {}
    for (const [key, value] of Object.entries(input)) {
      sanitized[key] = sanitizeUserInput(value)
    }
    return sanitized
  }
  
  return input
}
```

### 🌐 Segurança de Rede

#### CORS Configuration

```typescript
// ✅ Bom - Configuração CORS restritiva
import Cors from 'cors'

const cors = Cors({
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  origin: [
    'https://yourdomain.com',
    'https://www.yourdomain.com',
    ...(process.env.NODE_ENV === 'development' ? ['http://localhost:3000'] : [])
  ],
  credentials: true,
  optionsSuccessStatus: 200
})

export function withCors(handler: NextApiHandler): NextApiHandler {
  return async (req, res) => {
    await cors(req, res)
    return handler(req, res)
  }
}
```

#### Rate Limiting

```typescript
// ✅ Bom - Rate limiting por IP
import { RateLimiterMemory } from 'rate-limiter-flexible'

const rateLimiter = new RateLimiterMemory({
  keyGenerator: (req) => req.ip,
  points: 100, // Requests
  duration: 60, // Por minuto
})

export function withRateLimit(handler: NextApiHandler): NextApiHandler {
  return async (req, res) => {
    try {
      await rateLimiter.consume(req.ip)
      return handler(req, res)
    } catch {
      return res.status(429).json({
        error: 'Too many requests',
        retryAfter: Math.round(rateLimiter.msBeforeNext(req.ip) / 1000)
      })
    }
  }
}
```

---

## 🚀 Performance

### ⚡ Frontend Optimization

#### Code Splitting

```typescript
// ✅ Bom - Lazy loading de componentes
const DashboardChart = lazy(() => import('@/components/dashboard-chart'))
const UserManagement = lazy(() => import('@/components/user-management'))

export function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <div>
      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      
      <Suspense fallback={<ComponentSkeleton />}>
        {activeTab === 'analytics' && <DashboardChart />}
        {activeTab === 'users' && <UserManagement />}
      </Suspense>
    </div>
  )
}

// ✅ Dynamic imports para routes
const DynamicDashboard = dynamic(() => import('@/components/dashboard'), {
  loading: () => <DashboardSkeleton />,
  ssr: false // Se necessário
})
```

#### Image Optimization

```typescript
// ✅ Bom - Uso do next/image
import Image from 'next/image'

export function UserAvatar({ src, alt, size = 40 }: Props) {
  return (
    <div className="relative overflow-hidden rounded-full">
      <Image
        src={src || '/default-avatar.png'}
        alt={alt}
        width={size}
        height={size}
        className="object-cover"
        priority={false} // true apenas para above-the-fold
        placeholder="blur"
        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R+Cp5ryRVn4qElAJipuGPeA9HMmHlFSNWUUhDgJ4S6/dKE6sdjflFWAqBFNAeDVAAjXbHNGCCJ58+0pMhzqR8eFFmCYJEh0X7t7QWWcIkSNQRUQIveLHKOLBDPTdHPMSjBT/9k="
        sizes="(max-width: 768px) 32px, 40px"
      />
    </div>
  )
}

// ✅ Configuração otimizada no next.config.js
module.exports = {
  images: {
    domains: ['example.com', 'cdn.example.com'],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  }
}
```

#### Bundle Optimization

```javascript
// ✅ Bom - Configuração webpack otimizada
// next.config.js
module.exports = {
  webpack: (config, { dev, isServer }) => {
    // Analisar bundle em desenvolvimento
    if (dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
        },
      }
    }

    // Tree shaking agressivo em produção
    if (!dev) {
      config.optimization.usedExports = true
      config.optimization.sideEffects = false
    }

    return config
  },
  
  // Compressão
  compress: true,
  
  // Experimental features
  experimental: {
    optimizeCss: true,
    optimizeImages: true,
  }
}
```

### 🗄️ Database Optimization

#### Query Optimization

```typescript
// ✅ Bom - Queries otimizadas
export async function getOptimizedDashboardData(userId: string) {
  // Uma query em vez de múltiplas
  const result = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      _count: {
        select: {
          leads: { where: { status: 'ACTIVE' } },
          deals: { where: { status: 'OPEN' } },
          tasks: { where: { completed: false } }
        }
      },
      recentLeads: {
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          status: true,
          createdAt: true
        }
      }
    }
  })

  return result
}

// ✅ Índices apropriados no schema
model Lead {
  id        String   @id @default(cuid())
  name      String
  status    String
  userId    String
  createdAt DateTime @default(now())
  
  user User @relation(fields: [userId], references: [id])
  
  // Índices para performance
  @@index([userId, status])
  @@index([createdAt])
  @@index([userId, createdAt])
}
```

#### Connection Pooling

```typescript
// ✅ Bom - Pool de conexões otimizado
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? 
  new PrismaClient({
    log: ['query'],
    datasources: {
      db: {
        url: process.env.DATABASE_URL
      }
    }
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Configuração de pool no DATABASE_URL
// postgresql://user:pass@host:5432/db?connection_limit=20&pool_timeout=10
```

### 📦 Caching Strategies

#### React Query Setup

```typescript
// ✅ Bom - Configuração React Query otimizada
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutos
      cacheTime: 10 * 60 * 1000, // 10 minutos
      retry: 2,
      refetchOnWindowFocus: false,
      refetchOnMount: false
    },
    mutations: {
      retry: 1
    }
  }
})

// ✅ Custom hooks com cache inteligente
export function useUsers(filters: UserFilters) {
  return useQuery({
    queryKey: ['users', filters],
    queryFn: () => api.getUsers(filters),
    staleTime: 2 * 60 * 1000, // 2 minutos para dados que mudam frequentemente
    select: (data) => data.users, // Selecionar apenas os dados necessários
  })
}

// ✅ Invalidação inteligente de cache
export function useCreateUser() {
  return useMutation({
    mutationFn: api.createUser,
    onSuccess: () => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['users'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    }
  })
}
```

#### Redis Caching

```typescript
// ✅ Bom - Cache Redis estratégico
import Redis from 'ioredis'

const redis = new Redis(process.env.REDIS_URL)

export async function getCachedOrFetch<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number = 300 // 5 minutos
): Promise<T> {
  try {
    const cached = await redis.get(key)
    if (cached) {
      return JSON.parse(cached)
    }

    const fresh = await fetcher()
    await redis.setex(key, ttl, JSON.stringify(fresh))
    return fresh
  } catch (error) {
    console.error('Cache error:', error)
    return fetcher() // Fallback para fetch direto
  }
}

// ✅ Uso em API routes
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const cacheKey = `dashboard:${req.user.id}`
  
  const data = await getCachedOrFetch(
    cacheKey,
    () => getDashboardData(req.user.id),
    300 // 5 minutos
  )

  res.json(data)
}
```

---

## 🧪 Testing

### 🔍 Testing Strategy

#### Unit Tests

```typescript
// ✅ Bom - Testes unitários completos
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { UserCard } from '@/components/user-card'

// Mock de dependências externas
jest.mock('@/lib/api', () => ({
  updateUser: jest.fn().mockResolvedValue({ success: true })
}))

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false }
    }
  })

const renderWithProviders = (ui: React.ReactElement) => {
  const queryClient = createTestQueryClient()
  return render(
    <QueryClientProvider client={queryClient}>
      {ui}
    </QueryClientProvider>
  )
}

describe('UserCard', () => {
  const mockUser = {
    id: '1',
    name: 'João Silva',
    email: 'joao@example.com',
    role: 'USER'
  }

  it('should render user information correctly', () => {
    renderWithProviders(<UserCard user={mockUser} />)
    
    expect(screen.getByText('João Silva')).toBeInTheDocument()
    expect(screen.getByText('joao@example.com')).toBeInTheDocument()
  })

  it('should call onEdit when edit button is clicked', async () => {
    const onEdit = jest.fn()
    renderWithProviders(<UserCard user={mockUser} onEdit={onEdit} />)
    
    fireEvent.click(screen.getByRole('button', { name: /editar/i }))
    
    await waitFor(() => {
      expect(onEdit).toHaveBeenCalledWith(mockUser)
    })
  })
})
```

#### Integration Tests

```typescript
// ✅ Bom - Testes de integração com MSW
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { screen, waitFor } from '@testing-library/react'
import { renderWithProviders } from '@/test-utils'
import { UserList } from '@/components/user-list'

const server = setupServer(
  rest.get('/api/users', (req, res, ctx) => {
    return res(
      ctx.json({
        users: [
          { id: '1', name: 'João', email: 'joao@example.com' },
          { id: '2', name: 'Maria', email: 'maria@example.com' }
        ]
      })
    )
  })
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('UserList Integration', () => {
  it('should load and display users from API', async () => {
    renderWithProviders(<UserList />)
    
    expect(screen.getByText('Carregando...')).toBeInTheDocument()
    
    await waitFor(() => {
      expect(screen.getByText('João')).toBeInTheDocument()
      expect(screen.getByText('Maria')).toBeInTheDocument()
    })
  })

  it('should handle API errors gracefully', async () => {
    server.use(
      rest.get('/api/users', (req, res, ctx) => {
        return res(ctx.status(500), ctx.json({ error: 'Server error' }))
      })
    )

    renderWithProviders(<UserList />)
    
    await waitFor(() => {
      expect(screen.getByText(/erro ao carregar/i)).toBeInTheDocument()
    })
  })
})
```

#### E2E Tests

```typescript
// ✅ Bom - Testes E2E com Playwright
import { test, expect } from '@playwright/test'

test.describe('Dashboard Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Login antes de cada teste
    await page.goto('/auth/signin')
    await page.fill('[data-testid="email"]', 'admin@example.com')
    await page.fill('[data-testid="password"]', 'password123')
    await page.click('[data-testid="submit"]')
    await page.waitForURL('/dashboard')
  })

  test('should display dashboard with user data', async ({ page }) => {
    await expect(page.locator('[data-testid="welcome-message"]')).toBeVisible()
    await expect(page.locator('[data-testid="stats-cards"]')).toBeVisible()
    
    // Verificar se os dados são carregados
    await page.waitForSelector('[data-testid="leads-count"]')
    const leadsCount = await page.textContent('[data-testid="leads-count"]')
    expect(parseInt(leadsCount || '0')).toBeGreaterThanOrEqual(0)
  })

  test('should create new lead successfully', async ({ page }) => {
    await page.click('[data-testid="add-lead-button"]')
    await page.fill('[data-testid="lead-name"]', 'João Silva')
    await page.fill('[data-testid="lead-email"]', 'joao@example.com')
    await page.selectOption('[data-testid="lead-status"]', 'QUALIFIED')
    
    await page.click('[data-testid="save-lead"]')
    
    // Verificar se aparece na lista
    await expect(page.locator('text=João Silva')).toBeVisible()
    await expect(page.locator('text=joao@example.com')).toBeVisible()
  })
})
```

---

## 🚀 Deploy e CI/CD

### 🔄 GitHub Actions

```yaml
# ✅ Bom - Pipeline CI/CD completo
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

env:
  NODE_VERSION: '18'
  PNPM_VERSION: '8'

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: test_db
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          
      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: ${{ env.PNPM_VERSION }}
          
      - name: Get pnpm store directory
        id: pnpm-cache
        shell: bash
        run: echo "STORE_PATH=$(pnpm store path)" >> $GITHUB_OUTPUT
        
      - name: Setup pnpm cache
        uses: actions/cache@v3
        with:
          path: ${{ steps.pnpm-cache.outputs.STORE_PATH }}
          key: ${{ runner.os }}-pnpm-store-${{ hashFiles('**/pnpm-lock.yaml') }}
          restore-keys: ${{ runner.os }}-pnpm-store-
          
      - name: Install dependencies
        run: pnpm install --frozen-lockfile
        
      - name: Run linting
        run: pnpm lint
        
      - name: Run type checking
        run: pnpm type-check
        
      - name: Run unit tests
        run: pnpm test:unit
        env:
          DATABASE_URL: postgres://postgres:postgres@localhost:5432/test_db
          
      - name: Run integration tests
        run: pnpm test:integration
        
      - name: Build application
        run: pnpm build
        
      - name: Run E2E tests
        run: pnpm test:e2e
        
  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Run security audit
        run: pnpm audit
        
      - name: Run Snyk security scan
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}

  deploy-staging:
    needs: [test, security]
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/develop'
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Deploy to Staging
        uses: vercel/action@v1
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-args: '--env staging'
          
  deploy-production:
    needs: [test, security]
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Deploy to Production
        uses: vercel/action@v1
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-args: '--prod'
```

### 🐳 Docker Best Practices

```dockerfile
# ✅ Bom - Dockerfile otimizado
FROM node:18-alpine AS base
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies only when needed
FROM base AS deps
COPY package.json pnpm-lock.yaml ./
RUN corepack enable pnpm && pnpm install --frozen-lockfile

# Rebuild the source code only when needed
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build application
ENV NEXT_TELEMETRY_DISABLED 1
RUN pnpm build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built application
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
```

---

## 📊 Monitoring e Logs

### 📈 Application Monitoring

```typescript
// ✅ Bom - Instrumentação de performance
import { performance } from 'perf_hooks'

export function withPerformanceMonitoring<T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  name: string
) {
  return async (...args: T): Promise<R> => {
    const start = performance.now()
    
    try {
      const result = await fn(...args)
      const duration = performance.now() - start
      
      // Enviar métrica para sistema de monitoramento
      logger.info('Performance metric', {
        function: name,
        duration,
        success: true
      })
      
      return result
    } catch (error) {
      const duration = performance.now() - start
      
      logger.error('Performance metric', {
        function: name,
        duration,
        success: false,
        error: error.message
      })
      
      throw error
    }
  }
}

// ✅ Uso em funções críticas
export const getUsersWithMonitoring = withPerformanceMonitoring(
  getUsers,
  'getUsers'
)
```

### 📝 Structured Logging

```typescript
// ✅ Bom - Logging estruturado
import winston from 'winston'

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: {
    service: 'crm-dashboard',
    version: process.env.APP_VERSION,
    environment: process.env.NODE_ENV
  },
  transports: [
    new winston.transports.File({ 
      filename: 'logs/error.log', 
      level: 'error' 
    }),
    new winston.transports.File({ 
      filename: 'logs/combined.log' 
    })
  ]
})

// Adicionar console em desenvolvimento
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }))
}

// ✅ Middleware de logging para APIs
export function withLogging(handler: NextApiHandler): NextApiHandler {
  return async (req, res) => {
    const startTime = Date.now()
    const requestId = generateRequestId()
    
    req.requestId = requestId
    
    logger.info('API Request', {
      requestId,
      method: req.method,
      url: req.url,
      userAgent: req.headers['user-agent'],
      ip: req.ip,
      userId: req.user?.id
    })

    try {
      await handler(req, res)
      
      logger.info('API Response', {
        requestId,
        statusCode: res.statusCode,
        duration: Date.now() - startTime
      })
    } catch (error) {
      logger.error('API Error', {
        requestId,
        error: error.message,
        stack: error.stack,
        duration: Date.now() - startTime
      })
      
      throw error
    }
  }
}
```

---

## 📞 Suporte e Manutenção

### 🔧 Code Review Checklist

#### Pull Request Template

```markdown
## 📝 Descrição

Breve descrição das mudanças implementadas.

## 🎯 Tipo de Mudança

- [ ] Bug fix (mudança que corrige um problema)
- [ ] Feature (mudança que adiciona funcionalidade)
- [ ] Breaking change (mudança que quebra compatibilidade)
- [ ] Documentação

## ✅ Checklist

- [ ] Código segue os padrões do projeto
- [ ] Self-review realizado
- [ ] Comentários adicionados em código complexo
- [ ] Documentação atualizada
- [ ] Testes adicionados/atualizados
- [ ] Testes passando
- [ ] Lint e type-check passando
- [ ] Performance considerada
- [ ] Segurança validada

## 🧪 Como Testar

Passos para testar as mudanças:

1. Faça checkout da branch
2. Execute `pnpm install`
3. Execute `pnpm dev`
4. Acesse [URL específica]
5. Teste [funcionalidade específica]

## 📸 Screenshots (se aplicável)

## 📚 Documentação Relacionada

Links para documentação ou issues relacionadas.
```

### 🛠️ Maintenance Scripts

```bash
#!/bin/bash
# scripts/maintenance.sh

# ✅ Bom - Scripts de manutenção automatizada

echo "🔧 Iniciando manutenção do sistema..."

# Backup do banco de dados
echo "📦 Criando backup..."
pg_dump $DATABASE_URL > "backups/backup_$(date +%Y%m%d_%H%M%S).sql"

# Limpeza de logs antigos
echo "🧹 Limpando logs antigos..."
find logs/ -name "*.log" -mtime +30 -delete

# Otimização do banco
echo "🗄️ Otimizando banco de dados..."
psql $DATABASE_URL -c "VACUUM ANALYZE;"

# Limpeza de cache
echo "🧽 Limpando cache..."
redis-cli FLUSHDB

# Verificação de saúde
echo "🏥 Verificando saúde do sistema..."
curl -f http://localhost:3000/api/health || echo "❌ Sistema não saudável"

# Restart de serviços se necessário
if [ "$1" = "--restart" ]; then
    echo "🔄 Reiniciando serviços..."
    docker-compose restart app
fi

echo "✅ Manutenção concluída!"
```

---

<div align="center">

**🚀 Qualidade é um hábito, não um ato!**

[📖 Documentation Index](./INDEX.md) • [🤝 Contributing](./CONTRIBUTING.md) • [🔧 Troubleshooting](./TROUBLESHOOTING.md)

</div>
