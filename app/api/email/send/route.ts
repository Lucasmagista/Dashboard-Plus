import { NextRequest, NextResponse } from 'next/server'
import { MailerSend, EmailParams, Sender, Recipient } from 'mailersend'

const mailersend = new MailerSend({
  apiKey: process.env.MAILERSEND_API_KEY || '',
})

function createRecipients(emails: string | string[]): Recipient[] {
  return Array.isArray(emails) 
    ? emails.map((email: string) => new Recipient(email))
    : [new Recipient(emails)]
}

function setupEmailParams(data: any): EmailParams {
  const { to, cc, bcc, subject, html, text, templateId, attachments } = data
  
  const sentFrom = new Sender(
    process.env.MAILERSEND_FROM_EMAIL || "noreply@yourdomain.com",
    process.env.MAILERSEND_FROM_NAME || "Dashboard Plus"
  )

  const recipients = createRecipients(to)
  
  const emailParams = new EmailParams()
    .setFrom(sentFrom)
    .setTo(recipients)
    .setSubject(subject)

  if (cc && cc.length > 0) {
    emailParams.setCc(createRecipients(cc))
  }

  if (bcc && bcc.length > 0) {
    emailParams.setBcc(createRecipients(bcc))
  }

  if (templateId) {
    emailParams.setTemplateId(templateId)
  } else {
    if (html) emailParams.setHtml(html)
    if (text) emailParams.setText(text)
  }

  if (attachments && attachments.length > 0) {
    emailParams.setAttachments(attachments)
  }

  return emailParams
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const emailParams = setupEmailParams(data)
    const response = await mailersend.email.send(emailParams)

    return NextResponse.json({
      success: true,
      messageId: response.headers?.['x-message-id'] || 'unknown',
      message: 'Email enviado com sucesso'
    })

  } catch (error) {
    console.error('Erro ao enviar email:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erro ao enviar email',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    )
  }
}
