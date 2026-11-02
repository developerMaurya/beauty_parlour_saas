# Backend Architecture Blueprint

## Architectural Patterns
- **Language**: Modern ECMAScript (ES Modules `import`/`export`).
- **Framework**: Express.js with a modular middleware pipeline.
- **Data Layer**: Mongoose with dynamic multi-connection management.
- **Error Handling**: Centralized error middleware with standardized error formats and request tracking.

## Request Lifecycle
1. Incoming HTTP request enters Express server.
2. `request-id` middleware assigns a unique UUID to `req.id`.
3. `request-logger` captures structured access logs.
4. `tenant-resolver` parses Host header/subdomain and loads the tenant profile from the Central DB.
5. Dynamic tenant connection manager obtains or pools the Mongoose connection for that specific tenant.
6. Route authentication and role authorization middleware inspect JWT claims.
7. Request validator verifies payload schema.
8. Controller invokes service layer business logic.
9. Response is returned using standardized JSON envelope.
