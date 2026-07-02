import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Req, HttpCode, HttpStatus, ParseIntPipe } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { HabitsService } from './habits.service';
import { CreateHabitDto } from './dto/create-habit.dto';
import { UpdateHabitDto } from './dto/update-habit.dto';

@UseGuards(JwtAuthGuard)
@Controller('habits')
export class HabitsController {
    constructor(private readonly habitsService: HabitsService) { }

    @Get()
    async findAll(@Req() req: any) {
        const userId = req.user.id;
        return this.habitsService.findAll(userId);
    }

    @Post()
    async create(@Req() req: any, @Body() dto: CreateHabitDto) {
        const userId = req.user.id;
        return this.habitsService.create(userId, dto);
    }

    @Patch(':id')
    async update(
        @Req() req: any,
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateHabitDto,
    ) {
        const userId = req.user.id;
        return this.habitsService.update(userId, id, dto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async remove(@Req() req: any, @Param('id', ParseIntPipe) id: number) {
        const userId = req.user.id;
        await this.habitsService.remove(userId, id);
    }
}
