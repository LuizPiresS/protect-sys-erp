import { Inject, Injectable } from '@nestjs/common';
import { CreateProfileInputDto } from '../../presentation/dtos/create-profile.input.dto';
import { CreateProfileOutputDto } from '../../presentation/dtos/create-profile.output.dto';
import { IProfileRepository } from '../../domain/interfaces/profile.repository.interface';
import { IProfileMapperService } from '../../domain/interfaces/profile-mapper.interface';
import {
  ProfileMapperServiceToken,
  ProfileRepositoryToken,
} from '../../../../shared/inject-tokens/profile.tokens';
import { PrismaClient } from '@prisma/client';

export interface ICreateProfileUseCase {
  execute(input: CreateProfileInputDto): Promise<CreateProfileOutputDto>;
}

@Injectable()
export class CreateProfileUseCase implements ICreateProfileUseCase {
  constructor(
    @Inject(ProfileRepositoryToken)
    private readonly profileRepository: IProfileRepository,

    @Inject(ProfileMapperServiceToken)
    private readonly profileMapperService: IProfileMapperService,

    private readonly prisma: PrismaClient,
  ) {}

  public async execute(
    input: CreateProfileInputDto,
  ): Promise<CreateProfileOutputDto> {
    const existingProfile = await this.profileRepository.findByUserId(
      this.prisma,
      input.userId,
      input.tenantId,
    );

    if (existingProfile) {
      throw new Error('Profile already exists for this user');
    }

    const newProfile = await this.profileRepository.create(this.prisma, {
      name: input.name,
      identificationDocument: input.identificationDocument,
      cellPhone: input.cellPhone,
      street: input.address.street,
      number: input.address.number,
      neighborhood: input.address.neighborhood,
      dueDate: input.paymentDetails.dueDate,
      billingEmail: input.paymentDetails.billingEmail,
      user: {
        connect: { id: input.userId },
      },
      tenant: {
        create: undefined,
        connectOrCreate: {
          where: undefined,
          create: undefined,
        },
        connect: undefined,
      },
    });

    return this.profileMapperService.toOutput(newProfile);
  }

  private formatDate(dateString: string): Date {
    const [day, month, year] = dateString.split('/');
    return new Date(`${year}-${month}-${day}`);
  }
}
