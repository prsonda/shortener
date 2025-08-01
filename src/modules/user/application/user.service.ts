import {
  ConflictException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { ErrorMessages } from '../../../shared/constants/messages';
import { UserEntity } from '../domain/user.entity';
import { UserCreateDto } from '../presentation/dto/user-create.dto';
import { UserResponseDto } from '../presentation/dto/user-response.dto';
import { UserCreateUseCase } from './use-cases/user-create.use-case';
import { UserFindByEmailUseCase } from './use-cases/user-find-by-email.use-case';
import { UserFindByIdUseCase } from './use-cases/user-find-by-id.use-case';

@Injectable()
export class UserService {
  constructor(
    private readonly userCreateUseCase: UserCreateUseCase,
    private readonly userFindByIdUseCase: UserFindByIdUseCase,
    private readonly userFindByEmailUseCase: UserFindByEmailUseCase,
  ) {}

  async create(data: UserCreateDto): Promise<UserResponseDto> {
    const userExists = await this.userFindByEmailUseCase.execute(data.email);
    this.ensureUserDoesNotExist(userExists);
    const user = await this.userCreateUseCase.execute(data);
    const { id, name, email } = user;
    return { id, name, email };
  }

  async findById(id: string, userId: string): Promise<UserResponseDto | null> {
    if (!this.isOwner(id, userId)) {
      throw new ForbiddenException(ErrorMessages.forbidden);
    }
    const user = await this.userFindByIdUseCase.execute(id);
    if (!user) return null;
    const { name, email } = user;
    return { id, name, email };
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const user = await this.userFindByEmailUseCase.execute(email);
    return user;
  }

  ensureUserDoesNotExist(userExists: UserEntity | null) {
    if (userExists) throw new ConflictException(ErrorMessages.conflict);
  }

  private isOwner(id: string, userId: string): boolean {
    return id === userId;
  }
}
