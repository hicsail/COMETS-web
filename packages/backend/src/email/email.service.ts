import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Transporter } from 'nodemailer';
import { SimulationRequest } from 'src/simulation/models/request.model';
import { TRANSPORT_PROVIDER } from './transport.provider';

@Injectable()
export class EmailService {
  private readonly sender = this.configService.getOrThrow<string>('mail.from');
  private readonly internalEmail = this.configService.getOrThrow<string>('mail.internalEmail');
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

  async sendFailure(email: string, log: string, request: SimulationRequest): Promise<void> {
    await this.sendFailedClient(email);
    await this.sendFailureInternal(log, request);
  }

  /**
   * Send an email to the client letting them know their email failed to run
   */
  private async sendFailedClient(email: string): Promise<void> {
    const mailOptions = {
      from: this.sender,
      to: email,
      subject: 'COMETS Simulation Failed to Run',
      text: `Unfortunately your requested simulation has failed to run. We are looking into the issue now!`
    }
    await this.transporter.sendMail(mailOptions);
  }

  /**
   * Send an email to the internal address when a run has failed with logs
   */
  private async sendFailureInternal(log: string, request: SimulationRequest): Promise<void> {
    const message = `
      A COMETS Simulation has failed to run.

      Kubernetes Job Output
      -------------------------------------
      ${log}
      -------------------------------------

      Request Parameters
      -------------------------------------
      ${JSON.stringify(request, null, 2)}
      -------------------------------------
    `;

    const mailOptions = {
      from: this.sender,
      to: this.internalEmail,
      subject: 'COMETS Simulation Failed',
      text: message
    }
    await this.transporter.sendMail(mailOptions);
  }
}
