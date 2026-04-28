import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const TenantId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    
    // 1. Check Header first (allows switching contexts in the UI)
    const headerTenantId = request.headers['x-tenant-id'];
    if (headerTenantId) return headerTenantId;

    // 2. Fallback to JWT payload
    if (request.user && request.user.tenantId) {
      return request.user.tenantId;
    }
    
    // 3. Fallback to Body
    return request.body?.tenantId;
  },
);
