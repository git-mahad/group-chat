import { IsString, IsOptional, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateGroupDto {
  @ApiProperty({
    description: 'Group title/name',
    example: 'General Discussion',
    type: String,
    minLength: 2,
  })
  @IsString()
  @MinLength(2)
  title: string;

  @ApiProperty({
    description: 'Group description (optional)',
    example: 'A group for general discussions and announcements',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;
}