# 🐳 Guia Completo: Docker para o WhatsApp Bot

---

## 📦 Pré-requisitos

- [Docker](https://docs.docker.com/get-docker/) instalado
- [Docker Compose](https://docs.docker.com/compose/install/) instalado
- Clonar este repositório:
    ```sh
    git clone <URL_DO_REPOSITORIO>
    cd <PASTA_DO_PROJETO>
    ```

---

## 🚀 Build e execução

1. **Build da imagem:**
     ```sh
     docker-compose build
     ```

2. **Subir os containers em segundo plano:**
     ```sh
     docker-compose up -d
     ```

3. **Primeira inicialização:**  
     O bot pode solicitar autenticação via QR Code no terminal de logs. Veja a seção de logs abaixo.

---

## ⏯️ Parar, iniciar e reiniciar

- **Parar containers:**
    ```sh
    docker-compose stop
    ```
- **Iniciar containers parados:**
    ```sh
    docker-compose start
    ```
- **Reiniciar containers:**
    ```sh
    docker-compose restart
    ```
- **Derrubar containers e remover volumes temporários:**
    ```sh
    docker-compose down -v
    ```

---

## 📜 Logs e QR Code

- **Acompanhar logs em tempo real (inclui QR Code para login):**
    ```sh
    docker-compose logs -f
    ```
- **Ver logs de um serviço específico:**
    ```sh
    docker-compose logs -f bot
    ```

---

## 🔄 Atualizar dependências do projeto

- **Dentro do container:**
    ```sh
    docker-compose exec bot npm install
    ```
- **Atualizar dependências globais (se necessário):**
    ```sh
    docker-compose exec bot npm update -g
    ```

---

## 🛡️ Permissões de arquivos e pastas

- Certifique-se de que as pastas `data/`, `logs/` e `relatorios/` existem e têm permissão de escrita para o usuário do container (por padrão, root).
- **No Linux:**
    ```sh
    sudo chown -R 1000:1000 data logs relatorios
    sudo chmod -R 770 data logs relatorios
    ```
- **No Windows:**  
    Execute o terminal como administrador e verifique as permissões das pastas.

---

## 🧹 Limpeza e manutenção

- **Remover containers, imagens e volumes não utilizados:**
    ```sh
    docker system prune -af --volumes
    ```

---

## 🛠️ Dicas úteis

- **Acessar o shell do container:**
    ```sh
    docker-compose exec bot sh
    ```
- **Verificar status dos containers:**
    ```sh
    docker-compose ps
    ```
- **Rebuild forçando atualização de dependências:**
    ```sh
    docker-compose build --no-cache
    ```

---

## 📖 Mais informações

- Consulte o [README principal](./README.md) para detalhes de configuração, variáveis de ambiente e uso avançado.
- Para dúvidas sobre Docker, acesse a [documentação oficial](https://docs.docker.com/).

---
