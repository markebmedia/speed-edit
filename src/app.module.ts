import { Module } from '@nestjs/common';
import { EnhanceController } from './enhance/enhance.controller';
import { EnhanceService } from './enhance/enhance.service';

@Module({
  imports: [],
  controllers: [EnhanceController],
  providers: [EnhanceService],
})
export class AppModule {}
