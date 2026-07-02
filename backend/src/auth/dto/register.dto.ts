import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
export class RegisterDto {
    @IsEmail({}, { message: 'Format email tidak valid' })
    @IsNotEmpty({ message: 'Email tidak boleh kosong' })
    email: string;
    @IsString({ message: 'Password harus berupa string' })
    @IsNotEmpty({ message: 'Password tidak boleh kosong' })
    @MinLength(6, { message: 'Password minimal harus 6 karakter' })
    password: string;
}