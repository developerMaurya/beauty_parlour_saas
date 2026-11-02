# API Conventions & Standards

## Base URL Format
- Superadmin: `/api/v1/superadmin/*`
- Tenant Admin: `/api/v1/admin/*`
- Staff Portal: `/api/v1/staff/*`
- Student Portal: `/api/v1/student/*`
- Customer Portal: `/api/v1/customer/*`
- Guest & Public: `/api/v1/public/*`, `/api/v1/guest/*`
- Webhooks: `/api/v1/webhook/*`

## Standard Response Format
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Resource retrieved successfully",
  "data": {},
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  },
  "timestamp": "2026-11-02T12:00:00.000Z",
  "requestId": "c1f7b1e4-32c0-4f5e-990a-5b4d79e6022e"
}
```

## Standard Error Format
```json
{
  "success": false,
  "statusCode": 400,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Valid email address is required"
    }
  ],
  "timestamp": "2026-11-02T12:00:00.000Z",
  "requestId": "c1f7b1e4-32c0-4f5e-990a-5b4d79e6022e"
}
```
