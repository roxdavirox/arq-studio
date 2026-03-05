import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses'
import type { NotificationProvider } from '@arq/domain'

const ses = new SESClient({})
const FROM = process.env.SES_FROM_EMAIL ?? 'noreply@arqstudio.com.br'

export class SesNotificationProvider implements NotificationProvider {
  async sendEmail(to: string, subject: string, html: string): Promise<void> {
    await ses.send(
      new SendEmailCommand({
        Source: FROM,
        Destination: { ToAddresses: [to] },
        Message: { Subject: { Data: subject }, Body: { Html: { Data: html } } },
      }),
    )
  }

  async sendSms(to: string, body: string): Promise<void> {
    // TODO: integrate AWS SNS for SMS
    console.log(`SMS to ${to}: ${body}`)
  }
}
