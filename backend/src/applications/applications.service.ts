import { Injectable } from '@nestjs/common';

@Injectable()
export class ApplicationsService {
  private applications: any[] = [];

  createApplication(applicantId: string, programId: string) {
    const application = {
      id: `app_${Date.now()}`,
      applicationNumber: `ADM-${Date.now()}`,
      applicantId,
      programId,
      status: 'DRAFT',
      currentStep: 1,
      createdAt: new Date().toISOString(),
      personalDetails: null,
      academicRecords: [],
      documents: [],
    };

    this.applications.push(application);
    return application;
  }

  findById(id: string) {
    return this.applications.find((application) => application.id === id);
  }

  updatePersonalDetails(id: string, details: any) {
    const application = this.findById(id);
    if (!application) {
      throw new Error('Application not found');
    }
    application.personalDetails = details;
    application.currentStep = 2;
    return application;
  }

  addAcademicRecord(id: string, record: any) {
    const application = this.findById(id);
    if (!application) {
      throw new Error('Application not found');
    }
    application.academicRecords.push(record);
    application.currentStep = 3;
    return application;
  }

  submitApplication(id: string) {
    const application = this.findById(id);
    if (!application) {
      throw new Error('Application not found');
    }
    if (!application.personalDetails || application.academicRecords.length === 0) {
      throw new Error('Application is incomplete');
    }

    application.status = 'SUBMITTED';
    application.submittedAt = new Date().toISOString();
    return application;
  }
}
