import { memo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowUpRight, ArrowDownRight } from "lucide-react"

interface StatCardProps {
  title: string
  value: string
  change: string
  trend: 'up' | 'down'
  icon: React.ComponentType<any>
  description: string
}

export const StatCard = memo(function StatCard({ 
  title, 
  value, 
  change, 
  trend, 
  icon: Icon, 
  description 
}: StatCardProps) {
  return (
    <Card className="transition-all hover:shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center text-xs text-muted-foreground">
          {trend === 'up' ? (
            <ArrowUpRight className="mr-1 h-3 w-3 text-green-500" />
          ) : (
            <ArrowDownRight className="mr-1 h-3 w-3 text-red-500" />
          )}
          <span className={trend === 'up' ? 'text-green-500' : 'text-red-500'}>
            {change}
          </span>
          <span className="ml-1">{description}</span>
        </div>
      </CardContent>
    </Card>
  )
})

interface ActivityItemProps {
  id: number
  type: string
  title: string
  description: string
  time: string
  icon: React.ComponentType<any>
  status: 'success' | 'warning' | 'info'
}

export const ActivityItem = memo(function ActivityItem({
  title,
  description,
  time,
  icon: Icon,
  status
}: ActivityItemProps) {
  const statusColor = {
    success: 'text-green-500',
    warning: 'text-yellow-500',
    info: 'text-blue-500'
  }[status]

  return (
    <div className="flex items-start space-x-3 p-3 hover:bg-muted/50 rounded-lg transition-colors">
      <div className={`mt-0.5 ${statusColor}`}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground">{title}</p>
        <p className="text-xs text-muted-foreground truncate">{description}</p>
        <p className="text-xs text-muted-foreground mt-1">{time}</p>
      </div>
    </div>
  )
})

interface TaskItemProps {
  id: number
  title: string
  description: string
  dueDate: string
  priority: 'high' | 'medium' | 'low'
  status: 'pending' | 'in-progress' | 'completed'
  onEdit: (id: number) => void
  onToggleStatus: (id: number) => void
}

export const TaskItem = memo(function TaskItem({
  id,
  title,
  description,
  dueDate,
  priority,
  status,
  onEdit,
  onToggleStatus
}: TaskItemProps) {
  const priorityColors = {
    high: 'border-red-200 bg-red-50 text-red-700',
    medium: 'border-yellow-200 bg-yellow-50 text-yellow-700',
    low: 'border-green-200 bg-green-50 text-green-700'
  }

  const statusColors = {
    pending: 'border-gray-200 bg-gray-50 text-gray-700',
    'in-progress': 'border-blue-200 bg-blue-50 text-blue-700',
    completed: 'border-green-200 bg-green-50 text-green-700'
  }

  return (
    <div className="flex items-start justify-between p-3 border rounded-lg hover:shadow-sm transition-all">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          <h4 className="font-medium text-sm">{title}</h4>
          <Badge variant="outline" className={`text-xs ${priorityColors[priority]}`}>
            {priority === 'high' ? 'Alta' : priority === 'medium' ? 'Média' : 'Baixa'}
          </Badge>
          <Badge variant="outline" className={`text-xs ${statusColors[status]}`}>
            {status === 'pending' ? 'Pendente' : status === 'in-progress' ? 'Em andamento' : 'Concluída'}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground mb-1">{description}</p>
        <p className="text-xs font-medium text-foreground">{dueDate}</p>
      </div>
      <div className="flex gap-1">
        <button
          onClick={() => onEdit(id)}
          className="text-xs px-2 py-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
        >
          Editar
        </button>
        <button
          onClick={() => onToggleStatus(id)}
          className="text-xs px-2 py-1 text-green-600 hover:bg-green-50 rounded transition-colors"
        >
          {status === 'completed' ? 'Reabrir' : 'Concluir'}
        </button>
      </div>
    </div>
  )
})
