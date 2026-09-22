import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PaymentsService } from './payments.service';

class PaymentOrderDto {
  applicationId: string;
  amount: number;
  currency?: string;
}

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('orders')
  createOrder(@Body() dto: PaymentOrderDto) {
    return this.paymentsService.createOrder(dto.applicationId, dto.amount, dto.currency ?? 'INR');
  }

  @Post('webhooks/:provider')
  webhook(@Param('provider') provider: string, @Body() payload: any) {
    return this.paymentsService.processWebhook(provider, payload);
  }

  @Get(':paymentOrderId/receipt')
  receipt(@Param('paymentOrderId') paymentOrderId: string) {
    return this.paymentsService.getReceipt(paymentOrderId);
  }
}
