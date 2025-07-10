"use client"

import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Briefcase, Calendar, FileText, Gift, Users, Upload, Download, Plus, ClipboardList, BarChart3, Eye, ExternalLink } from "lucide-react"
import { useGoogleForms } from "@/hooks/use-google-forms"
import { GoogleFormsBuilder } from "@/components/forms/google-forms-builder"
import { FormAnalytics } from "@/components/forms/form-analytics-advanced"

const initialEmployees = [
  { id: 1, name: "João Silva", email: "joao@empresa.com", role: "Desenvolvedor", department: "TI", status: "Ativo", admission: "2022-03-10", birthday: "1990-07-15", avatar: "/placeholder-user.jpg" },
  { id: 2, name: "Maria Souza", email: "maria@empresa.com", role: "RH", department: "RH", status: "Férias", admission: "2021-11-01", birthday: "1988-12-02", avatar: "/placeholder-user.jpg" },
  { id: 3, name: "Carlos Lima", email: "carlos@empresa.com", role: "Designer", department: "Design", status: "Ativo", admission: "2023-01-20", birthday: "1995-04-22", avatar: "/placeholder-user.jpg" },
  { id: 4, name: "Ana Paula", email: "ana@empresa.com", role: "Financeiro", department: "Financeiro", status: "Ativo", admission: "2020-08-15", birthday: "1992-09-10", avatar: "/placeholder-user.jpg" },
]

const initialVacations = [
  { id: 1, name: "Maria Souza", start: "2025-07-10", end: "2025-07-25", status: "Aprovado" },
  { id: 2, name: "Carlos Lima", start: "2025-08-01", end: "2025-08-10", status: "Pendente" },
]

const initialBirthdays = [
  { id: 1, name: "João Silva", date: "2025-07-15" },
  { id: 2, name: "Ana Paula", date: "2025-09-10" },
]

