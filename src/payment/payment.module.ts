// src/payment/payment.module.ts
import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service'; // ✅ Corrected

@Module({
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule {}
