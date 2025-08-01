import { UserMessages } from '@/shared/constants/messages';
import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({
    example: 'e913de7a-1221-4db8-84d6-d7a236d192ac',
    description: UserMessages.idDescripton,
  })
  id: string;

  @ApiProperty({
    example: 'John Doe',
    description: UserMessages.nameDescription,
  })
  name: string;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: UserMessages.emailDescription,
  })
  email: string;
}
