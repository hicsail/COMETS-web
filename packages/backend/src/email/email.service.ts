import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Transporter } from 'nodemailer';
import { TRANSPORT_PROVIDER } from './transport.provider';

@Injectable()
export class EmailService {
  private readonly sender = this.configService.getOrThrow<string>('mail.from');
  private readonly frontendURL = this.configService.getOrThrow<string>('frontend.url');

  constructor(
    @Inject(TRANSPORT_PROVIDER) private readonly transporter: Transporter,
    private readonly configService: ConfigService
  ) {}

  async sendSuccess(email: string, id: string): Promise<void> {
    const mailOptions = {
      from: this.sender,
      to: email,
      subject: 'Your COMETS SI simulation has been completed successfully',
      text: `Click here to view the results of your simulation: ${this.frontendURL}/results/${id}`
    }
    await this.transporter.sendMail(mailOptions);
  }
}
