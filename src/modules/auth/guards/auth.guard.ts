import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private jwtService: JwtService) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> {
        const request = context.switchToHttp().getRequest<Request>();
        const authHeader = request.headers.authorization;

        console.log('[AuthGuard] Checking Authorization header...');

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            console.log('[AuthGuard] ❌ Missing or malformed Authorization header');
            throw new UnauthorizedException('Missing or invalid Authorization header');
        }

        const token = authHeader.replace('Bearer ', '');
        console.log('[AuthGuard] ✅ Token extracted:', token);

        try {
            const payload = this.jwtService.verify(token);
            console.log('[AuthGuard] ✅ Token verified. Payload:', payload);
            request['user'] = payload;
            return true;
        } catch (e) {
            console.log('[AuthGuard] ❌ Token verification failed:', e.message);
            throw new UnauthorizedException('Invalid or expired token');
        }
    }
}