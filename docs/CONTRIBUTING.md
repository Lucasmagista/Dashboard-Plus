# 🤝 Guia de Contribuição - CRM Pro Dashboard

## 📋 Índice

- [Bem-vindo](#bem-vindo)
- [Como Contribuir](#como-contribuir)
- [Código de Conduta](#código-de-conduta)
- [Configuração do Ambiente](#configuração-do-ambiente)
- [Padrões de Desenvolvimento](#padrões-de-desenvolvimento)
- [Processo de Pull Request](#processo-de-pull-request)
- [Testes](#testes)
- [Documentação](#documentação)
- [Issues e Bug Reports](#issues-e-bug-reports)
- [Segurança](#segurança)
- [Reconhecimento](#reconhecimento)

---

## 👋 Bem-vindo

Obrigado por considerar contribuir para o CRM Pro Dashboard! Sua participação é fundamental para tornar este projeto ainda melhor.

### Tipos de Contribuição

Valorizamos todos os tipos de contribuição:

- 🐛 **Bug Reports** - Relatar problemas encontrados
- 💡 **Feature Requests** - Sugerir novas funcionalidades
- 📝 **Documentação** - Melhorar ou criar documentação
- 🧪 **Testes** - Adicionar ou melhorar testes
- 🎨 **UI/UX** - Melhorias na interface do usuário
- 🔧 **Código** - Implementar correções ou funcionalidades
- 🌐 **Tradução** - Traduzir a aplicação para outras linguagens
- 📊 **Performance** - Otimizações de performance

---

## 🚀 Como Contribuir

### 1. Fork do Repositório

```bash
# Faça fork do repositório no GitHub
# Depois clone seu fork
git clone https://github.com/seu-usuario/crm-dashboard.git
cd crm-dashboard

# Adicione o repositório original como upstream
git remote add upstream https://github.com/original/crm-dashboard.git
```

### 2. Crie uma Branch

```bash
# Crie uma branch para sua contribuição
git checkout -b feature/nova-funcionalidade
# ou
git checkout -b fix/correcao-bug
# ou
git checkout -b docs/melhoria-documentacao
```

### 3. Faça suas Alterações

Implemente suas mudanças seguindo os [padrões de desenvolvimento](#padrões-de-desenvolvimento).

### 4. Commit suas Alterações

```bash
# Adicione os arquivos modificados
git add .

# Faça commit seguindo o padrão de commit messages
git commit -m "feat: adiciona funcionalidade de exportação de relatórios

- Implementa exportação para CSV, Excel e PDF
- Adiciona filtros por data e tipo
- Inclui testes unitários
- Atualiza documentação da API

Closes #123"
```

### 5. Push e Pull Request

```bash
# Faça push da sua branch
git push origin feature/nova-funcionalidade

# Abra um Pull Request no GitHub
```

---

## 📜 Código de Conduta

### Nossos Compromissos

Comprometemo-nos a tornar a participação em nosso projeto uma experiência livre de assédio para todos, independentemente de:

- Idade, corpo, deficiência, etnia, identidade de gênero
- Nível de experiência, nacionalidade, aparência pessoal
- Raça, religião, orientação sexual

### Comportamentos Esperados

- ✅ Usar linguagem acolhedora e inclusiva
- ✅ Respeitar diferentes pontos de vista e experiências
- ✅ Aceitar críticas construtivas graciosamente
- ✅ Focar no que é melhor para a comunidade
- ✅ Mostrar empatia com outros membros da comunidade

### Comportamentos Inaceitáveis

- ❌ Linguagem ou imagens sexualizadas
- ❌ Trolling, comentários insultuosos/depreciativos
- ❌ Assédio público ou privado
- ❌ Publicar informações privadas de outros sem permissão
- ❌ Outras condutas inadequadas em ambiente profissional

### Enforcement

Casos de comportamento abusivo podem ser reportados para conduct@crmprodasboard.com. Todas as reclamações serão analisadas e investigadas.

---

## ⚙️ Configuração do Ambiente

### Pré-requisitos

- Node.js 18+
- npm ou pnpm
- Docker e Docker Compose
- Git
- PostgreSQL (para desenvolvimento local)
- Redis (para desenvolvimento local)

### Setup Rápido

```bash
# 1. Clone o repositório
git clone https://github.com/seu-usuario/crm-dashboard.git
cd crm-dashboard

# 2. Instale as dependências
npm install
# ou
pnpm install

# 3. Configure variáveis de ambiente
cp .env.example .env.local
# Edite .env.local com suas configurações

# 4. Inicie os serviços com Docker
docker-compose -f docker-compose.dev.yml up -d

# 5. Execute as migrações
npm run db:migrate

# 6. Popule com dados de exemplo (opcional)
npm run db:seed

# 7. Inicie o servidor de desenvolvimento
npm run dev
```

### Configuração Manual (sem Docker)

```bash
# PostgreSQL
sudo -u postgres createdb crm_dashboard_dev
sudo -u postgres psql -c "CREATE USER crm_user WITH PASSWORD 'dev_password';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE crm_dashboard_dev TO crm_user;"

# Redis
sudo systemctl start redis

# Variáveis de ambiente
DATABASE_URL="postgresql://crm_user:dev_password@localhost:5432/crm_dashboard_dev"
REDIS_URL="redis://localhost:6379"
JWT_SECRET="your-jwt-secret-here"
NEXTAUTH_SECRET="your-nextauth-secret"
NEXTAUTH_URL="http://localhost:3000"

# Executar aplicação
npm run dev
```

---

## 🎯 Padrões de Desenvolvimento

### Convenções de Código

#### TypeScript/JavaScript

```typescript
// ✅ Bom
interface UserProfile {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}

const fetchUserProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  } catch (error) {
    logger.error('Failed to fetch user profile', { userId, error });
    return null;
  }
};

// ❌ Ruim
function getUserProfile(id) {
  return api.get('/users/' + id).then(res => res.data).catch(err => null);
}
```

#### React Components

```tsx
// ✅ Bom - Componente funcional com TypeScript
interface ContactCardProps {
  contact: Contact;
  onEdit: (contact: Contact) => void;
  onDelete: (contactId: string) => void;
}

export const ContactCard: React.FC<ContactCardProps> = ({
  contact,
  onEdit,
  onDelete
}) => {
  const handleEdit = useCallback(() => {
    onEdit(contact);
  }, [contact, onEdit]);

  const handleDelete = useCallback(() => {
    onDelete(contact.id);
  }, [contact.id, onDelete]);

  return (
    <Card className="contact-card">
      <CardHeader>
        <CardTitle>{contact.name}</CardTitle>
        <CardSubtitle>{contact.email}</CardSubtitle>
      </CardHeader>
      <CardActions>
        <Button onClick={handleEdit} variant="outline">
          Editar
        </Button>
        <Button onClick={handleDelete} variant="destructive">
          Excluir
        </Button>
      </CardActions>
    </Card>
  );
};
```

#### API Routes

```typescript
// ✅ Bom - API route com validação e tratamento de erro
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const createContactSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email().optional(),
  phone: z.string().min(10).max(15),
  tags: z.array(z.string()).max(10).optional()
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = createContactSchema.parse(body);
    
    const contact = await createContact(validatedData);
    
    return NextResponse.json(contact, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    
    logger.error('Failed to create contact', { error });
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

### Estrutura de Pastas

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Grupo de rotas de autenticação
│   ├── api/               # API routes
│   ├── dashboard/         # Páginas do dashboard
│   └── globals.css        # Estilos globais
├── components/            # Componentes reutilizáveis
│   ├── ui/               # Componentes de UI base
│   ├── forms/            # Componentes de formulário
│   └── layout/           # Componentes de layout
├── hooks/                # Custom hooks
├── lib/                  # Utilitários e configurações
│   ├── auth.ts           # Configuração de autenticação
│   ├── database.ts       # Cliente do banco de dados
│   ├── utils.ts          # Funções utilitárias
│   └── validations.ts    # Schemas de validação
├── types/                # Definições de tipos TypeScript
└── styles/               # Arquivos de estilo
```

### Naming Conventions

```typescript
// Arquivos e pastas: kebab-case
user-profile.tsx
contact-management/

// Componentes: PascalCase
UserProfile
ContactManagement

// Variáveis e funções: camelCase
const userName = 'João';
const fetchUserData = () => {};

// Constantes: SCREAMING_SNAKE_CASE
const API_BASE_URL = 'https://api.example.com';

// Tipos e interfaces: PascalCase
interface UserProfile {}
type ContactStatus = 'active' | 'inactive';

// Enums: PascalCase
enum UserRole {
  Admin = 'admin',
  User = 'user',
  Manager = 'manager'
}
```

### Commit Messages

Seguimos o padrão [Conventional Commits](https://www.conventionalcommits.org/):

```bash
# Formato
<tipo>[escopo opcional]: <descrição>

[corpo opcional]

[rodapé opcional]

# Exemplos
feat: adiciona autenticação por 2FA
fix: corrige erro de validação no formulário de contato
docs: atualiza guia de instalação
style: formata código com prettier
refactor: extrai lógica de validação para hook personalizado
test: adiciona testes para componente ContactCard
chore: atualiza dependências do projeto

# Com escopo
feat(auth): implementa login com Google OAuth
fix(dashboard): corrige carregamento de métricas
docs(api): adiciona documentação dos endpoints de webhook

# Com breaking change
feat!: remove suporte para Node.js 16

BREAKING CHANGE: a versão mínima do Node.js agora é 18.x
```

### Tipos de Commit

- `feat`: Nova funcionalidade
- `fix`: Correção de bug
- `docs`: Mudanças na documentação
- `style`: Mudanças de formatação (espaços, ponto e vírgula, etc)
- `refactor`: Mudança de código que não corrige bug nem adiciona funcionalidade
- `test`: Adicionar ou corrigir testes
- `chore`: Mudanças em ferramentas, configurações, dependências
- `perf`: Melhoria de performance
- `ci`: Mudanças em arquivos de CI
- `revert`: Reverter commit anterior

---

## 🔄 Processo de Pull Request

### Checklist antes de Submeter

- [ ] **Código testado** - Todos os testes passam
- [ ] **Documentação atualizada** - README, docs, comentários
- [ ] **Padrões seguidos** - ESLint, Prettier, convenções
- [ ] **Performance verificada** - Não há regressões
- [ ] **Segurança validada** - Sem vulnerabilidades introduzidas
- [ ] **Acessibilidade** - Componentes acessíveis
- [ ] **Responsive** - Interface funciona em diferentes dispositivos

### Template de Pull Request

```markdown
## Descrição

Breve descrição das mudanças implementadas.

## Tipo de mudança

- [ ] Bug fix (mudança que corrige um problema)
- [ ] Nova funcionalidade (mudança que adiciona funcionalidade)
- [ ] Breaking change (mudança que quebra compatibilidade)
- [ ] Documentação (mudança apenas na documentação)

## Como testar

1. Passos para testar as mudanças
2. Casos de teste específicos
3. Cenários edge cases

## Screenshots (se aplicável)

Adicione screenshots das mudanças visuais.

## Checklist

- [ ] Meu código segue os padrões do projeto
- [ ] Revisei meu próprio código
- [ ] Comentei código em partes complexas
- [ ] Documentação foi atualizada
- [ ] Testes foram adicionados/atualizados
- [ ] Todos os testes passam
- [ ] Não há conflitos de merge

## Issues relacionadas

Closes #123
Fixes #456
Related to #789
```

### Review Process

1. **Automated Checks** - CI/CD pipeline executa
2. **Code Review** - Pelo menos 1 aprovação necessária
3. **QA Review** - Teste em ambiente de staging
4. **Final Approval** - Aprovação de maintainer
5. **Merge** - Squash and merge para main

---

## 🧪 Testes

### Tipos de Teste

#### Unit Tests

```typescript
// __tests__/utils/validation.test.ts
import { validateEmail, validatePhone } from '@/lib/validation';

describe('Email Validation', () => {
  it('should validate correct email addresses', () => {
    expect(validateEmail('test@example.com')).toBe(true);
    expect(validateEmail('user+tag@domain.co.uk')).toBe(true);
  });

  it('should reject invalid email addresses', () => {
    expect(validateEmail('invalid-email')).toBe(false);
    expect(validateEmail('@domain.com')).toBe(false);
    expect(validateEmail('user@')).toBe(false);
  });
});

describe('Phone Validation', () => {
  it('should validate Brazilian phone numbers', () => {
    expect(validatePhone('+5511999999999')).toBe(true);
    expect(validatePhone('11999999999')).toBe(true);
  });

  it('should reject invalid phone numbers', () => {
    expect(validatePhone('123')).toBe(false);
    expect(validatePhone('abc123')).toBe(false);
  });
});
```

#### Component Tests

```typescript
// __tests__/components/ContactCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { ContactCard } from '@/components/ContactCard';

const mockContact = {
  id: '1',
  name: 'João Silva',
  email: 'joao@example.com',
  phone: '+5511999999999',
  createdAt: new Date()
};

describe('ContactCard', () => {
  const mockOnEdit = jest.fn();
  const mockOnDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders contact information', () => {
    render(
      <ContactCard
        contact={mockContact}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('João Silva')).toBeInTheDocument();
    expect(screen.getByText('joao@example.com')).toBeInTheDocument();
  });

  it('calls onEdit when edit button is clicked', () => {
    render(
      <ContactCard
        contact={mockContact}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    fireEvent.click(screen.getByText('Editar'));
    expect(mockOnEdit).toHaveBeenCalledWith(mockContact);
  });

  it('calls onDelete when delete button is clicked', () => {
    render(
      <ContactCard
        contact={mockContact}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    fireEvent.click(screen.getByText('Excluir'));
    expect(mockOnDelete).toHaveBeenCalledWith(mockContact.id);
  });
});
```

#### Integration Tests

```typescript
// __tests__/api/contacts.test.ts
import { createMocks } from 'node-mocks-http';
import handler from '@/app/api/contacts/route';

describe('/api/contacts', () => {
  it('creates a new contact', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        name: 'João Silva',
        email: 'joao@example.com',
        phone: '+5511999999999'
      }
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(201);
    const data = JSON.parse(res._getData());
    expect(data.name).toBe('João Silva');
    expect(data.id).toBeDefined();
  });

  it('validates required fields', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        name: 'João Silva'
        // phone é obrigatório
      }
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(400);
    const data = JSON.parse(res._getData());
    expect(data.error).toBe('Validation failed');
  });
});
```

#### E2E Tests

```typescript
// e2e/contacts.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Contact Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard/contacts');
  });

  test('should create a new contact', async ({ page }) => {
    await page.click('[data-testid="add-contact-button"]');
    
    await page.fill('[data-testid="contact-name"]', 'João Silva');
    await page.fill('[data-testid="contact-email"]', 'joao@example.com');
    await page.fill('[data-testid="contact-phone"]', '+5511999999999');
    
    await page.click('[data-testid="save-contact-button"]');
    
    await expect(page.locator('[data-testid="contact-list"]'))
      .toContainText('João Silva');
  });

  test('should search contacts', async ({ page }) => {
    await page.fill('[data-testid="search-input"]', 'João');
    
    await expect(page.locator('[data-testid="contact-item"]'))
      .toHaveCount(1);
    await expect(page.locator('[data-testid="contact-item"]'))
      .toContainText('João Silva');
  });
});
```

### Executando Testes

```bash
# Todos os testes
npm test

# Testes unitários
npm run test:unit

# Testes de integração
npm run test:integration

# Testes E2E
npm run test:e2e

# Coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

---

## 📚 Documentação

### Documentando Componentes

```tsx
/**
 * ContactCard - Componente para exibir informações de um contato
 * 
 * @example
 * ```tsx
 * <ContactCard
 *   contact={contact}
 *   onEdit={(contact) => console.log('Edit:', contact)}
 *   onDelete={(id) => console.log('Delete:', id)}
 * />
 * ```
 */
interface ContactCardProps {
  /** Objeto contendo dados do contato */
  contact: Contact;
  /** Callback executado quando botão editar é clicado */
  onEdit: (contact: Contact) => void;
  /** Callback executado quando botão excluir é clicado */
  onDelete: (contactId: string) => void;
  /** Classe CSS adicional (opcional) */
  className?: string;
}

export const ContactCard: React.FC<ContactCardProps> = ({
  contact,
  onEdit,
  onDelete,
  className
}) => {
  // Implementação...
};
```

### Documentando APIs

```typescript
/**
 * @swagger
 * /api/contacts:
 *   post:
 *     summary: Cria um novo contato
 *     tags: [Contacts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - phone
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *                 example: "João Silva"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "joao@example.com"
 *               phone:
 *                 type: string
 *                 pattern: "^\\+?[1-9]\\d{1,14}$"
 *                 example: "+5511999999999"
 *     responses:
 *       201:
 *         description: Contato criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Contact'
 *       400:
 *         description: Dados inválidos
 *       500:
 *         description: Erro interno do servidor
 */
export async function POST(request: NextRequest) {
  // Implementação...
}
```

### README de Funcionalidades

```markdown
# Feature: Contact Management

## Visão Geral

Sistema completo de gerenciamento de contatos com funcionalidades de CRUD, busca, filtros e exportação.

## Funcionalidades

- ✅ Criar, editar e excluir contatos
- ✅ Busca por nome, email ou telefone
- ✅ Filtros por tags e data de criação
- ✅ Exportação para CSV/Excel
- ✅ Importação em massa
- ✅ Integração com WhatsApp

## Arquivos Principais

- `app/dashboard/contacts/page.tsx` - Página principal
- `components/contacts/ContactCard.tsx` - Card de contato
- `components/contacts/ContactForm.tsx` - Formulário
- `app/api/contacts/route.ts` - API endpoints

## Como Usar

1. Acesse `/dashboard/contacts`
2. Use o botão "Adicionar Contato" para criar
3. Use a barra de busca para filtrar
4. Clique em um contato para editar

## Testes

```bash
npm run test -- contacts
```

## TODO

- [ ] Adicionar campos customizados
- [ ] Implementar grupos de contatos
- [ ] Melhorar performance da busca
```

---

## 🐛 Issues e Bug Reports

### Template de Bug Report

```markdown
---
name: Bug Report
about: Criar um relatório de bug
title: '[BUG] '
labels: bug
assignees: ''
---

## Descrição do Bug
Descrição clara e concisa do bug.

## Como Reproduzir
Passos para reproduzir o comportamento:
1. Vá para '...'
2. Clique em '....'
3. Role para baixo até '....'
4. Veja o erro

## Comportamento Esperado
Descrição clara do que deveria acontecer.

## Comportamento Atual
Descrição clara do que acontece atualmente.

## Screenshots
Se aplicável, adicione screenshots para explicar o problema.

## Ambiente
 - OS: [ex. iOS, Windows, Ubuntu]
 - Browser: [ex. chrome, safari]
 - Versão: [ex. 22]
 - Versão da aplicação: [ex. v1.2.3]

## Logs
```
Cole aqui logs relevantes
```

## Contexto Adicional
Qualquer outro contexto sobre o problema.
```

### Template de Feature Request

```markdown
---
name: Feature Request
about: Sugerir uma nova funcionalidade
title: '[FEATURE] '
labels: enhancement
assignees: ''
---

## Resumo da Funcionalidade
Descrição clara e concisa da funcionalidade desejada.

## Problema que Resolve
Descrição clara do problema que esta funcionalidade resolveria.

## Solução Proposta
Descrição clara de como você gostaria que funcionasse.

## Alternativas Consideradas
Descrição de soluções alternativas que você considerou.

## Benefícios
- Benefício 1
- Benefício 2
- Benefício 3

## Casos de Uso
1. Como [tipo de usuário], eu gostaria de [ação] para [benefício]
2. Como [tipo de usuário], eu gostaria de [ação] para [benefício]

## Critérios de Aceitação
- [ ] Critério 1
- [ ] Critério 2
- [ ] Critério 3

## Mockups/Wireframes
Se aplicável, adicione mockups ou wireframes.

## Prioridade
- [ ] Baixa
- [ ] Média
- [ ] Alta
- [ ] Crítica

## Contexto Adicional
Qualquer outro contexto ou screenshots sobre a solicitação.
```

---

## 🔒 Segurança

### Reportando Vulnerabilidades

**⚠️ NÃO reporte vulnerabilidades de segurança através de issues públicas.**

Para reportar vulnerabilidades de segurança:

1. **Email**: security@crmprodasboard.com
2. **Assunto**: [SECURITY] Descrição breve
3. **Conteúdo**: Descrição detalhada da vulnerabilidade

### Informações a Incluir

- Tipo de vulnerabilidade (SQL injection, XSS, etc.)
- Localização do código vulnerável
- Impacto potencial
- Passos para reproduzir
- Sugestões de correção (se houver)

### Processo de Response

1. **Confirmação** em 24 horas
2. **Avaliação** em 72 horas
3. **Correção** conforme severidade:
   - Crítica: 7 dias
   - Alta: 14 dias
   - Média: 30 dias
   - Baixa: 60 dias
4. **Notificação** quando corrigida

### Security Guidelines

```typescript
// ✅ Bom - Validação e sanitização
app.post('/api/search', async (req, res) => {
  const { query } = searchSchema.parse(req.body);
  const sanitizedQuery = escapeHtml(query);
  
  const results = await db.query(
    'SELECT * FROM contacts WHERE name ILIKE $1',
    [`%${sanitizedQuery}%`]
  );
  
  res.json(results);
});

// ❌ Ruim - Vulnerável a SQL injection
app.post('/api/search', async (req, res) => {
  const { query } = req.body;
  const results = await db.query(
    `SELECT * FROM contacts WHERE name ILIKE '%${query}%'`
  );
  res.json(results);
});
```

---

## 🏆 Reconhecimento

### Contributors

Nossos contributors são reconhecidos de várias formas:

#### GitHub Contributors
- Perfil aparece automaticamente na seção de contributors
- Badges especiais para diferentes tipos de contribuição

#### Hall of Fame
Contributors com contribuições significativas são adicionados ao Hall of Fame:

```markdown
## 🌟 Hall of Fame

### Core Team
- [@usuario1](https://github.com/usuario1) - Founder & Lead Developer
- [@usuario2](https://github.com/usuario2) - Frontend Architect
- [@usuario3](https://github.com/usuario3) - Backend Architect

### Outstanding Contributors
- [@usuario4](https://github.com/usuario4) - 50+ commits, Security improvements
- [@usuario5](https://github.com/usuario5) - Documentation overhaul
- [@usuario6](https://github.com/usuario6) - Performance optimizations

### First Time Contributors
- [@usuario7](https://github.com/usuario7) - Bug fix in authentication
- [@usuario8](https://github.com/usuario8) - UI improvements
```

#### Monthly Recognition
- **Contributor of the Month** - Reconhecimento especial
- **Most Helpful** - Para quem mais ajuda na comunidade
- **Bug Hunter** - Para quem encontra e corrige mais bugs

#### Swag Program
Contributors ativos podem receber:
- Stickers exclusivos
- Camisetas do projeto
- Acesso antecipado a novas funcionalidades

### Como Nomear Contributors

Para nomear alguém para reconhecimento:
1. Abra uma issue com template "Contributor Recognition"
2. Descreva as contribuições da pessoa
3. A equipe avaliará e dará o reconhecimento apropriado

---

## 📞 Onde Buscar Ajuda

### Canais de Comunicação

#### GitHub Discussions
- **Dúvidas gerais**: [Discussions Q&A](https://github.com/repo/discussions)
- **Ideias**: [Discussions Ideas](https://github.com/repo/discussions)
- **Showcase**: [Discussions Show and Tell](https://github.com/repo/discussions)

#### Discord/Slack
- **#general** - Conversa geral
- **#development** - Discussões técnicas
- **#design** - UI/UX e design
- **#help** - Ajuda com código
- **#random** - Off-topic

#### Email
- **Geral**: contributors@crmprodasboard.com
- **Técnico**: dev@crmprodasboard.com
- **Segurança**: security@crmprodasboard.com

### Mentoria

Oferecemos programa de mentoria para novos contributors:

- **Buddy System** - Pareamento com contributor experiente
- **Office Hours** - Sessões semanais de ajuda
- **Code Review Sessions** - Reviews detalhadas para aprendizado

Para participar, abra uma issue com o template "Mentorship Request".

---

## 📋 Próximos Passos

Após ler este guia:

1. **Configure o ambiente** seguindo o [setup](#configuração-do-ambiente)
2. **Explore o código** para se familiarizar
3. **Leia issues abertas** marcadas como "good first issue"
4. **Junte-se aos canais** de comunicação
5. **Faça sua primeira contribuição**!

### Good First Issues

Issues marcadas com `good-first-issue` são ideais para quem está começando:

- Correções de typos na documentação
- Pequenas melhorias de UI
- Adição de testes simples
- Correção de bugs menores

### Resources para Aprender

- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Prisma Guide](https://www.prisma.io/docs)
- [Testing Library](https://testing-library.com/docs/)

---

**Obrigado por contribuir para o CRM Pro Dashboard! 🚀**

*Última atualização: $(date +%d/%m/%Y)*
