# Configurações de Rede para Desenvolvimento

# Para acessar de outros dispositivos na rede:
# 1. Execute: npm run dev
# 2. Acesse via: http://[SEU_IP]:3000

# Comandos disponíveis:
# npm run dev          - Servidor acessível na rede (0.0.0.0:3000)
# npm run dev:local    - Servidor apenas local (localhost:3000)
# npm run dev:network  - Servidor na rede com porta específica

# Verificar seu IP local:
# Windows: ipconfig
# Linux/Mac: ifconfig ou ip addr show

# Portas alternativas se 3000 estiver ocupada:
# npm run dev:network -- -p 3001
# npm run dev:network -- -p 8080

# Firewall:
# Certifique-se de que a porta 3000 está liberada no firewall do Windows
