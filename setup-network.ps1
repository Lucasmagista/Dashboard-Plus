# Script para configurar acesso de rede ao Next.js
# Execute como Administrador

Write-Host "=== Configurando Next.js para Acesso de Rede ===" -ForegroundColor Green

# Obter IP local
$LocalIP = (Get-NetIPAddress -AddressFamily IPv4 -InterfaceAlias "Wi-Fi*" | Where-Object {$_.PrefixLength -eq 24}).IPAddress
if (-not $LocalIP) {
    $LocalIP = (Get-NetIPAddress -AddressFamily IPv4 -InterfaceAlias "Ethernet*" | Where-Object {$_.PrefixLength -eq 24}).IPAddress
}

Write-Host "Seu IP local: $LocalIP" -ForegroundColor Yellow

# Verificar se a porta 3000 está sendo usada
$Port3000 = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
if ($Port3000) {
    Write-Host "ATENÇÃO: Porta 3000 já está em uso!" -ForegroundColor Red
    Write-Host "Processo usando a porta:" -ForegroundColor Red
    Get-Process -Id $Port3000.OwningProcess | Select-Object Name, Id
}

# Verificar firewall para porta 3000
$FirewallRule = Get-NetFirewallRule -DisplayName "*3000*" -ErrorAction SilentlyContinue
if (-not $FirewallRule) {
    Write-Host "Criando regra de firewall para porta 3000..." -ForegroundColor Yellow
    try {
        New-NetFirewallRule -DisplayName "Next.js Development Server" -Direction Inbound -Protocol TCP -LocalPort 3000 -Action Allow
        Write-Host "Regra de firewall criada com sucesso!" -ForegroundColor Green
    } catch {
        Write-Host "Erro ao criar regra de firewall. Execute como Administrador." -ForegroundColor Red
    }
} else {
    Write-Host "Regra de firewall já existe para porta 3000" -ForegroundColor Green
}

Write-Host ""
Write-Host "=== Instruções ===" -ForegroundColor Cyan
Write-Host "1. Execute: npm run dev" -ForegroundColor White
Write-Host "2. Acesse de outros dispositivos: http://$LocalIP`:3000" -ForegroundColor White
Write-Host "3. Certifique-se de que ambos os dispositivos estão na mesma rede Wi-Fi" -ForegroundColor White
Write-Host ""

# Verificar conectividade de rede
Write-Host "Testando conectividade..." -ForegroundColor Yellow
$PingResult = Test-NetConnection -ComputerName "8.8.8.8" -Port 53 -WarningAction SilentlyContinue
if ($PingResult.TcpTestSucceeded) {
    Write-Host "Conectividade de rede: OK" -ForegroundColor Green
} else {
    Write-Host "Problemas de conectividade detectados" -ForegroundColor Red
}

Write-Host ""
Write-Host "Pressione qualquer tecla para continuar..."
$Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown") | Out-Null
