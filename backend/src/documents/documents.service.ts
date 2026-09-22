import { Injectable } from '@nestjs/common';

@Injectable()
export class DocumentsService {
  private documents: any[] = [];

  createUploadSession(applicationId: string, documentType: string, fileName: string, mimeType: string) {
    const document = {
      id: `doc_${Date.now()}`,
      applicationId,
      documentType,
      fileName,
      mimeType,
      status: 'PENDING',
      uploadedAt: new Date().toISOString(),
      url: `https://storage.example.com/${documentType}-${Date.now()}`,
    };

    this.documents.push(document);
    return {
      documentId: document.id,
      uploadUrl: document.url,
      objectKey: `documents/${applicationId}/${document.id}/${fileName}`,
      status: document.status,
    };
  }

  listByApplication(applicationId: string) {
    return this.documents.filter((doc) => doc.applicationId === applicationId);
  }

  reviewDocument(documentId: string, decision: 'VERIFIED' | 'REJECTED', comments: string) {
    const document = this.documents.find((entry) => entry.id === documentId);
    if (!document) {
      throw new Error('Document not found');
    }

    document.status = decision;
    document.reviewedAt = new Date().toISOString();
    document.comments = comments;
    return document;
  }
}
