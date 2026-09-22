import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ApplicationsService } from './applications.service';

class CreateApplicationDto {
  applicantId: string;
  programId: string;
}

class PersonalDetailsDto {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  email: string;
  phone: string;
}

class AcademicRecordDto {
  schoolName: string;
  board: string;
  percentage: number;
  passingYear: number;
}

@Controller('applications')
export class ApplicationsController {
  constructor(private readonly applicationService: ApplicationsService) {}

  @Post()
  create(@Body() dto: CreateApplicationDto) {
    return this.applicationService.createApplication(dto.applicantId, dto.programId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.applicationService.findById(id);
  }

  @Patch(':id/personal-details')
  updatePersonalDetails(@Param('id') id: string, @Body() dto: PersonalDetailsDto) {
    return this.applicationService.updatePersonalDetails(id, dto);
  }

  @Post(':id/academic-records')
  addAcademicRecord(@Param('id') id: string, @Body() dto: AcademicRecordDto) {
    return this.applicationService.addAcademicRecord(id, dto);
  }

  @Post(':id/submit')
  submit(@Param('id') id: string) {
    return this.applicationService.submitApplication(id);
  }
}
