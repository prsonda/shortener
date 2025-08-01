import { UserResponseDto } from '@/modules/user/presentation/dto/user-response.dto';
import { AuthMessages, UserMessages } from '@/shared/constants/messages';
import { ApiProperty } from '@nestjs/swagger';

export class AuthTokenResponseDto {
  @ApiProperty({
    type: UserResponseDto,
    description: UserMessages.userDescription,
  })
  user?: UserResponseDto;
  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
    description: AuthMessages.tokenDescription,
  })
  access_token: string;
}
