import { IsNotEmpty, IsString } from 'class-validator';
export class UpdateHabitDto {
    @IsString()
    @IsNotEmpty()
    name: string;
}