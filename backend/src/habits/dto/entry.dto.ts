import { IsOptional, Matches } from 'class-validator';
export class EntryDto {
    @IsOptional()
    @Matches(/^\d{4}-\d{2}-\d{2}$/, {
        message: 'Format tanggal harus YYYY-MM-DD',
    })
    date?: string;
}