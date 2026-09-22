import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { ApplicationsModule } from './applications/applications.module';
import { DocumentsModule } from './documents/documents.module';
import { PaymentsModule } from './payments/payments.module';
import { AllotmentsModule } from './allotments/allotments.module';

@Module({
  imports: [AuthModule, ApplicationsModule, DocumentsModule, PaymentsModule, AllotmentsModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
