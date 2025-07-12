// src/app.module.ts
import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { EnhanceController } from './enhance/enhance.controller';
import { EnhanceService } from './enhance/enhance.service';

import { StripeController } from './stripe/stripe.controller';
import { StripeService } from './stripe/stripe.service';

@Module({
  imports: [],
  controllers: [AppController, EnhanceController, StripeController],
  providers: [AppService, EnhanceService, StripeService],
})
export class AppModule {}

