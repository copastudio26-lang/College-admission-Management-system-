import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('/health')
  getHealth() {
    return {
      status: 'ok',
      service: 'college-admission-backend',
      timestamp: new Date().toISOString(),
    };
  }
}
