"use client"

import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { BarChart3, Users, Target, DollarSign, TrendingUp } from "lucide-react"

export default function Loading() {
  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage className="flex items-center gap-1">
                  <BarChart3 className="h-4 w-4" />
                  <Skeleton className="h-4 w-20" />
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        {/* Stats Grid Loading */}
        <div className="grid auto-rows-min gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[
            { Icon: DollarSign, id: 'revenue' },
            { Icon: Users, id: 'contacts' },
            { Icon: TrendingUp, id: 'conversion' },
            { Icon: Target, id: 'deals' }
          ].map(({ Icon, id }) => (
            <Card key={id} className="relative overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-8 w-32" />
                </div>
                <div className="flex items-center justify-center w-8 h-8 rounded-md bg-muted/20">
                  <Icon className="h-4 w-4 text-muted-foreground animate-pulse" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-3 w-12" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Grid Loading */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          {/* Chart Loading */}
          <Card className="col-span-4">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-4 w-48" />
                </div>
                <Skeleton className="h-10 w-24" />
              </div>
            </CardHeader>
            <CardContent className="pl-2">
              <div className="space-y-4">
                {/* Simulated Chart Skeleton */}
                <div className="flex items-end justify-between h-64 px-4">
                  {Array.from({ length: 7 }, (_, i) => (
                    <div key={`chart-bar-${i}`} className="flex flex-col items-center gap-2">
                      <Skeleton 
                        className={`w-8 animate-pulse`} 
                        style={{ 
                          height: `${Math.random() * 150 + 50}px`,
                          animationDelay: `${i * 0.1}s`
                        }} 
                      />
                      <Skeleton className="h-3 w-8" />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity Loading */}
          <Card className="col-span-3">
            <CardHeader>
              <div className="space-y-2">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-40" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Array.from({ length: 5 }, (_, index) => (
                  <div key={`activity-${index}`} className="flex items-center space-x-4 animate-pulse">
                    <Skeleton className="h-10 w-10 rounded-md" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-3 w-3/4" />
                    </div>
                    <Skeleton className="h-3 w-16" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Secondary Content Loading */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }, (_, index) => (
            <Card key={`secondary-${index}`}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-28" />
                    <Skeleton className="h-4 w-36" />
                  </div>
                  <Skeleton className="h-8 w-8 rounded-md" />
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {Array.from({ length: 3 }, (_, i) => (
                  <div key={`secondary-item-${index}-${i}`} className="flex items-center justify-between">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Loading Indicator */}
        <div className="fixed bottom-4 right-4 z-50">
          <Card className="p-4 shadow-lg border-primary/20">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <div className="space-y-1">
                <div className="text-sm font-medium text-primary">Carregando...</div>
                <div className="text-xs text-muted-foreground">Preparando sua dashboard</div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </SidebarInset>
  )
}
