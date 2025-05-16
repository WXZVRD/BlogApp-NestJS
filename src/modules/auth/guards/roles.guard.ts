import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const roles = this.reflector.get<string[]>('roles', context.getHandler());
        console.log('[RolesGuard] Required roles:', roles);

        if (!roles || roles.length === 0) {
            console.log('[RolesGuard] No roles required, access granted');
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const user = request.user;

        if (!user) {
            console.warn('[RolesGuard] No user found on request');
            throw new ForbiddenException('User not authenticated');
        }

        console.log('[RolesGuard] User role:', user.role);

        const hasRole = roles.includes(user.role);

        if (!hasRole) {
            console.warn(`[RolesGuard] Access denied. User role "${user.role}" is not in required roles.`);
            throw new ForbiddenException('Access denied');
        }

        console.log('[RolesGuard] Access granted');
        return true;
    }
}