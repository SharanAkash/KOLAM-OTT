import { Controller, Post, Body } from '@nestjs/common';
import { EmailService } from './email.service';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('send-invoice')
  async sendInvoice(@Body() orderDetails: any) {
    return this.emailService.sendInvoice(orderDetails);
  }
}
