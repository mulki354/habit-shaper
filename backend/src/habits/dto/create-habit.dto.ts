import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { HabitType } from '@prisma/client';
export class CreateHabitDto {
    @IsString()
    @IsNotEmpty()
    name: string;
    @IsEnum(HabitType, {
        message: 'type must be either BUILD or BREAK',
    })
    type: HabitType;
}