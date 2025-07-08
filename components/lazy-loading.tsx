import React from 'react'
import dynamic from 'next/dynamic'
import { Skeleton } from '@/components/ui/skeleton'

// Lazy loading para componentes pesados
export const DynamicChart = dynamic(
  () => import('recharts').then((mod) => ({ default: mod.BarChart })),
  {
    loading: () => <Skeleton className="h-[300px] w-full" />,
    ssr: false
  }
)

export const DynamicAreaChart = dynamic(
  () => import('recharts').then((mod) => ({ default: mod.AreaChart })),
  {
    loading: () => <Skeleton className="h-[250px] w-full" />,
    ssr: false
  }
)

export const DynamicPieChart = dynamic(
  () => import('recharts').then((mod) => ({ default: mod.PieChart })),
  {
    loading: () => <Skeleton className="h-[200px] w-full" />,
    ssr: false
  }
)

// Lazy loading para páginas pesadas
export const DynamicAnalytics = dynamic(
  () => import('@/app/analytics/page'),
  {
    loading: () => (
      <div className="space-y-6 p-6">
        <Skeleton className="h-8 w-[250px]" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-[120px] w-full" />
          ))}
        </div>
        <Skeleton className="h-[400px] w-full" />
      </div>
    ),
    ssr: false
  }
)

export const DynamicCRM = dynamic(
  () => import('@/app/crm/contacts/page'),
  {
    loading: () => (
      <div className="space-y-6 p-6">
        <Skeleton className="h-8 w-[200px]" />
        <div className="space-y-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-[80px] w-full" />
          ))}
        </div>
      </div>
    ),
    ssr: false
  }
)

// Componente de intersection observer para lazy loading customizado
export function LazyLoad({ 
  children, 
  placeholder = <Skeleton className="h-[200px] w-full" />,
  threshold = 0.1 
}: {
  children: React.ReactNode
  placeholder?: React.ReactNode
  threshold?: number
}) {
  const [isVisible, setIsVisible] = React.useState(false)
  const ref = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [threshold])

  return (
    <div ref={ref}>
      {isVisible ? children : placeholder}
    </div>
  )
}
