# API Design for College Admission Management System

This document describes the REST API contract for the system.

## Base URL

- `/v1`

## Authentication

All protected endpoints require:

- OAuth2/OIDC access token in Authorization header
- JWT claims include `sub`, `roles`, and `tenant_id`
- RBAC enforced in backend

## Common Response Format

### Success

```json
{
  "data": {
    "id": "app_12345",
    "status": "SUBMITTED"
  },
  "meta": {
    "request_id": "req_abc123"
  }
}
```

### Error

```json
{
  "error": {
    "code": "APPLICATION_INCOMPLETE",
    "message": "The application cannot be submitted.",
    "details": [
      {
        "field": "documents.IDENTITY",
        "reason": "Required document is missing"
      }
    ]
  },
  "meta": {
    "request_id": "req_abc123"
  }
}
```

## Auth Endpoints

### `POST /v1/auth/register`

Registers a new applicant.

Request:

```json
{
  "email": "student@example.com",
  "phone": "+919876543210",
  "fullName": "Aisha Verma",
  "password": "StrongPassword123!"
}
```

Response:

```json
{
  "data": {
    "userId": "usr_01",
    "email": "student@example.com",
    "requiresVerification": true
  }
}
```

### `POST /v1/auth/login`

Returns access and refresh tokens.

### `POST /v1/auth/refresh`

Refreshes expired access tokens.

### `POST /v1/auth/logout`

Revokes the current refresh token or session.

## Applications

### `POST /v1/applications`

Create a draft application.

### `GET /v1/applications/:id`

Fetch application details.

### `PATCH /v1/applications/:id/personal-details`

Update applicant profile information.

### `POST /v1/applications/:id/academic-records`

Add academic history.

### `PATCH /v1/applications/:id/academic-records/:recordId`

Update an academic record.

### `POST /v1/applications/:id/submit`

Submit the application for review.

## Documents

### `POST /v1/applications/:id/documents/upload-session`

Creates a signed upload session.

Request:

```json
{
  "documentType": "IDENTITY",
  "filename": "aadhar-card.pdf",
  "mimeType": "application/pdf",
  "sizeBytes": 245000
}
```

Response:

```json
{
  "data": {
    "documentId": "doc_001",
    "uploadUrl": "https://s3.example.com/presigned-url",
    "objectKey": "private/2026/app_001/doc_001/aadhar-card.pdf",
    "expiresInSeconds": 300
  }
}
```

### `GET /v1/applications/:id/documents`

List documents for the application.

### `POST /v1/documents/:id/review`

Reviewer decision for a document.

Request:

```json
{
  "decision": "VERIFIED",
  "comments": "Document matches original identity proof."
}
```

### `GET /v1/documents/:id/download-url`

Returns a time-limited download URL.

## Payments

### `POST /v1/applications/:id/payments/orders`

Creates a payment order for the application fee.

Response:

```json
{
  "data": {
    "paymentOrderId": "pay_001",
    "provider": "RAZORPAY",
    "checkoutUrl": "https://checkout.example.com/pay/pay_001",
    "status": "PENDING"
  }
}
```

### `GET /v1/payments/:id`

Returns transaction status.

### `POST /v1/payments/webhooks/:provider`

Webhook endpoint for payment provider callbacks.

### `GET /v1/payments/:id/receipt`

Return receipt metadata or generated PDF URL.

### `POST /v1/payments/:id/refund`

Creates a refund request.

## Merit and Allotment

### `POST /v1/allotments/rules/preview`

Preview merit score computation for a candidate.

### `POST /v1/allotments/rounds/:roundId/run`

Runs an admission allotment round.

### `GET /v1/allotments/:applicationId`

Gets the final allotment or waitlist result.

### `POST /v1/allotments/:id/accept`

Applicant accepts the allotment.

## Admin and Reporting

### `GET /v1/admin/applications`

List applications with filters.

### `GET /v1/admin/reconciliation`

Fetch pending and completed payment reconciliation details.

### `GET /v1/admin/audit-logs`

Fetch audit records for system changes.

## Rate Limiting

- auth endpoints: low threshold
- document upload endpoints: moderate threshold
- payment webhook endpoints: strict validation with signature check

## Security Requirements

- all endpoints require authentication unless explicitly public
- use idempotency keys for submission and payment operations
- validate provider webhook signatures
- standardize request IDs for traceability
- block sensitive data in server logs

## Example Request Flow

```text
Applicant registers
  -> creates application draft
  -> fills personal details
  -> adds academic record
  -> uploads identity proof
  -> reviewer verifies document
  -> pays application fee via hosted checkout
  -> application moves to review
  -> merit engine calculates score
  -> allotment is assigned
  -> applicant receives allotment letter and payment instructions
```