const initialResumes = [
  { id: 1, name: "Lucas Pereira", email: "lucas.pereira@gmail.com", position: "Desenvolvedor", status: "Novo", file: "lucas-pereira.pdf", date: "2025-07-01" },
  { id: 2, name: "Fernanda Lima", email: "fernanda.lima@gmail.com", position: "Designer", status: "Em análise", file: "fernanda-lima.pdf", date: "2025-06-28" },
]
export default function RHPage() {
  // Hook para gerenciar formulários Google Forms
  const { 
    forms, 
    loading: formsLoading, 
    error: formsError, 
    createForm, 
    updateFormStatus, 
    deleteForm, 
    getFormResponses,
    clearError 
  } = useGoogleForms()

  // Estados para formulários
  const [showFormBuilder, setShowFormBuilder] = useState(false)
  const [selectedFormForAnalytics, setSelectedFormForAnalytics] = useState<any>(null)
  const [formResponses, setFormResponses] = useState<any[]>([])
  const [loadingResponses, setLoadingResponses] = useState(false)

  // Estados auxiliares para tela de currículos aprimorada
  const [filterStatus, setFilterStatus] = useState("");
  const [filterPosition, setFilterPosition] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [resumeTags, setResumeTags] = useState<{ [resumeId: number]: string[] }>({});
  // Novo: tags agrupadas e animação de "mover para seção"
  const [tagSections, setTagSections] = useState<{ [tag: string]: number[] }>({});
  const [activeTagSection, setActiveTagSection] = useState<string | null>(null);
  const [animatingResumeId, setAnimatingResumeId] = useState<number | null>(null);
  const [showTagInput, setShowTagInput] = useState(false);
  const [tagInputResumeId, setTagInputResumeId] = useState<number | null>(null);
  const [tagInputValue, setTagInputValue] = useState("");
  const [resumeComments, setResumeComments] = useState<{ [resumeId: number]: string }>({});
  const [selectedResume, setSelectedResume] = useState<Resume | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [resumeHistory, setResumeHistory] = useState<{ [resumeId: number]: { date: string, status: string }[] }>({});

  // Handlers auxiliares
  function handleAddTag(resumeId: number | null, tag: string) {
    if (!resumeId) return;
    setResumeTags(tagsMap => ({ ...tagsMap, [resumeId]: [...(tagsMap[resumeId] || []), tag] }));
    // Adiciona o currículo à seção da tag
    setTagSections(sections => {
      const updated = { ...sections };
      if (!updated[tag]) updated[tag] = [];
      if (!updated[tag].includes(resumeId)) updated[tag].push(resumeId);
      return updated;
    });
    setTagInputValue("");
    setShowTagInput(false);
  }

  // Animação de mover currículo para seção da tag
  function handleMoveToTagSection(resumeId: number, tag: string) {
    setAnimatingResumeId(resumeId);
    setTimeout(() => {
      setActiveTagSection(tag);
      setAnimatingResumeId(null);
    }, 400); // tempo da animação
  }
  function handleCommentChange(resumeId: number, value: string) {
    setResumeComments(c => ({ ...c, [resumeId]: value }));
  }

  // Handlers para formulários
  const handleCreateForm = async (formData: any) => {
    try {
      await createForm(formData)
    } catch (error) {
      console.error('Erro ao criar formulário:', error)
    }
  }

  const handleViewAnalytics = async (form: any) => {
    try {
      setLoadingResponses(true)
      const responses = await getFormResponses(form.id)
      setFormResponses(responses)
      setSelectedFormForAnalytics(form)
    } catch (error) {
      console.error('Erro ao carregar análises:', error)
    } finally {
      setLoadingResponses(false)
    }
  }

  const [tab, setTab] = useState("colaboradores");
  // Novo: tela interna de tags
  const [internalTagView, setInternalTagView] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [resumes, setResumes] = useState<Resume[]>(initialResumes);
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [editingResume, setEditingResume] = useState<Resume | null>(null);
  // Filtro de currículos (declarado após todos os useState)
  const filteredResumes = resumes.filter(r => {
    const matchesSearch = search === "" || r.name.toLowerCase().includes(search.toLowerCase()) || r.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = !filterStatus || r.status === filterStatus;
    const matchesPosition = !filterPosition || r.position === filterPosition;
    const matchesDate = !filterDate || r.date === filterDate;
    return matchesSearch && matchesStatus && matchesPosition && matchesDate;
  });

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <span className="text-2xl font-bold tracking-tight">RH</span>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        {/* Navegação interna de tags */}
        {internalTagView && (
          <div className="mb-4 animate-fade-in">
            <div className="flex items-center gap-2 mb-2">
              <Button variant="outline" size="sm" onClick={() => setInternalTagView(null)}>&larr; Voltar</Button>
              <span className="font-bold text-lg">Tag: <span className="text-purple-700">{internalTagView}</span></span>
            </div>
            {/* Filtros extras por status e vaga */}
            <div className="flex flex-wrap gap-2 mb-4">
              <select className="border rounded px-2 py-1 text-sm" value={filterStatus} onChange={e => setFilterStatus(e.target.value)} aria-label="Filtrar por status" title="Filtrar por status">
                <option value="">Todos status</option>
                <option value="Novo">Novo</option>
                <option value="Em análise">Em análise</option>
                <option value="Aprovado">Aprovado</option>
                <option value="Rejeitado">Rejeitado</option>
              </select>
              <select className="border rounded px-2 py-1 text-sm" value={filterPosition} onChange={e => setFilterPosition(e.target.value)} aria-label="Filtrar por vaga" title="Filtrar por vaga">
                <option value="">Todas vagas</option>
                {[...new Set(resumes.map(r => r.position))].map(pos => (
                  <option key={pos} value={pos}>{pos}</option>
                ))}
              </select>
            </div>
            {/* Dashboard estatístico da tag */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-zinc-100 dark:bg-zinc-800 rounded-xl p-4 flex flex-col items-center shadow">
                <span className="text-xs text-zinc-500">Total de currículos</span>
                <span className="text-2xl font-bold text-purple-700">{
                  Object.entries(resumeTags).filter(([_, tags]) => tags.includes(internalTagView)).length
                }</span>
              </div>
              <div className="bg-zinc-100 dark:bg-zinc-800 rounded-xl p-4 flex flex-col items-center shadow">
                <span className="text-xs text-zinc-500">Aprovados</span>
                <span className="text-2xl font-bold text-green-600">{
                  Object.entries(resumeTags).filter(([resumeId, tags]) => {
                    const r = resumes.find(r => r.id === Number(resumeId));
                    return tags.includes(internalTagView) && r?.status === 'Aprovado';
                  }).length
                }</span>
              </div>
              <div className="bg-zinc-100 dark:bg-zinc-800 rounded-xl p-4 flex flex-col items-center shadow">
                <span className="text-xs text-zinc-500">Rejeitados</span>
                <span className="text-2xl font-bold text-red-600">{
                  Object.entries(resumeTags).filter(([resumeId, tags]) => {
                    const r = resumes.find(r => r.id === Number(resumeId));
                    return tags.includes(internalTagView) && r?.status === 'Rejeitado';
                  }).length
                }</span>
              </div>
            </div>
            {/* Tabela de currículos com ações rápidas */}
            <h3 className="font-semibold text-zinc-700 dark:text-zinc-200 mb-2">Currículos com esta tag</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Vaga</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Comentário</TableHead>
                  <TableHead>Histórico</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.entries(resumeTags).flatMap(([resumeId, tags]) =>
                  tags.includes(internalTagView)
                    ? [resumes.find(r => r.id === Number(resumeId))].filter(Boolean)
                    : []
                ).filter((r: any) =>
                  (!filterStatus || r.status === filterStatus) &&
                  (!filterPosition || r.position === filterPosition)
                ).map((r: any) => (
                  <TableRow key={r.id} className="hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                    <TableCell>{r.name}</TableCell>
                    <TableCell>{r.email}</TableCell>
                    <TableCell>{r.position}</TableCell>
                    <TableCell><Badge>{r.status}</Badge></TableCell>
                    <TableCell>
                      <div className="text-xs min-w-[120px]">
                        {resumeComments[r.id] || <span className="text-zinc-400">Nenhum comentário</span>}
                        <div className="mt-1">
                          <textarea
                            className="w-full border border-zinc-300 dark:border-zinc-700 rounded px-2 py-1 text-xs resize-none bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 transition-colors duration-150 focus:bg-zinc-100 dark:focus:bg-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-700 placeholder:text-zinc-500 dark:placeholder:text-zinc-400"
                            rows={2}
                            placeholder="Adicionar comentário..."
                            value={resumeComments[r.id] || ''}
                            onChange={e => handleCommentChange(r.id, e.target.value)}
                            aria-label="Comentário do currículo"
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <ul className="text-xs list-disc ml-2">
                        {(resumeHistory[r.id] || [{ date: r.date, status: r.status }]).map((h, idx) => (
                          <li key={idx}>{h.date} - <b>{h.status}</b></li>
                        ))}
                      </ul>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => setSelectedResume(r)}>Detalhes</Button>
                        <Button size="sm" variant="ghost" onClick={() => setEditingResume(r)}>Editar</Button>
                        <Button size="sm" variant="destructive" onClick={() => setResumes((rs: Resume[]) => rs.filter(res => res.id !== r.id))}>Excluir</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {/* Relatório rápido */}
            <div className="mt-6">
              <h4 className="font-semibold text-zinc-700 dark:text-zinc-200 mb-2">Relatório rápido</h4>
              <ul className="text-xs text-zinc-600 dark:text-zinc-300 list-disc ml-4">
                <li>Total de currículos: <b>{Object.entries(resumeTags).filter(([_, tags]) => tags.includes(internalTagView)).length}</b></li>
                <li>Aprovados: <b>{Object.entries(resumeTags).filter(([resumeId, tags]) => { const r = resumes.find(r => r.id === Number(resumeId)); return tags.includes(internalTagView) && r?.status === 'Aprovado'; }).length}</b></li>
                <li>Rejeitados: <b>{Object.entries(resumeTags).filter(([resumeId, tags]) => { const r = resumes.find(r => r.id === Number(resumeId)); return tags.includes(internalTagView) && r?.status === 'Rejeitado'; }).length}</b></li>
                <li>Última movimentação: <b>{(() => {
                  const all = Object.entries(resumeTags)
                    .flatMap(([resumeId, tags]) => tags.includes(internalTagView) ? [resumes.find(r => r.id === Number(resumeId))] : [])
                    .filter((r): r is Resume => Boolean(r));
                  if (all.length === 0) return '-';
                  return all.map(r => r.date).sort().reverse()[0];
                })()}</b></li>
              </ul>
            </div>
          </div>
        )}
        <Tabs value={tab} onValueChange={setTab} className={internalTagView ? "hidden" : "w-full"}>
          <TabsList className="mb-4">
            <TabsTrigger value="colaboradores"><Users className="mr-2 h-4 w-4" />Colaboradores</TabsTrigger>
            <TabsTrigger value="ferias"><Gift className="mr-2 h-4 w-4" />Férias</TabsTrigger>
            <TabsTrigger value="aniversariantes"><Calendar className="mr-2 h-4 w-4" />Aniversariantes</TabsTrigger>
            <TabsTrigger value="curriculos"><FileText className="mr-2 h-4 w-4" />Currículos</TabsTrigger>
            <TabsTrigger value="formularios"><ClipboardList className="mr-2 h-4 w-4" />Formulários</TabsTrigger>
          </TabsList>
          <TabsContent value="colaboradores">
            <Card className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm rounded-xl transition-colors">
              <CardHeader className="bg-zinc-50 dark:bg-zinc-800/60 border-b border-zinc-200 dark:border-zinc-800 rounded-t-xl">
                <CardTitle className="text-zinc-900 dark:text-zinc-100">Colaboradores</CardTitle>
                <CardDescription className="text-zinc-600 dark:text-zinc-400">Gestão de funcionários ativos, férias e status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center mb-4 gap-2">
                  <Input placeholder="Buscar colaborador..." value={search} onChange={e => setSearch(e.target.value)} className="max-w-xs" />
                  <Button variant="outline" size="sm" onClick={() => { setEditingEmployee(null); setShowEmployeeModal(true); }}><Plus className="h-4 w-4 mr-1" />Novo</Button>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Cargo</TableHead>
                      <TableHead>Departamento</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Admissão</TableHead>
                      <TableHead>Aniversário</TableHead>
                      <TableHead>Email</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Array.isArray(employees) && employees.filter((e: any) => e.name.toLowerCase().includes((search || "").toLowerCase())).map((e: any) => (
                      <TableRow key={e.id}>
                        <TableCell className="flex items-center gap-2">
                          <img src={e.avatar} alt="avatar" className="w-7 h-7 rounded-full border" />
                          <span className="font-medium">{e.name}</span>
                        </TableCell>
                        <TableCell>{e.role}</TableCell>
                        <TableCell>{e.department}</TableCell>
                        <TableCell><Badge variant={e.status === "Ativo" ? "default" : "secondary"}>{e.status}</Badge></TableCell>
                        <TableCell>{e.admission}</TableCell>
                        <TableCell>{e.birthday}</TableCell>
                        <TableCell>{e.email}</TableCell>
                        <TableCell className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => { setEditingEmployee(e); setShowEmployeeModal(true); }}>Editar</Button>
                          <Button size="sm" variant="destructive" onClick={() => setEmployees((emps: Employee[]) => emps.filter(emp => emp.id !== e.id))}>Excluir</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="ferias">
            <Card className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm rounded-xl transition-colors">
              <CardHeader className="bg-zinc-50 dark:bg-zinc-800/60 border-b border-zinc-200 dark:border-zinc-800 rounded-t-xl">
                <CardTitle className="text-zinc-900 dark:text-zinc-100">Férias</CardTitle>
                <CardDescription className="text-zinc-600 dark:text-zinc-400">Controle de férias agendadas e pendentes</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Colaborador</TableHead>
                      <TableHead>Início</TableHead>
                      <TableHead>Fim</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {initialVacations.map(v => (
                      <TableRow key={v.id}>
                        <TableCell>{v.name}</TableCell>
                        <TableCell>{v.start}</TableCell>
                        <TableCell>{v.end}</TableCell>
                        <TableCell><Badge variant={v.status === "Aprovado" ? "default" : "secondary"}>{v.status}</Badge></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="aniversariantes">
            <Card className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm rounded-xl transition-colors">
              <CardHeader className="bg-zinc-50 dark:bg-zinc-800/60 border-b border-zinc-200 dark:border-zinc-800 rounded-t-xl">
                <CardTitle className="text-zinc-900 dark:text-zinc-100">Aniversariantes do Mês</CardTitle>
                <CardDescription className="text-zinc-600 dark:text-zinc-400">Colaboradores que fazem aniversário este mês</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Data</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {initialBirthdays.map(b => (
                      <TableRow key={b.id}>
                        <TableCell>{b.name}</TableCell>
                        <TableCell>{b.date}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="curriculos">
            <Card className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm rounded-xl transition-colors">
              <CardHeader className="bg-zinc-50 dark:bg-zinc-800/60 border-b border-zinc-200 dark:border-zinc-800 rounded-t-xl">
                <CardTitle className="text-zinc-900 dark:text-zinc-100">Currículos Recebidos</CardTitle>
                <CardDescription className="text-zinc-600 dark:text-zinc-400">Gerencie, filtre, analise e anote currículos de candidatos</CardDescription>
              </CardHeader>
              <CardContent>
                {/* Filtros avançados e busca */}
                <div className="flex flex-wrap gap-2 mb-4 items-end">
                  <Input
                    placeholder="Buscar por nome ou email..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="max-w-xs"
                  />
                  <select
                    className="border rounded px-2 py-1 text-sm"
                    value={filterStatus}
                    onChange={e => setFilterStatus(e.target.value)}
                    aria-label="Filtrar por status"
                    title="Filtrar por status"
                  >
                    <option value="">Todos status</option>
                    <option value="Novo">Novo</option>
                    <option value="Em análise">Em análise</option>
                    <option value="Aprovado">Aprovado</option>
                    <option value="Rejeitado">Rejeitado</option>
                  </select>
                  <select
                    className="border rounded px-2 py-1 text-sm"
                    value={filterPosition}
                    onChange={e => setFilterPosition(e.target.value)}
                    aria-label="Filtrar por vaga"
                    title="Filtrar por vaga"
                  >
                    <option value="">Todas vagas</option>
                    {[...new Set(resumes.map(r => r.position))].map(pos => (
                      <option key={pos} value={pos}>{pos}</option>
                    ))}
                  </select>
                  <Input
                    type="date"
                    className="max-w-[140px]"
                    value={filterDate}
                    onChange={e => setFilterDate(e.target.value)}
                    aria-label="Filtrar por data"
                  />
                  <Button variant="outline" size="sm" onClick={() => { setFilterStatus(''); setFilterPosition(''); setFilterDate(''); setSearch(''); }}>Limpar filtros</Button>
                  <Button variant="default" size="sm" onClick={() => setShowResumeModal(true)}><Plus className="h-4 w-4 mr-1" />Novo Currículo</Button>
                </div>
                {/* Seção de navegação por tags */}
                {Object.keys(tagSections).length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="text-sm font-medium text-zinc-700 dark:text-zinc-200">Ver por tag:</span>
                    {Object.keys(tagSections).map(tag => (
                      <button
                        key={tag}
                        className={`px-3 py-1 rounded-full border text-xs font-medium transition-colors duration-150 ${activeTagSection === tag ? 'bg-purple-600 text-white border-purple-600' : 'bg-zinc-100 dark:bg-zinc-800 text-purple-800 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-700'}`}
                        onClick={() => setActiveTagSection(tag)}
                      >
                        {tag} <span className="ml-1">({tagSections[tag].length})</span>
                      </button>
                    ))}
                    {activeTagSection && (
                      <button className="ml-2 text-xs text-zinc-500 underline" onClick={() => setActiveTagSection(null)}>Ver todos</button>
                    )}
                  </div>
                )}
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Vaga</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Tags</TableHead>
                      <TableHead>Arquivo</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(activeTagSection
                      ? filteredResumes.filter(r => tagSections[activeTagSection]?.includes(r.id!))
                      : filteredResumes
                    ).map(r => {
                      let fileUrl: string | null = null;
                      let isBlob = false;
                      if (r.file && r.file.startsWith('blob:')) {
                        fileUrl = r.file;
                        isBlob = true;
                      }
                      function handleMockDownload(fileName: string) {
                        const pdfContent = new Uint8Array([
                          0x25,0x50,0x44,0x46,0x2D,0x31,0x2E,0x34,0x0A,0x25,0xE2,0xE3,0xCF,0xD3,0x0A,0x31,0x20,0x30,0x20,0x6F,0x62,0x6A,0x0A,0x3C,0x3C,0x2F,0x54,0x79,0x70,0x65,0x2F,0x43,0x61,0x74,0x61,0x6C,0x6F,0x67,0x2F,0x50,0x61,0x67,0x65,0x73,0x20,0x32,0x20,0x30,0x20,0x52,0x2F,0x4F,0x70,0x65,0x6E,0x41,0x63,0x74,0x69,0x6F,0x6E,0x73,0x20,0x33,0x20,0x30,0x20,0x52,0x3E,0x3E,0x0A,0x65,0x6E,0x64,0x6F,0x62,0x6A,0x0A,0x32,0x20,0x30,0x20,0x6F,0x62,0x6A,0x0A,0x3C,0x3C,0x2F,0x54,0x79,0x70,0x65,0x2F,0x50,0x61,0x67,0x65,0x73,0x2F,0x4B,0x69,0x64,0x73,0x5B,0x34,0x20,0x30,0x20,0x52,0x5D,0x2F,0x43,0x6F,0x75,0x6E,0x74,0x20,0x31,0x3E,0x3E,0x0A,0x65,0x6E,0x64,0x6F,0x62,0x6A,0x0A,0x33,0x20,0x30,0x20,0x6F,0x62,0x6A,0x0A,0x3C,0x3C,0x2F,0x4C,0x65,0x6E,0x67,0x74,0x68,0x20,0x30,0x3E,0x3E,0x0A,0x65,0x6E,0x64,0x6F,0x62,0x6A,0x0A,0x78,0x72,0x65,0x66,0x0A,0x30,0x20,0x34,0x0A,0x30,0x30,0x30,0x30,0x30,0x30,0x30,0x30,0x20,0x36,0x35,0x35,0x33,0x35,0x20,0x66,0x0A,0x30,0x30,0x30,0x30,0x30,0x30,0x30,0x31,0x20,0x30,0x30,0x30,0x30,0x30,0x20,0x6E,0x0A,0x30,0x30,0x30,0x30,0x30,0x30,0x30,0x32,0x20,0x30,0x30,0x30,0x30,0x30,0x20,0x6E,0x0A,0x30,0x30,0x30,0x30,0x30,0x30,0x30,0x33,0x20,0x30,0x30,0x30,0x30,0x30,0x20,0x6E,0x0A,0x74,0x72,0x61,0x69,0x6C,0x65,0x72,0x0A,0x3C,0x3C,0x2F,0x52,0x6F,0x6F,0x74,0x20,0x31,0x20,0x30,0x20,0x52,0x2F,0x53,0x69,0x7A,0x65,0x20,0x34,0x3E,0x3E,0x0A,0x73,0x74,0x61,0x72,0x74,0x78,0x72,0x65,0x66,0x0A,0x25,0x25,0x45,0x4F,0x46,0x0A
                        ]);
                        const blob = new Blob([pdfContent], { type: 'application/pdf' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = fileName;
                        document.body.appendChild(a);
                        a.click();
                        setTimeout(() => {
                          document.body.removeChild(a);
                          URL.revokeObjectURL(url);
                        }, 100);
                      }
                      return (
                        <TableRow key={r.id} className="group cursor-pointer bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors" onClick={e => {
                          const target = e.target as HTMLElement;
                          if (target.tagName === 'BUTTON' || target.tagName === 'A' || target.closest('button') || target.closest('a')) return;
                          setSelectedResume(r); setShowDetailModal(true);
                        }}>
                          <TableCell>{r.name}</TableCell>
                          <TableCell>{r.email}</TableCell>
                          <TableCell>{r.position}</TableCell>
                          <TableCell>
                            <Badge variant={r.status === "Novo" ? "default" : r.status === "Aprovado" ? "outline" : r.status === "Rejeitado" ? "destructive" : "secondary"}>{r.status}</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {(resumeTags[r.id!] || []).map((tag, idx) => (
                                <span
                                  key={idx}
                                  className={`bg-zinc-200 dark:bg-zinc-700 text-purple-800 px-2 py-0.5 rounded text-xs font-medium transition-colors duration-150 border border-zinc-300 dark:border-zinc-600 cursor-pointer relative overflow-hidden ${animatingResumeId === r.id ? 'animate-pulse ring-2 ring-purple-400' : ''}`}
                                  title={`Ver currículos com a tag ${tag}`}
                                  onClick={e => { e.stopPropagation(); setInternalTagView(tag); }}
                                >
                                  {tag}
                                  {activeTagSection !== tag && (
                                    <span className="ml-1 text-[10px] text-purple-400 animate-bounce">→</span>
                                  )}
                                </span>
                              ))}
                              <button
                                type="button"
                                className="text-xs text-purple-600 underline ml-1 hover:text-purple-800 dark:hover:text-purple-400 transition-colors"
                                onClick={e => { e.stopPropagation(); setTagInputResumeId(r.id!); setTagInputValue(''); setShowTagInput(true); }}
                                title="Adicionar tag"
                                aria-label="Adicionar tag"
                              >+ Tag</button>
                            </div>
                          </TableCell>
                          <TableCell>
                            {r.file ? (
                              <div className="flex items-center gap-2">
                                {isBlob ? (
                                  <a
                                    href={fileUrl!}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group relative flex items-center px-2 py-1 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 shadow-sm hover:from-blue-100 hover:to-blue-200 transition focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    title={r.file}
                                  >
                                    <Download className="h-4 w-4 text-blue-600 group-hover:text-blue-800 transition" />
                                    <span className="truncate max-w-[80px] text-blue-900 font-medium ml-1">{r.file}</span>
                                    <span className="absolute left-1/2 -bottom-7 -translate-x-1/2 opacity-0 group-hover:opacity-100 pointer-events-none bg-blue-800 text-white text-xs rounded px-2 py-1 shadow transition">Baixar</span>
                                  </a>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={e => { e.stopPropagation(); handleMockDownload(r.file); }}
                                    className="group relative flex items-center px-2 py-1 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 shadow-sm hover:from-blue-100 hover:to-blue-200 transition focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    title={`Baixar PDF simulado: ${r.file}`}
                                    aria-label={`Baixar PDF simulado: ${r.file}`}
                                  >
                                    <Download className="h-4 w-4 text-blue-600 group-hover:text-blue-800 transition" />
                                    <span className="truncate max-w-[80px] text-blue-900 font-medium ml-1">{r.file}</span>
                                    <span className="absolute left-1/2 -bottom-7 -translate-x-1/2 opacity-0 group-hover:opacity-100 pointer-events-none bg-blue-800 text-white text-xs rounded px-2 py-1 shadow transition">Baixar</span>
                                  </button>
                                )}
                                <button
                                  type="button"
                                  onClick={e => {
                                    e.stopPropagation();
                                    if (isBlob && fileUrl) {
                                      window.open(fileUrl, '_blank', 'noopener,noreferrer');
                                    } else {
                                      const pdfContent = new Uint8Array([
                                        0x25,0x50,0x44,0x46,0x2D,0x31,0x2E,0x34,0x0A,0x25,0xE2,0xE3,0xCF,0xD3,0x0A,0x31,0x20,0x30,0x20,0x6F,0x62,0x6A,0x0A,0x3C,0x3C,0x2F,0x54,0x79,0x70,0x65,0x2F,0x43,0x61,0x74,0x61,0x6C,0x6F,0x67,0x2F,0x50,0x61,0x67,0x65,0x73,0x20,0x32,0x20,0x30,0x20,0x52,0x2F,0x4F,0x70,0x65,0x6E,0x41,0x63,0x74,0x69,0x6F,0x6E,0x73,0x20,0x33,0x20,0x30,0x20,0x52,0x3E,0x3E,0x0A,0x65,0x6E,0x64,0x6F,0x62,0x6A,0x0A,0x32,0x20,0x30,0x20,0x6F,0x62,0x6A,0x0A,0x3C,0x3C,0x2F,0x54,0x79,0x70,0x65,0x2F,0x50,0x61,0x67,0x65,0x73,0x2F,0x4B,0x69,0x64,0x73,0x5B,0x34,0x20,0x30,0x20,0x52,0x5D,0x2F,0x43,0x6F,0x75,0x6E,0x74,0x20,0x31,0x3E,0x3E,0x0A,0x65,0x6E,0x64,0x6F,0x62,0x6A,0x0A,0x33,0x20,0x30,0x20,0x6F,0x62,0x6A,0x0A,0x3C,0x3C,0x2F,0x4C,0x65,0x6E,0x67,0x74,0x68,0x20,0x30,0x3E,0x3E,0x0A,0x65,0x6E,0x64,0x6F,0x62,0x6A,0x0A,0x78,0x72,0x65,0x66,0x0A,0x30,0x20,0x34,0x0A,0x30,0x30,0x30,0x30,0x30,0x30,0x30,0x30,0x20,0x36,0x35,0x35,0x33,0x35,0x20,0x66,0x0A,0x30,0x30,0x30,0x30,0x30,0x30,0x30,0x31,0x20,0x30,0x30,0x30,0x30,0x30,0x20,0x6E,0x0A,0x30,0x30,0x30,0x30,0x30,0x30,0x30,0x32,0x20,0x30,0x30,0x30,0x30,0x30,0x20,0x6E,0x0A,0x30,0x30,0x30,0x30,0x30,0x30,0x30,0x33,0x20,0x30,0x30,0x30,0x30,0x30,0x20,0x6E,0x0A,0x74,0x72,0x61,0x69,0x6C,0x65,0x72,0x0A,0x3C,0x3C,0x2F,0x52,0x6F,0x6F,0x74,0x20,0x31,0x20,0x30,0x20,0x52,0x2F,0x53,0x69,0x7A,0x65,0x20,0x34,0x3E,0x3E,0x0A,0x73,0x74,0x61,0x72,0x74,0x78,0x72,0x65,0x66,0x0A,0x25,0x25,0x45,0x4F,0x46,0x0A
                                      ]);
                                      const blob = new Blob([pdfContent], { type: 'application/pdf' });
                                      const url = URL.createObjectURL(blob);
                                      window.open(url, '_blank', 'noopener,noreferrer');
                                      setTimeout(() => URL.revokeObjectURL(url), 1000);
                                    }
                                  }}
                                  className="group relative flex items-center px-2 py-1 rounded-lg bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 shadow-sm hover:from-purple-100 hover:to-purple-200 transition focus:outline-none focus:ring-2 focus:ring-purple-400"
                                  title={`Analisar PDF: ${r.file}`}
                                  aria-label={`Analisar PDF: ${r.file}`}
                                >
                                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M8 2h8a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zm0 0v20m8-20v20"/></svg>
                                  <span className="sr-only">Analisar</span>
                                  <span className="absolute left-1/2 -bottom-7 -translate-x-1/2 opacity-0 group-hover:opacity-100 pointer-events-none bg-purple-800 text-white text-xs rounded px-2 py-1 shadow transition">Analisar</span>
                                </button>
                              </div>
                            ) : (
                              <span className="text-xs text-gray-400">Sem arquivo</span>
                            )}
                          </TableCell>
                          <TableCell>{r.date}</TableCell>
                          <TableCell>
                            <div className="flex flex-col gap-1">
                              <Button size="icon" variant="ghost" onClick={e => { e.stopPropagation(); setEditingResume(r as Resume); setShowResumeModal(true); }} title="Editar">
                                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15.232 5.232l3.536 3.536M9 13l6.071-6.071a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-1.414.586H7v-3a2 2 0 01.586-1.414z"/></svg>
                              </Button>
                              <Button size="icon" variant="ghost" onClick={e => { e.stopPropagation(); setResumes((rs: Resume[]) => rs.filter(res => res.id !== r.id)); }} title="Excluir">
                                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
                              </Button>
                            </div>
                            {/* Comentários rápidos */}
                            <div className="mt-1">
                              <textarea
                                className="w-full border border-zinc-300 dark:border-zinc-700 rounded px-2 py-1 text-xs resize-none bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 transition-colors duration-150 focus:bg-zinc-100 dark:focus:bg-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-700 placeholder:text-zinc-500 dark:placeholder:text-zinc-400"
                                rows={2}
                                placeholder="Adicionar comentário..."
                                value={resumeComments[r.id!] || ''}
                                onChange={e => handleCommentChange(r.id!, e.target.value)}
                                onClick={e => e.stopPropagation()}
                                aria-label="Comentário do currículo"
                              />
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
                {/* Input de tag dinâmico */}
                {showTagInput && (
                  <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30" onClick={() => setShowTagInput(false)}>
                    <div className="bg-zinc-900 dark:bg-zinc-900 rounded shadow-lg p-4 min-w-[260px]" onClick={e => e.stopPropagation()}>
                      <div className="mb-2 font-medium text-sm">Adicionar tag</div>
                      <input
                        className="border rounded px-2 py-1 w-full text-sm mb-2"
                        value={tagInputValue}
                        onChange={e => setTagInputValue(e.target.value)}
                        onKeyDown={e => {
                          if (e.key === 'Enter' && tagInputValue.trim()) {
                            handleAddTag(tagInputResumeId, tagInputValue.trim());
                            setShowTagInput(false);
                          }
                        }}
                        placeholder="Ex: React, Inglês, Proativo..."
                        autoFocus
                      />
                      <div className="flex gap-2 justify-end">
                        <Button size="sm" variant="outline" onClick={() => setShowTagInput(false)}>Cancelar</Button>
                        <Button size="sm" onClick={() => { if (tagInputValue.trim()) { handleAddTag(tagInputResumeId, tagInputValue.trim()); setShowTagInput(false); } }}>Adicionar</Button>
                      </div>
                    </div>
                  </div>
                )}
                {/* Modal de detalhes do currículo */}
                <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
                  <DialogContent className="max-w-xl">
                    <DialogHeader>
                      <DialogTitle>Detalhes do Currículo</DialogTitle>
                      <DialogDescription>Informações completas do candidato</DialogDescription>
                    </DialogHeader>
                    {selectedResume && (
                      <div className="flex flex-col gap-2">
                        <div className="flex flex-wrap gap-4 items-center">
                          <span className="font-bold text-lg">{selectedResume.name}</span>
                          <span className="text-sm text-gray-600">{selectedResume.email}</span>
                          <Badge>{selectedResume.status}</Badge>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <span className="text-sm">Vaga: <b>{selectedResume.position}</b></span>
                          <span className="text-sm">Recebido em: <b>{selectedResume.date}</b></span>
                        </div>
                        <div className="flex flex-wrap gap-2 items-center">
                          <span className="text-sm">Tags:</span>
                          {(resumeTags[selectedResume.id!] || []).map((tag, idx) => (
                            <span
                              key={idx}
                              className="bg-zinc-100 dark:bg-zinc-800 text-purple-800 px-2 py-0.5 rounded text-xs font-medium transition-colors duration-150 hover:bg-zinc-200 dark:hover:bg-zinc-700 border border-zinc-200 dark:border-zinc-700 cursor-default"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        <div className="mt-2">
                          <span className="font-medium text-sm">Comentário:</span>
                          <div className="border rounded px-2 py-1 text-xs bg-zinc-100 dark:bg-zinc-800 min-h-[40px] transition-colors duration-150 focus-within:bg-zinc-200 dark:focus-within:bg-zinc-700">{resumeComments[selectedResume.id!] || <span className="text-gray-400">Nenhum comentário</span>}</div>
                        </div>
                        <div className="mt-2">
                          <span className="font-medium text-sm">Histórico de análise:</span>
                          <ul className="text-xs list-disc ml-4">
                            {(resumeHistory[selectedResume.id!] || [{ date: selectedResume.date, status: selectedResume.status }]).map((h, idx) => (
                              <li key={idx}>{h.date} - <b>{h.status}</b></li>
                            ))}
                          </ul>
                        </div>
                        <div className="mt-2 flex gap-2">
                          {selectedResume.file && (
                            <Button size="sm" variant="outline" onClick={() => {
                              if (selectedResume.file.startsWith('blob:')) {
                                window.open(selectedResume.file, '_blank', 'noopener,noreferrer');
                              } else {
                                const pdfContent = new Uint8Array([
                                  0x25,0x50,0x44,0x46,0x2D,0x31,0x2E,0x34,0x0A,0x25,0xE2,0xE3,0xCF,0xD3,0x0A,0x31,0x20,0x30,0x20,0x6F,0x62,0x6A,0x0A,0x3C,0x3C,0x2F,0x54,0x79,0x70,0x65,0x2F,0x43,0x61,0x74,0x61,0x6C,0x6F,0x67,0x2F,0x50,0x61,0x67,0x65,0x73,0x20,0x32,0x20,0x30,0x20,0x52,0x2F,0x4F,0x70,0x65,0x6E,0x41,0x63,0x74,0x69,0x6F,0x6E,0x73,0x20,0x33,0x20,0x30,0x20,0x52,0x3E,0x3E,0x0A,0x65,0x6E,0x64,0x6F,0x62,0x6A,0x0A,0x32,0x20,0x30,0x20,0x6F,0x62,0x6A,0x0A,0x3C,0x3C,0x2F,0x54,0x79,0x70,0x65,0x2F,0x50,0x61,0x67,0x65,0x73,0x2F,0x4B,0x69,0x64,0x73,0x5B,0x34,0x20,0x30,0x20,0x52,0x5D,0x2F,0x43,0x6F,0x75,0x6E,0x74,0x20,0x31,0x3E,0x3E,0x0A,0x65,0x6E,0x64,0x6F,0x62,0x6A,0x0A,0x33,0x20,0x30,0x20,0x6F,0x62,0x6A,0x0A,0x3C,0x3C,0x2F,0x4C,0x65,0x6E,0x67,0x74,0x68,0x20,0x30,0x3E,0x3E,0x0A,0x65,0x6E,0x64,0x6F,0x62,0x6A,0x0A,0x78,0x72,0x65,0x66,0x0A,0x30,0x20,0x34,0x0A,0x30,0x30,0x30,0x30,0x30,0x30,0x30,0x30,0x20,0x36,0x35,0x35,0x33,0x35,0x20,0x66,0x0A,0x30,0x30,0x30,0x30,0x30,0x30,0x30,0x31,0x20,0x30,0x30,0x30,0x30,0x30,0x20,0x6E,0x0A,0x30,0x30,0x30,0x30,0x30,0x30,0x30,0x32,0x20,0x30,0x30,0x30,0x30,0x30,0x20,0x6E,0x0A,0x30,0x30,0x30,0x30,0x30,0x30,0x30,0x33,0x20,0x30,0x30,0x30,0x30,0x30,0x20,0x6E,0x0A,0x74,0x72,0x61,0x69,0x6C,0x65,0x72,0x0A,0x3C,0x3C,0x2F,0x52,0x6F,0x6F,0x74,0x20,0x31,0x20,0x30,0x20,0x52,0x2F,0x53,0x69,0x7A,0x65,0x20,0x34,0x3E,0x3E,0x0A,0x73,0x74,0x61,0x72,0x74,0x78,0x72,0x65,0x66,0x0A,0x25,0x25,0x45,0x4F,0x46,0x0A
                                ]);
                                const blob = new Blob([pdfContent], { type: 'application/pdf' });
                                const url = URL.createObjectURL(blob);
                                window.open(url, '_blank', 'noopener,noreferrer');
                                setTimeout(() => URL.revokeObjectURL(url), 1000);
                              }
                            }}>
                              Visualizar PDF
                            </Button>
                          )}
                        </div>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="formularios">
            {selectedFormForAnalytics ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setSelectedFormForAnalytics(null)}
                  >
                    ← Voltar
                  </Button>
                </div>
                <FormAnalytics 
                  form={selectedFormForAnalytics} 
                  responses={formResponses}
                  loading={loadingResponses}
                />
              </div>
            ) : (
              <Card className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm rounded-xl transition-colors">
                <CardHeader className="bg-zinc-50 dark:bg-zinc-800/60 border-b border-zinc-200 dark:border-zinc-800 rounded-t-xl">
                  <CardTitle className="text-zinc-900 dark:text-zinc-100">Formulários Google Forms</CardTitle>
                  <CardDescription className="text-zinc-600 dark:text-zinc-400">Crie e gerencie formulários para pesquisas e avaliações</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-zinc-600 dark:text-zinc-400">
                        {forms.length} formulário{forms.length !== 1 ? 's' : ''} encontrado{forms.length !== 1 ? 's' : ''}
                      </span>
                      {formsError && (
                        <span className="text-sm text-red-600 dark:text-red-400">
                          {formsError}
                        </span>
                      )}
                    </div>
                    <Button onClick={() => setShowFormBuilder(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Criar Formulário
                    </Button>
                  </div>

                  {formsLoading ? (
                    <div className="space-y-4">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="animate-pulse">
                          <div className="h-24 bg-zinc-200 dark:bg-zinc-700 rounded-lg"></div>
                        </div>
                      ))}
                    </div>
                  ) : forms.length === 0 ? (
                    <div className="text-center py-12">
                      <ClipboardList className="h-12 w-12 text-zinc-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
                        Nenhum formulário criado
                      </h3>
                      <p className="text-zinc-600 dark:text-zinc-400 mb-6">
                        Comece criando seu primeiro formulário para coletar feedback e dados dos colaboradores.
                      </p>
                      <Button onClick={() => setShowFormBuilder(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Criar Primeiro Formulário
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {forms.map(form => (
                        <div key={form.id} className="border border-zinc-200 dark:border-zinc-700 rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
                                  {form.title}
                                </h3>
                                <Badge 
                                  variant={form.status === 'active' ? 'default' : 'secondary'}
                                  className="text-xs"
                                >
                                  {form.status === 'active' ? 'Ativo' : 
                                   form.status === 'draft' ? 'Rascunho' : 'Inativo'}
                                </Badge>
                              </div>
                              {form.description && (
                                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-3">
                                  {form.description}
                                </p>
                              )}
                              <div className="flex items-center gap-4 text-sm text-zinc-500 dark:text-zinc-400">
                                <span>
                                  <Users className="h-4 w-4 inline mr-1" />
                                  {form.responseCount} respostas
                                </span>
                                <span>Criado em {form.createdAt}</span>
                                <span>Atualizado em {form.updatedAt}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 ml-4">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleViewAnalytics(form)}
                              >
                                <BarChart3 className="h-4 w-4 mr-1" />
                                Análises
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => window.open(form.url, '_blank')}
                              >
                                <ExternalLink className="h-4 w-4 mr-1" />
                                Abrir
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => updateFormStatus(form.id, form.status === 'active' ? 'inactive' : 'active')}
                              >
                                {form.status === 'active' ? 'Desativar' : 'Ativar'}
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* Modal Colaborador */}
        <Dialog open={showEmployeeModal} onOpenChange={setShowEmployeeModal}>
          <DialogContent className="max-w-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl rounded-xl transition-colors">
            <DialogHeader className="bg-zinc-50 dark:bg-zinc-800/60 border-b border-zinc-200 dark:border-zinc-800 rounded-t-xl">
              <DialogTitle className="text-zinc-900 dark:text-zinc-100">{editingEmployee ? "Editar Colaborador" : "Novo Colaborador"}</DialogTitle>
              <DialogDescription className="text-zinc-600 dark:text-zinc-400">Preencha os dados do colaborador.</DialogDescription>
            </DialogHeader>
            <EmployeeForm
              initial={editingEmployee}
              onSave={data => {
                if (editingEmployee) {
                  setEmployees((emps: Employee[]) => emps.map(e => e.id === editingEmployee.id ? { ...e, ...data } : e));
                } else {
                  setEmployees((emps: Employee[]) => [...emps, { ...data, id: Date.now(), avatar: "/placeholder-user.jpg" }]);
                }
                setShowEmployeeModal(false);
              }}
              onCancel={() => setShowEmployeeModal(false)}
            />
          </DialogContent>
        </Dialog>

        {/* Modal Currículo */}
        <Dialog open={showResumeModal} onOpenChange={setShowResumeModal}>
          <DialogContent className="max-w-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl rounded-xl transition-colors">
            <DialogHeader className="bg-zinc-50 dark:bg-zinc-800/60 border-b border-zinc-200 dark:border-zinc-800 rounded-t-xl">
              <DialogTitle className="text-zinc-900 dark:text-zinc-100">{editingResume ? "Editar Currículo" : "Novo Currículo"}</DialogTitle>
              <DialogDescription className="text-zinc-600 dark:text-zinc-400">Preencha os dados do candidato.</DialogDescription>
            </DialogHeader>
            <ResumeForm
              initial={editingResume}
              onSave={data => {
                if (editingResume) {
                  setResumes((rs: Resume[]) => rs.map(r => r.id === editingResume.id ? { ...r, ...data } : r));
                } else {
                  setResumes((rs: Resume[]) => [...rs, { ...data, id: Date.now() }]);
                }
                setShowResumeModal(false);
              }}
              onCancel={() => setShowResumeModal(false)}
            />
          </DialogContent>
        </Dialog>

        {/* Modal Form Builder */}
        <GoogleFormsBuilder 
          open={showFormBuilder}
          onOpenChange={setShowFormBuilder}
          onSubmit={handleCreateForm}
          loading={formsLoading}
        />

      </div>
      </SidebarInset>
    )
}

// Tipos auxiliares para tipagem dos formulários


type Employee = {
  id?: number;
  name: string;
  email: string;
  role: string;
  department: string;
  status: string;
  admission: string;
  birthday: string;
  avatar?: string;
};

type Resume = {
  id?: number;
  name: string;
  email: string;
  position: string;
  status: string;
  file: string;
  date: string;
};

type EmployeeFormProps = {
  initial: Employee | null;
  onSave: (data: Employee) => void;
  onCancel: () => void;
};

type ResumeFormProps = {
  initial: Resume | null;
  onSave: (data: Resume) => void;
  onCancel: () => void;
};

function EmployeeForm({ initial, onSave, onCancel }: EmployeeFormProps) {
  const [form, setForm] = useState<Employee>(
    initial ? { ...initial } : { name: '', email: '', role: '', department: '', status: 'Ativo', admission: '', birthday: '', avatar: '' }
  );
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [avatarPreview, setAvatarPreview] = useState<string>(form.avatar ?? '/placeholder-user.jpg');

  function validate() {
    const newErrors: { [key: string]: string } = {};
    if (!form.name) newErrors.name = 'Nome é obrigatório';
    if (!form.email) newErrors.email = 'Email é obrigatório';
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) newErrors.email = 'Email inválido';
    if (!form.role) newErrors.role = 'Cargo é obrigatório';
    if (!form.department) newErrors.department = 'Departamento é obrigatório';
    if (!form.admission) newErrors.admission = 'Data de admissão é obrigatória';
    if (!form.birthday) newErrors.birthday = 'Data de nascimento é obrigatória';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setErrors(errs => ({ ...errs, avatar: 'Arquivo deve ser uma imagem.' }));
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        setErrors(errs => ({ ...errs, avatar: 'Imagem deve ter no máximo 2MB.' }));
        return;
      }
      setErrors(errs => ({ ...errs, avatar: '' }));
      const reader = new FileReader();
      reader.onload = ev => {
        setAvatarPreview(ev.target?.result as string);
        setForm(f => ({ ...f, avatar: ev.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={e => {
      e.preventDefault();
      if (validate()) onSave(form);
    }}>
      <div className="flex items-center gap-4">
        <img src={avatarPreview} alt="avatar" className="w-14 h-14 rounded-full border object-cover" />
        <div>
          <label htmlFor="avatar-upload" className="block text-xs font-medium mb-1">Foto do Colaborador</label>
          <input id="avatar-upload" type="file" accept="image/*" onChange={handleAvatarChange} className="block text-xs" title="Selecione uma imagem" />
          {errors.avatar && <span className="text-xs text-red-500">{errors.avatar}</span>}
        </div>
      </div>
      <div>
        <Input placeholder="Nome" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required autoFocus />
        {errors.name && <span className="text-xs text-red-500">{errors.name}</span>}
      </div>
      <div>
        <Input placeholder="Email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required type="email" />
        {errors.email && <span className="text-xs text-red-500">{errors.email}</span>}
      </div>
      <div className="flex gap-2">
        <div className="flex-1">
          <Input placeholder="Cargo" value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} required />
          {errors.role && <span className="text-xs text-red-500">{errors.role}</span>}
        </div>
        <div className="flex-1">
          <Input placeholder="Departamento" value={form.department} onChange={e => setForm(f => ({ ...f, department: e.target.value }))} required />
          {errors.department && <span className="text-xs text-red-500">{errors.department}</span>}
        </div>
      </div>
      <div className="flex gap-2">
        <div className="flex-1">
          <Input placeholder="Data de Admissão" type="date" value={form.admission} onChange={e => setForm(f => ({ ...f, admission: e.target.value }))} required />
          {errors.admission && <span className="text-xs text-red-500">{errors.admission}</span>}
        </div>
        <div className="flex-1">
          <Input placeholder="Data de Nascimento" type="date" value={form.birthday} onChange={e => setForm(f => ({ ...f, birthday: e.target.value }))} required />
          {errors.birthday && <span className="text-xs text-red-500">{errors.birthday}</span>}
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium mb-1">Status</label>
        <select
          className="block w-full border rounded px-2 py-1 text-sm"
          value={form.status}
          onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
          title="Status do colaborador"
          aria-label="Status do colaborador"
        >
          <option value="Ativo">Ativo</option>
          <option value="Férias">Férias</option>
          <option value="Desligado">Desligado</option>
        </select>
      </div>
      <div className="flex gap-2 justify-end mt-2">
        <Button variant="outline" type="button" onClick={onCancel}>Cancelar</Button>
        <Button type="submit">Salvar</Button>
      </div>
    </form>
  );
}

function ResumeForm({ initial, onSave, onCancel }: ResumeFormProps) {
  const [form, setForm] = useState<Resume>(
    initial ? { ...initial } : { name: '', email: '', position: '', status: 'Novo', file: '', date: '' }
  );
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [fileName, setFileName] = useState<string>(form.file || '');
  const [fileUrl, setFileUrl] = useState<string | null>(null);

  function validate() {
    const newErrors: { [key: string]: string } = {};
    if (!form.name) newErrors.name = 'Nome é obrigatório';
    if (!form.email) newErrors.email = 'Email é obrigatório';
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) newErrors.email = 'Email inválido';
    if (!form.position) newErrors.position = 'Vaga é obrigatória';
    if (!form.status) newErrors.status = 'Status é obrigatório';
    if (!fileName) newErrors.file = 'Arquivo é obrigatório';
    if (!form.date) newErrors.date = 'Data de recebimento é obrigatória';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.name.endsWith('.pdf')) {
        setErrors(errs => ({ ...errs, file: 'Apenas arquivos PDF são permitidos.' }));
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setErrors(errs => ({ ...errs, file: 'Arquivo deve ter no máximo 5MB.' }));
        return;
      }
      setErrors(errs => ({ ...errs, file: '' }));
      setFileName(file.name);
      setForm(f => ({ ...f, file: file.name }));
      setFileUrl(URL.createObjectURL(file));
    }
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={e => {
      e.preventDefault();
      if (validate()) onSave({ ...form, file: fileName });
    }}>
      <div>
        <Input placeholder="Nome" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required autoFocus />
        {errors.name && <span className="text-xs text-red-500">{errors.name}</span>}
      </div>
      <div>
        <Input placeholder="Email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required type="email" />
        {errors.email && <span className="text-xs text-red-500">{errors.email}</span>}
      </div>
      <div className="flex gap-2">
        <div className="flex-1">
          <Input placeholder="Vaga" value={form.position} onChange={e => setForm(f => ({ ...f, position: e.target.value }))} required />
          {errors.position && <span className="text-xs text-red-500">{errors.position}</span>}
        </div>
        <div className="flex-1">
          <label htmlFor="status-curriculo" className="block text-xs font-medium mb-1">Status</label>
          <select
            id="status-curriculo"
            className="block w-full border rounded px-2 py-1 text-sm"
            value={form.status}
            onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
            title="Selecione o status do currículo"
            aria-label="Status do currículo"
          >
            <option value="Novo">Novo</option>
            <option value="Em análise">Em análise</option>
            <option value="Aprovado">Aprovado</option>
            <option value="Rejeitado">Rejeitado</option>
          </select>
          {errors.status && <span className="text-xs text-red-500">{errors.status}</span>}
        </div>
      </div>
      <div>
        <label htmlFor="file-upload" className="block text-xs font-medium mb-1">Arquivo (PDF)</label>
        <input id="file-upload" type="file" accept="application/pdf" onChange={handleFileChange} className="block text-xs" title="Selecione um PDF" />
        {fileName && <span className="text-xs text-gray-600">Selecionado: {fileName}</span>}
        {fileUrl && <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="ml-2 text-xs text-blue-600 underline">Visualizar</a>}
        {errors.file && <span className="block text-xs text-red-500">{errors.file}</span>}
      </div>
      <div>
        <Input placeholder="Data de Recebimento" type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} required />
        {errors.date && <span className="text-xs text-red-500">{errors.date}</span>}
      </div>
      <div className="flex gap-2 justify-end mt-2">
        <Button variant="outline" type="button" onClick={onCancel}>Cancelar</Button>
        <Button type="submit">Salvar</Button>
      </div>
    </form>
  );
}
