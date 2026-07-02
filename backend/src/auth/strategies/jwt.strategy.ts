import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET || 'changeme_supersecret',
        });
    }

    async validate(payload: { sub: number; email: string }) {
        // Objek yang di-return di sini akan otomatis disuntikkan ke req.user
        return { id: payload.sub, email: payload.email };
    }
}
