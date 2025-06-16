import { Profile } from '@prisma/client';
import { CreateProfileOutputDto } from '../../presentation/dtos/create-profile.output.dto';

export interface IProfileMapperService {
  toOutput(profile: Profile): CreateProfileOutputDto;
}
