# Dockerfile para WhatsApp Bot de Erros
FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Garante que as pastas de dados e logs existam
RUN mkdir -p /app/data /app/logs /app/relatorios

# Instala dependências do Chrome para o Puppeteer
RUN apt-get update && \
    apt-get install -y wget gnupg2 && \
    apt-get install -y \
    fonts-liberation \
    fonts-noto-color-emoji \
    libappindicator3-1 \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcups2 \
    libdbus-1-3 \
    libdrm2 \
    libgbm1 \
    libnspr4 \
    libnss3 \
    libx11-xcb1 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    xdg-utils \
    libu2f-udev \
    libvulkan1 \
    libxss1 \
    libgconf-2-4 \
    libgtk-3-0 \
    ca-certificates \
    libxshmfence1 \
    libatspi2.0-0 \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libxkbcommon0 \
    libwayland-client0 \
    libwayland-cursor0 \
    libwayland-egl1 \
    libxinerama1 \
    libxcursor1 \
    libxi6 \
    libxtst6 \
    libpipewire-0.3-0 \
    --no-install-recommends && \
    rm -rf /var/lib/apt/lists/*

# Porta padrão do WhatsApp Web (não exposta, mas útil para debug)
EXPOSE 3000

CMD ["npm", "start"]
