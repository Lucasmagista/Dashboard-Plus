# 👑 Guia do Administrador do Bot

Este guia é para quem gerencia o WhatsApp Bot de Erros.

---

## 👤 Como adicionar um admin

1. Edite o arquivo `.env`.
2. Adicione o número internacional (ex: `+5511999999999`) na variável `ADMINS`, separado por vírgula.

---

## 💬 Comandos disponíveis

| Comando            | Função                        |
|--------------------|------------------------------|
| `/relatorio hoje`  | Envia o relatório do dia      |
| `/ajuda`           | Lista comandos disponíveis    |
| `/status`          | Mostra status do bot          |

Apenas admins podem usar comandos. Outros usuários terão comandos ignorados.

---

## 🗂️ Logs

- Todas as ações críticas e comandos são registrados em `logs/bot.log`.
- Mensagens rejeitadas (não reconhecidas como erro) vão para `logs/rejeitadas.log`.

---

## ☁️ Backup

- O backup automático do banco/arquivo de erros é feito diariamente para o Google Drive.

---

## 🐳 Docker

- Para atualizar configurações, reinicie o container com:

```sh
docker-compose restart
```

---

Dúvidas? Consulte o README principal ou entre em contato com o responsável pelo bot.
