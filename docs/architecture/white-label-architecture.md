# White-Label Architecture

## Resolution Strategy
1. **Subdomain Resolution**: `tenant1.beautysaas.com` -> resolves tenant `tenant1`.
2. **Custom Domain Resolution**: `salonluxury.com` -> Nginx routes to platform ingress -> backend queries Central DB for matching verified custom domain -> resolves tenant `salonluxury`.
3. **API Direct Header**: Mobile apps and headless integrations pass `X-Tenant-ID` or `X-Tenant-Domain` header.

## Dynamic Branding Features
- Custom logo, favicon, and brand color palette (injected via CSS root variables).
- Customized business email templates (booking confirmations, receipts, student notices).
- Custom invoice headers, tax numbers, and footer disclaimers.
- Branded customer portal and public booking site.
