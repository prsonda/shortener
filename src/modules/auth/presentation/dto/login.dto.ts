import { AuthMessages } from '@/shared/constants/messages';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'email@email.com',
    description: AuthMessages.emailDescription,
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'password',
    description: AuthMessages.passwordDescription,
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}
