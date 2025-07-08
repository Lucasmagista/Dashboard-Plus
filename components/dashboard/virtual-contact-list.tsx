"use client"

import React, { useState, useMemo, useCallback } from 'react'
import { FixedSizeList as List } from 'react-window'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Search, 
  Filter, 
  SortAsc, 
  SortDesc, 
  Users, 
  Mail, 
  Phone, 
  Calendar,
  MapPin,
  Tag,
  ExternalLink
} from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface Contact {
  id: string
  name: string
  email: string
  phone: string
  company: string
  position: string
  tags: string[]
  lastContact: Date
  leadScore: number
  location: string
  status: 'cold' | 'warm' | 'hot' | 'converted'
  source: string
}

// Simular uma grande lista de contatos
const generateMockContacts = (count: number): Contact[] => {
  const companies = ['TechCorp', 'InnovaSoft', 'DataTech', 'CloudSys', 'AI Solutions', 'WebCorp', 'DigitalFirst']
  const positions = ['CEO', 'CTO', 'Gerente de TI', 'Diretor', 'Coordenador', 'Analista', 'Desenvolvedor']
  const sources = ['Website', 'LinkedIn', 'Indicação', 'Evento', 'Email Marketing', 'Google Ads']
  const cities = ['São Paulo', 'Rio de Janeiro', 'Belo Horizonte', 'Brasília', 'Porto Alegre', 'Curitiba']
  const statuses: Contact['status'][] = ['cold', 'warm', 'hot', 'converted']
  
  return Array.from({ length: count }, (_, i) => ({
    id: `contact-${i}`,
    name: `Contato ${i + 1}`,
    email: `contato${i + 1}@empresa.com`,
    phone: `(11) 9${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
    company: companies[Math.floor(Math.random() * companies.length)],
    position: positions[Math.floor(Math.random() * positions.length)],
    tags: Array.from({ length: Math.floor(Math.random() * 4) }, () => `Tag${Math.floor(Math.random() * 10)}`),
    lastContact: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000),
    leadScore: Math.floor(Math.random() * 100),
    location: cities[Math.floor(Math.random() * cities.length)],
    status: statuses[Math.floor(Math.random() * statuses.length)],
    source: sources[Math.floor(Math.random() * sources.length)]
  }))
}

const STATUS_COLORS = {
  cold: 'bg-blue-100 text-blue-800',
  warm: 'bg-yellow-100 text-yellow-800',
  hot: 'bg-red-100 text-red-800',
  converted: 'bg-green-100 text-green-800'
}

const STATUS_LABELS = {
  cold: 'Frio',
  warm: 'Morno',
  hot: 'Quente',
  converted: 'Convertido'
}

interface ContactRowProps {
  index: number
  style: React.CSSProperties
  data: Contact[]
}

const ContactRow: React.FC<ContactRowProps> = ({ index, style, data }) => {
  const contact = data[index]
  
  return (
    <div style={style} className="px-2 py-1">
      <Card className="hover:shadow-md transition-shadow duration-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1 min-w-0">
              {/* Avatar */}
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Users className="w-5 h-5 text-primary" />
              </div>
              
              {/* Info principal */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-sm truncate">{contact.name}</h3>
                  <Badge className={`text-xs ${STATUS_COLORS[contact.status]}`}>
                    {STATUS_LABELS[contact.status]}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    Score: {contact.leadScore}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1 truncate">
                    <Mail className="w-3 h-3 flex-shrink-0" />
                    <span className="truncate">{contact.email}</span>
                  </div>
                  <div className="flex items-center gap-1 truncate">
                    <Phone className="w-3 h-3 flex-shrink-0" />
                    <span className="truncate">{contact.phone}</span>
                  </div>
                  <div className="flex items-center gap-1 truncate">
                    <MapPin className="w-3 h-3 flex-shrink-0" />
                    <span className="truncate">{contact.location}</span>
                  </div>
                  <div className="flex items-center gap-1 truncate">
                    <Calendar className="w-3 h-3 flex-shrink-0" />
                    <span className="truncate">
                      {format(contact.lastContact, 'dd/MM/yyyy', { locale: ptBR })}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs text-muted-foreground">{contact.company} - {contact.position}</span>
                  {contact.tags.length > 0 && (
                    <div className="flex gap-1">
                      {contact.tags.slice(0, 2).map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {contact.tags.length > 2 && (
                        <Badge variant="secondary" className="text-xs">
                          +{contact.tags.length - 2}
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Ações */}
            <div className="flex items-center gap-1 flex-shrink-0 ml-2">
              <Button variant="ghost" size="sm">
                <ExternalLink className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export const VirtualContactList: React.FC = () => {
  const [contacts] = useState(() => generateMockContacts(10000)) // 10k contatos para testar performance
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'name' | 'leadScore' | 'lastContact'>('name')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [listHeight, setListHeight] = useState(600)

  // Filtrar e ordenar contatos
  const filteredAndSortedContacts = useMemo(() => {
    let filtered = contacts

    // Filtro de busca
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(contact =>
        contact.name.toLowerCase().includes(term) ||
        contact.email.toLowerCase().includes(term) ||
        contact.company.toLowerCase().includes(term) ||
        contact.phone.includes(term)
      )
    }

    // Filtro de status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(contact => contact.status === statusFilter)
    }

    // Ordenação
    filtered.sort((a, b) => {
      let compareValue = 0
      
      switch (sortBy) {
        case 'name':
          compareValue = a.name.localeCompare(b.name)
          break
        case 'leadScore':
          compareValue = a.leadScore - b.leadScore
          break
        case 'lastContact':
          compareValue = a.lastContact.getTime() - b.lastContact.getTime()
          break
      }
      
      return sortOrder === 'asc' ? compareValue : -compareValue
    })

    return filtered
  }, [contacts, searchTerm, statusFilter, sortBy, sortOrder])

  const toggleSort = useCallback((field: typeof sortBy) => {
    if (sortBy === field) {
      setSortOrder(order => order === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('asc')
    }
  }, [sortBy])

  // Ajustar altura da lista baseado na tela
  React.useEffect(() => {
    const updateHeight = () => {
      const windowHeight = window.innerHeight
      const headerHeight = 200 // Aproximado para header + filtros
      setListHeight(Math.min(600, windowHeight - headerHeight))
    }

    updateHeight()
    window.addEventListener('resize', updateHeight)
    return () => window.removeEventListener('resize', updateHeight)
  }, [])

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Lista de Contatos
          </span>
          <Badge variant="secondary">
            {filteredAndSortedContacts.length.toLocaleString()} de {contacts.length.toLocaleString()}
          </Badge>
        </CardTitle>
        <CardDescription>
          Lista virtualizada de alta performance para grandes volumes de dados
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Filtros e busca */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Buscar por nome, email, empresa ou telefone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os status</SelectItem>
              <SelectItem value="cold">Frio</SelectItem>
              <SelectItem value="warm">Morno</SelectItem>
              <SelectItem value="hot">Quente</SelectItem>
              <SelectItem value="converted">Convertido</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Controles de ordenação */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant={sortBy === 'name' ? 'default' : 'outline'}
            size="sm"
            onClick={() => toggleSort('name')}
            className="flex items-center gap-1"
          >
            Nome
            {sortBy === 'name' && (
              sortOrder === 'asc' ? <SortAsc className="w-3 h-3" /> : <SortDesc className="w-3 h-3" />
            )}
          </Button>
          
          <Button
            variant={sortBy === 'leadScore' ? 'default' : 'outline'}
            size="sm"
            onClick={() => toggleSort('leadScore')}
            className="flex items-center gap-1"
          >
            Score
            {sortBy === 'leadScore' && (
              sortOrder === 'asc' ? <SortAsc className="w-3 h-3" /> : <SortDesc className="w-3 h-3" />
            )}
          </Button>
          
          <Button
            variant={sortBy === 'lastContact' ? 'default' : 'outline'}
            size="sm"
            onClick={() => toggleSort('lastContact')}
            className="flex items-center gap-1"
          >
            Último Contato
            {sortBy === 'lastContact' && (
              sortOrder === 'asc' ? <SortAsc className="w-3 h-3" /> : <SortDesc className="w-3 h-3" />
            )}
          </Button>
        </div>

        {/* Lista virtualizada */}
        <div className="border rounded-lg overflow-hidden">
          {filteredAndSortedContacts.length === 0 ? (
            <div className="flex items-center justify-center py-12 text-muted-foreground">
              <div className="text-center">
                <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Nenhum contato encontrado</p>
                <p className="text-sm">Tente ajustar os filtros de busca</p>
              </div>
            </div>
          ) : (
            <List
              height={listHeight}
              itemCount={filteredAndSortedContacts.length}
              itemSize={120} // Altura de cada item
              itemData={filteredAndSortedContacts}
              overscanCount={5} // Renderizar 5 itens extras para scroll suave
            >
              {ContactRow}
            </List>
          )}
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
          {Object.entries(STATUS_LABELS).map(([status, label]) => {
            const count = filteredAndSortedContacts.filter(c => c.status === status).length
            const percentage = filteredAndSortedContacts.length > 0 
              ? ((count / filteredAndSortedContacts.length) * 100).toFixed(1)
              : '0'
            
            return (
              <div key={status} className="text-center">
                <div className={`inline-flex px-2 py-1 rounded text-sm font-medium ${STATUS_COLORS[status as keyof typeof STATUS_COLORS]}`}>
                  {label}
                </div>
                <div className="mt-1">
                  <span className="text-2xl font-bold">{count}</span>
                  <span className="text-sm text-muted-foreground ml-1">({percentage}%)</span>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
