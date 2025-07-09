import { NextResponse } from 'next/server'
import { MailerSend } from 'mailersend'

const mailersend = new MailerSend({
  apiKey: process.env.MAILERSEND_API_KEY || '',
})

export async function GET() {
  try {
    // Para demonstração, retornar dados simulados
    // Em produção, você pode integrar com analytics do MailerSend
    const stats = {
      sent: 1247,
      delivered: 1198,
      opened: 856,
      clicked: 234,
      bounced: 23,
      unsubscribed: 5,
      openRate: 71,
      clickRate: 20,
      bounceRate: 2,
      dailyStats: [
        { date: '2025-07-01', sent: 45, delivered: 43, opened: 31, clicked: 8 },
        { date: '2025-07-02', sent: 52, delivered: 50, opened: 36, clicked: 12 },
        { date: '2025-07-03', sent: 38, delivered: 37, opened: 25, clicked: 6 },
        { date: '2025-07-04', sent: 61, delivered: 58, opened: 42, clicked: 15 },
        { date: '2025-07-05', sent: 47, delivered: 45, opened: 33, clicked: 9 }
      ]
    }

    return NextResponse.json({
      success: true,
      stats,
      message: 'Estatísticas carregadas com sucesso'
    })

  } catch (error) {
    console.error('Erro ao carregar estatísticas:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erro ao carregar estatísticas',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    )
  }
}
