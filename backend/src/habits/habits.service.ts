import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateHabitDto } from './dto/create-habit.dto';
import { UpdateHabitDto } from './dto/update-habit.dto';
import { EntryDto } from './dto/entry.dto';

@Injectable()
export class HabitsService {
    constructor(private readonly prisma: PrismaService) { }

    async findAll(userId: number) {
        const habits = await this.prisma.habit.findMany({
            where: { userId },
            include: { entries: true },
        });

        return habits.map(habit => {
            const stats = this.calculateStats(habit);
            const { entries, ...habitData } = habit;
            return {
                ...habitData,
                ...stats,
            };
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

    async markComplete(userId: number, habitId: number, dto: EntryDto) {
        const habit = await this.prisma.habit.findFirst({
            where: { id: habitId, userId },
        });

        if (!habit) {
            throw new NotFoundException(`Habit dengan ID ${habitId} tidak ditemukan`);
        }

        if (habit.type !== 'BUILD') {
            throw new BadRequestException('Habit bertipe BREAK tidak dapat ditandai COMPLETED');
        }

        const targetDate = parseDateOnly(dto.date);

        try {
            const entry = await this.prisma.habitEntry.create({
                data: {
                    habitId,
                    date: targetDate,
                    kind: 'COMPLETED',
                },
            });

            // Hitung streak terbaru
            const stats = await this.getStatsAndEntries(userId, habitId);
            return {
                entry,
                currentStreak: stats.currentStreak,
            };
        } catch (e: any) {
            if (e.code === 'P2002') {
                throw new ConflictException('Tanggal ini sudah ditandai completed');
            }
            throw e;
        }
    }

    async markRelapse(userId: number, habitId: number, dto: EntryDto) {
        const habit = await this.prisma.habit.findFirst({
            where: { id: habitId, userId },
        });

        if (!habit) {
            throw new NotFoundException(`Habit dengan ID ${habitId} tidak ditemukan`);
        }

        if (habit.type !== 'BREAK') {
            throw new BadRequestException('Habit bertipe BUILD tidak dapat ditandai RELAPSED');
        }

        const targetDate = parseDateOnly(dto.date);

        try {
            const entry = await this.prisma.habitEntry.create({
                data: {
                    habitId,
                    date: targetDate,
                    kind: 'RELAPSED',
                },
            });

            // Hitung clean streak terbaru
            const stats = await this.getStatsAndEntries(userId, habitId);
            return {
                entry,
                cleanStreak: stats.cleanStreak,
            };
        } catch (e: any) {
            if (e.code === 'P2002') {
                throw new ConflictException('Tanggal ini sudah ditandai relapse');
            }
            throw e;
        }
    }

    async getStats(userId: number, habitId: number) {
        return this.getStatsAndEntries(userId, habitId);
    }

    private async getStatsAndEntries(userId: number, habitId: number) {
        const habit = await this.prisma.habit.findFirst({
            where: { id: habitId, userId },
            include: {
                entries: {
                    orderBy: {
                        date: 'desc',
                    },
                },
            },
        });

        if (!habit) {
            throw new NotFoundException(`Habit dengan ID ${habitId} tidak ditemukan`);
        }

        const stats = this.calculateStats(habit);
        const todayStr = getLocalDateString(new Date());

        // Weekly breakdown 7 hari terakhir
        const last7Days: string[] = [];
        for (let i = 0; i < 7; i++) {
            last7Days.push(getOffsetDateString(todayStr, -i));
        }

        const entriesMap = new Map(
            habit.entries.map(e => [e.date.toISOString().substring(0, 10), e.kind])
        );

        const weeklyBreakdown = last7Days.map(dateStr => {
            const kind = entriesMap.get(dateStr);
            if (habit.type === 'BUILD') {
                return {
                    date: dateStr,
                    status: kind === 'COMPLETED' ? 'completed' : 'missed',
                };
            } else {
                return {
                    date: dateStr,
                    status: kind === 'RELAPSED' ? 'relapsed' : 'clean',
                };
            }
        });

        return {
            habit: {
                id: habit.id,
                name: habit.name,
                type: habit.type,
                createdAt: habit.createdAt,
            },
            entries: habit.entries,
            ...stats,
            weeklyBreakdown,
        };
    }

    private calculateStats(habit: any) {
        const entries = habit.entries || [];
        if (habit.type === 'BUILD') {
            const completedDates = new Set(
                entries
                    .filter((e: any) => e.kind === 'COMPLETED')
                    .map((e: any) => e.date.toISOString().substring(0, 10))
            );

            let streak = 0;
            const todayStr = getLocalDateString(new Date());
            const yesterdayStr = getOffsetDateString(todayStr, -1);

            let currentStr = todayStr;
            if (completedDates.has(todayStr)) {
                while (completedDates.has(currentStr)) {
                    streak++;
                    currentStr = getOffsetDateString(currentStr, -1);
                }
            } else if (completedDates.has(yesterdayStr)) {
                currentStr = yesterdayStr;
                while (completedDates.has(currentStr)) {
                    streak++;
                    currentStr = getOffsetDateString(currentStr, -1);
                }
            }

            // Weekly completion rate
            const last7Days: string[] = [];
            for (let i = 0; i < 7; i++) {
                last7Days.push(getOffsetDateString(todayStr, -i));
            }
            let completedCount = 0;
            for (const d of last7Days) {
                if (completedDates.has(d)) {
                    completedCount++;
                }
            }
            const weeklyCompletionRate = parseFloat((completedCount / 7).toFixed(2));

            return {
                currentStreak: streak,
                weeklyCompletionRate,
            };
        } else {
            // BREAK
            const relapseDates = entries
                .filter((e: any) => e.kind === 'RELAPSED')
                .map((e: any) => e.date.toISOString().substring(0, 10));

            let baseDateStr = habit.createdAt.toISOString().substring(0, 10);
            if (relapseDates.length > 0) {
                relapseDates.sort((a: string, b: string) => b.localeCompare(a));
                const latestRelapse = relapseDates[0];
                if (latestRelapse > baseDateStr) {
                    baseDateStr = latestRelapse;
                }
            }

            const todayStr = getLocalDateString(new Date());
            const diffTime = new Date(todayStr).getTime() - new Date(baseDateStr).getTime();
            const cleanStreak = Math.max(0, Math.floor(diffTime / (24 * 60 * 60 * 1000)));

            return {
                cleanStreak,
            };
        }
    }
}

// HELPER FUNCTIONS
function getLocalDateString(date: Date): string {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
}

function getOffsetDateString(dateStr: string, offsetDays: number): string {
    const date = new Date(dateStr);
    date.setUTCDate(date.getUTCDate() + offsetDays);
    return date.toISOString().substring(0, 10);
}

function parseDateOnly(dateStr?: string): Date {
    if (dateStr) {
        const regex = /^\d{4}-\d{2}-\d{2}$/;
        if (!regex.test(dateStr)) {
            throw new BadRequestException('Format tanggal harus YYYY-MM-DD');
        }
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) {
            throw new BadRequestException('Tanggal tidak valid');
        }
        return date;
    }

    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    return new Date(`${yyyy}-${mm}-${dd}`);
}
