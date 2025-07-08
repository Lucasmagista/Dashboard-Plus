"use client"

import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Users, Clock, Calendar, TrendingUp, FileText, Award } from "lucide-react"

export default function RHLoading() {
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
                  <Users className="h-4 w-4" />
                  Recursos Humanos
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        {/* HR Stats Grid Loading */}
        <div className="grid auto-rows-min gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[
            { Icon: Users, id: 'employees', label: 'Funcionários' },
            { Icon: Clock, id: 'attendance', label: 'Presença' },
            { Icon: Calendar, id: 'leave', label: 'Folgas' },
            { Icon: TrendingUp, id: 'performance', label: 'Performance' }
          ].map(({ Icon, id, label }) => (
            <Card key={id} className="relative overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-8 w-16" />
                </div>
                <div className="flex items-center justify-center w-8 h-8 rounded-md bg-muted/20">
                  <Icon className="h-4 w-4 text-muted-foreground animate-pulse" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-3 w-12" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main HR Content Grid Loading */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {/* Employee List Loading */}
          <Card className="col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-4 w-48" />
                </div>
                <Skeleton className="h-10 w-32" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Array.from({ length: 6 }, (_, index) => (
                  <div key={`employee-${index}`} className="flex items-center space-x-4 p-3 rounded-lg border animate-pulse">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-full max-w-[200px]" />
                      <Skeleton className="h-3 w-3/4 max-w-[150px]" />
                    </div>
                    <div className="space-y-2">
                      <Skeleton className="h-6 w-16 rounded-full" />
                      <Skeleton className="h-3 w-12" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions Loading */}
          <Card>
            <CardHeader>
              <div className="space-y-2">
                <Skeleton className="h-6 w-28" />
                <Skeleton className="h-4 w-36" />
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { Icon: FileText, label: 'Documentos', id: 'docs' },
                { Icon: Calendar, label: 'Calendário', id: 'calendar' },
                { Icon: Award, label: 'Avaliações', id: 'reviews' },
                { Icon: Users, label: 'Equipes', id: 'teams' }
              ].map(({ Icon, label, id }) => (
                <div key={id} className="flex items-center gap-3 p-3 rounded-lg border animate-pulse">
                  <div className="flex items-center justify-center w-10 h-10 rounded-md bg-muted/20">
                    <Icon className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="space-y-1 flex-1">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Recent Activities */}
        <div className="grid gap-4 md:grid-cols-1">
          <Card>
            <CardHeader>
              <div className="space-y-2">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-4 w-48" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Array.from({ length: 4 }, (_, index) => (
                  <div key={`hr-activity-${index}`} className="flex items-start space-x-4 animate-pulse">
                    <Skeleton className="h-10 w-10 rounded-md mt-1" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-3 w-2/3" />
                      <Skeleton className="h-3 w-1/3" />
                    </div>
                    <Skeleton className="h-3 w-16" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Loading Indicator */}
        <div className="fixed bottom-4 right-4 z-50">
          <Card className="p-4 shadow-lg border-primary/20">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <div className="space-y-1">
                <div className="text-sm font-medium text-primary">Carregando RH...</div>
                <div className="text-xs text-muted-foreground">Preparando dados dos funcionários</div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </SidebarInset>
  )
}
