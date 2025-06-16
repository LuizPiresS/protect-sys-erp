export class SessionEntity {
  constructor(
    public readonly userId: string,
    public readonly refreshToken: string,
    public readonly expiresAt: Date,
    public readonly tenantId: string,
  ) {}
}
