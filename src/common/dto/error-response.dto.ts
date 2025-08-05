import { ApiProperty } from '@nestjs/swagger';

export class ErrorResponseDto {
  @ApiProperty({
    description: 'HTTP status code',
    example: 400,
    type: Number,
  })
  statusCode: number;

  @ApiProperty({
    description: 'Error message',
    example: 'Bad Request',
    type: String,
  })
  message: string;

  @ApiProperty({
    description: 'Error details (optional)',
    example: ['email must be an email', 'password must be longer than or equal to 6 characters'],
    type: [String],
    required: false,
  })
  error?: string[];
} 