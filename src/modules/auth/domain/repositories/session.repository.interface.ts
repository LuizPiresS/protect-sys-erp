import { SessionEntity } from '../entities/session.entity';

export interface ISessionRepository {
  create(session: SessionEntity): Promise<void>;
  findByRefreshToken(refreshToken: string): Promise<SessionEntity | null>;
  deleteByUserId(userId: string): Promise<void>;
}
