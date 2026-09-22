import { Injectable } from '@nestjs/common';

@Injectable()
export class PaymentsService {
  private orders: any[] = [];
  private transactions: any[] = [];

  createOrder(applicationId: string, amount: number, currency = 'INR') {
    const order = {
      id: `pay_${Date.now()}`,
      applicationId,
      amount,
      currency,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
      checkoutUrl: `https://checkout.example.com/${Date.now()}`,
    };

    this.orders.push(order);
    return order;
  }

  processWebhook(provider: string, payload: any) {
    const transaction = {
      id: `txn_${Date.now()}`,
      provider,
      orderId: payload.orderId,
      status: payload.status,
      amount: payload.amount,
      payload,
      processedAt: new Date().toISOString(),
    };

    this.transactions.push(transaction);
    return transaction;
  }

  getReceipt(paymentOrderId: string) {
    const order = this.orders.find((entry) => entry.id === paymentOrderId);
    return {
      paymentOrderId,
      receiptNumber: `RCPT-${Date.now()}`,
      status: order?.status ?? 'PENDING',
      issuedAt: new Date().toISOString(),
      pdfUrl: `https://receipts.example.com/${paymentOrderId}.pdf`,
    };
  }
}
