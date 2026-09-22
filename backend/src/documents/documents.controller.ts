import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { DocumentsService } from './documents.service';

class UploadSessionDto {
  documentType: string;
  fileName: string;
  mimeType: string;
}

class ReviewDocumentDto {
  decision: 'VERIFIED' | 'REJECTED';
  comments: string;
}

@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post('upload-session')
  createUploadSession(@Body() dto: UploadSessionDto) {
    return this.documentsService.createUploadSession('app_demo', dto.documentType, dto.fileName, dto.mimeType);
  }

  @Get(':applicationId')
  list(@Param('applicationId') applicationId: string) {
    return this.documentsService.listByApplication(applicationId);
  }

  @Post(':documentId/review')
  review(@Param('documentId') documentId: string, @Body() dto: ReviewDocumentDto) {
    return this.documentsService.reviewDocument(documentId, dto.decision, dto.comments);
  }
}
