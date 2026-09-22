import { Body, Controller, Post } from '@nestjs/common';
import { AllotmentsService } from './allotments.service';

class MeritInputDto {
  id: string;
  academicPercentage?: number;
  entranceScore?: number;
}

@Controller('allotments')
export class AllotmentsController {
  constructor(private readonly allotmentsService: AllotmentsService) {}

  @Post('calculate')
  calculate(@Body() dto: MeritInputDto) {
    return this.allotmentsService.calculateMeritScore(dto);
  }

  @Post('generate-round')
  generate(@Body() applicants: MeritInputDto[]) {
    return this.allotmentsService.generateRound(applicants);
  }
}
