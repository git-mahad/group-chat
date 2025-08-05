import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class JoinGroupDto {
  @ApiProperty({
    description: 'ID of the group to join',
    example: 1,
    type: Number,
  })
  @IsNumber()
  groupId: number;
}