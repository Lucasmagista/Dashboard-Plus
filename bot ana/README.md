# 🚀 WhatsApp Bot de Erros

Um bot completo para monitoramento de erros em grupos do WhatsApp, com relatórios automáticos, análise avançada, backup, comandos de admin, integração com Google Drive, e-mail e Docker.

---

## ✨ Funcionalidades

- **Leitura inteligente** de mensagens de erro do grupo
- **Armazenamento** em JSON ou SQLite
- **Backup automático** para Google Drive
- **Relatórios** diários, semanais e mensais (texto, PDF, Excel, gráficos)
- **Envio automático** de relatórios por e-mail
- **Comandos de admin** no grupo (restrito por número)
- **Logs persistentes** para auditoria
- **Suporte a Docker** e docker-compose

---

## 🐳 Como rodar com Docker

```sh
docker-compose build
docker-compose up -d
```

- Para parar: `docker-compose stop`
- Para logs: `docker-compose logs -f`
- Para atualizar dependências: `docker-compose exec bot npm install`

---

## ⚙️ Configuração

- Edite `.env` para variáveis do bot, horários, admins, etc.
- Edite `relatorio_template.env` para personalizar o texto dos relatórios.
- Configure as credenciais do Google Drive (`service-account.json`) e e-mail.

---

## 👮‍♂️ Comandos de admin no grupo

| Comando            | Função                        |
|--------------------|------------------------------|
| `/relatorio hoje`  | Envia o relatório do dia      |
| `/ajuda`           | Lista comandos disponíveis    |
| `/status`          | Mostra status do bot          |

Apenas admins definidos em `.env` podem usar comandos.

---

## Comandos customizados

- `/idioma <pt-BR|en-US>` — Altera o idioma do bot em tempo real

## Internacionalização

- O bot suporta português (pt-BR) e inglês (en-US) para comandos, mensagens e relatórios.
- Para adicionar mais idiomas, edite o arquivo `i18n.json`.

## Testes automatizados

- Testes unitários com Jest em `tests/`
- Execute com:

```sh
npm test
```

## Personalização avançada de relatórios

- Edite `relatorio_template.env` para personalizar título, introdução e finalização dos relatórios.
- (Em breve) Comando para admins editarem o template via grupo.

## Notificações customizadas

- O bot envia mensagem automática ao grupo quando reiniciado.

---

## 📁 Pastas importantes

- `data/` — Banco de dados ou arquivo de erros
- `logs/` — Logs persistentes e rejeitados
- `relatorios/` — Relatórios gerados (PDF, Excel, gráficos)

---

## 🔒 Segurança e Resiliência

- Use Docker para manter o bot sempre online
- Recomenda-se uso de PM2, Docker ou similar para restart automático

---

## 📝 Licença

MIT
