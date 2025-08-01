import { UserService } from '@/modules/user/application/user.service';
import { UserResponseDto } from '@/modules/user/presentation/dto/user-response.dto';
import { Injectable } from '@nestjs/common';
import { BcryptService } from '../../infrastructure/bcrypt.service';

@Injectable()
export class AuthValidateUserUseCase {
  constructor(
    private readonly bcryptService: BcryptService,
    private readonly userService: UserService,
  ) {}

  async execute(
    email: string,
    password: string,
  ): Promise<UserResponseDto | null> {
    const user = await this.userService.findByEmail(email);

    const isValid =
      user &&
      !user.deletedAt &&
      (await this.bcryptService.compare(password, user.password));

    return isValid ? { id: user.id, name: user.name, email } : null;
  }
}
