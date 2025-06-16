import { Expose } from 'class-transformer';

export class CreateUserOutputDTO {
  @Expose()
  id: string;

  @Expose()
  email: string;

  @Expose()
  isActive: boolean;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
