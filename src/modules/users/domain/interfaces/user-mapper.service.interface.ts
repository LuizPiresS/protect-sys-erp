import { User } from '@prisma/client';
import { CreateUserOutputDTO } from '../../presentation/http/dtos/createUserOutputDTO';

export interface IUserMapperService {
  toOutput(user: User): CreateUserOutputDTO;
}
