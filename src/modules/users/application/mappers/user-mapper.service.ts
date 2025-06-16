import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { CreateUserOutputDTO } from '../../presentation/http/dtos/createUserOutputDTO';
import { IUserMapperService } from '../../domain/interfaces/user-mapper.service.interface';

@Injectable()
export class UserMapperService implements IUserMapperService {
  public toOutput(user: User): CreateUserOutputDTO {
    return {
      id: user.id,
      email: user.email,
      isActive: !user.isDeleted,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
