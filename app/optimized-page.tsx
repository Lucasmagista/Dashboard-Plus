"use client"

import { Suspense } from 'react'
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { 
  Breadcrumb, 
  BreadcrumbItem, 
  BreadcrumbList, 
  BreadcrumbPage 
} from "@/components/ui/breadcrumb"
import { Skeleton } from "@/components/ui/skeleton"
import PerformanceOptimizedDashboard from "@/components/dashboard/performance-optimized-dashboard"
import { useSwipeNavigation } from "@/hooks/use-swipe-navigation"
import { MAIN_ROUTES } from "@/lib/main-routes"
import { VirtualKeyboard } from "@/components/ui/virtual-keyboard"
import { Fab } from "@/components/ui/fab"

// Skeleton para carregamento
const DashboardSkeleton = () => (
  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-48" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-10 w-10" />
        <Skeleton className="h-10 w-24" />
      </div>
    </div>
    
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="space-y-3">
          <Skeleton className="h-24 w-full" />
        </div>
      ))}
    </div>
    
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
      <div className="col-span-4">
        <Skeleton className="h-80 w-full" />
      </div>
      <div className="col-span-3">
        <Skeleton className="h-80 w-full" />
      </div>
    </div>
  </div>
)

export default function OptimizedDashboardPage() {
  // Hook para navegação por gestos
  useSwipeNavigation(MAIN_ROUTES)

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbPage>Dashboard</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <Suspense fallback={<DashboardSkeleton />}>
          <PerformanceOptimizedDashboard />
        </Suspense>
      </div>

      {/* Componentes de acessibilidade */}
      <VirtualKeyboard />
      
      {/* FAB para ações rápidas */}
      <Fab />
    </SidebarInset>
  )
}
