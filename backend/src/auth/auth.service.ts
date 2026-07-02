import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
    ) { }

    async register(registerDto: RegisterDto) {
        const { email, password } = registerDto;

        // 1. Cek apakah email sudah terdaftar
        const existingUser = await this.prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            throw new ConflictException('Email sudah terdaftar');
        }

        // 2. Hash password dengan bcrypt (salt rounds: 10)
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        // 3. Simpan user baru ke database
        const user = await this.prisma.user.create({
            data: {
                email,
                passwordHash,
            },
        });

        // 4. Generate JWT Token
        const accessToken = await this.generateToken(user.id, user.email);

        return {
            user: {
                id: user.id,
                email: user.email,
            },
            accessToken,
        };
    }

    async login(loginDto: LoginDto) {
        const { email, password } = loginDto;

        // 1. Cari user berdasarkan email
        const user = await this.prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            throw new UnauthorizedException('Email atau password salah');
        }

        // 2. Bandingkan password plaintext dengan hash di database
        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

        if (!isPasswordValid) {
            throw new UnauthorizedException('Email atau password salah');
        }

        // 3. Generate JWT Token
        const accessToken = await this.generateToken(user.id, user.email);

        return {
            accessToken,
        };
    }

    private async generateToken(userId: number, email: string): Promise<string> {
        const payload = { sub: userId, email };
        return this.jwtService.signAsync(payload);
    }
}
