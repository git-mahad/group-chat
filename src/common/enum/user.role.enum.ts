import { ApiProperty } from '@nestjs/swagger';

export enum UserRole {
  // @ApiProperty({ description: 'Administrator role', example: 'admin' })
  ADMIN = 'admin',
  // @ApiProperty({ description: 'Regular user role', example: 'user' })
  USER = 'user',
}