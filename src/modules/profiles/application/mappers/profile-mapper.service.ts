import { Injectable } from '@nestjs/common';
import { Profile } from '@prisma/client';
import { AddressEntity } from '../../domain/entities/shared/address.entity';
import { PaymentDetailsEntity } from '../../domain/entities/shared/payment-details.entity';
import { IProfileMapperService } from '../../domain/interfaces/profile-mapper.interface';
import { CreateProfileOutputDto } from '../../presentation/dtos/create-profile.output.dto';

@Injectable()
export class ProfileMapperService implements IProfileMapperService {
  public toOutput(input: Profile): CreateProfileOutputDto {
    const address: AddressEntity = {
      street: input.street,
      number: input.number,
      neighborhood: input.neighborhood,
      // latitude: profile.latitude,
      // longitude: profile.longitude,
    };

    const paymentDetails: PaymentDetailsEntity = {
      dueDate: input.dueDate,
      billingEmail: input.billingEmail,
    };

    return {
      id: input.id,
      photoUrl: input.photoUrl || undefined,
      name: input.name,
      cellPhone: input.cellPhone,
      identificationDocument: input.identificationDocument,
      address,
      paymentDetails,
    };
  }
}