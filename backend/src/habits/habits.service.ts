import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateHabitDto } from './dto/create-habit.dto';
import { UpdateHabitDto } from './dto/update-habit.dto';

@Injectable()
export class HabitsService {
    constructor(private readonly prisma: PrismaService) { }

    async findAll(userId: number) {
        return this.prisma.habit.findMany({
            where: { userId },
        });
    }

    async create(userId: number, dto: CreateHabitDto) {
        return this.prisma.habit.create({
            data: {
                userId,
                name: dto.name,
                type: dto.type,
            },
        });
    }

    async update(userId: number, id: number, dto: UpdateHabitDto) {
        const habit = await this.prisma.habit.findFirst({
            where: { id, userId },
        });

        if (!habit) {
            throw new NotFoundException(`Habit dengan ID ${id} tidak ditemukan`);
        }

        return this.prisma.habit.update({
            where: { id },
            data: {
                name: dto.name,
            },
        });
    }

    async remove(userId: number, id: number) {
        const habit = await this.prisma.habit.findFirst({
            where: { id, userId },
        });

        if (!habit) {
            throw new NotFoundException(`Habit dengan ID ${id} tidak ditemukan`);
        }

        await this.prisma.habit.delete({
            where: { id },
        });
    }
}
