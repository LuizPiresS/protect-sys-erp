import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Injectable,
} from '@nestjs/common';
import { AuditLogService } from 'src/shared/audition-logs/audit-log.service';

// Exemplo de erro de domínio
export class DomainException extends Error {
  constructor(
    public readonly message: string,
    public readonly status = 400,
    public readonly details?: any,
  ) {
    super(message);
  }
}

@Catch()
@Injectable()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(private readonly auditLogService: AuditLogService) {}

  async catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest<Request>();
    const tenantId = request['tenant']?.id;
    const userId = request['user']?.id;
    const correlationId = request['correlationId'];
    const action = 'UNHANDLED_ERROR';
    const details =
      exception instanceof HttpException
        ? JSON.stringify(exception.getResponse())
        : String(exception);

    await this.auditLogService.log({
      tenantId,
      userId,
      action,
      details,
      level: 'error',
      correlationId,
    });

    // Retorna erros de domínio (use case) para o client
    if (exception instanceof DomainException) {
      response.status(exception.status).json({
        statusCode: exception.status,
        message: exception.message,
        details: exception.details,
      });
      return;
    }

    // Retorna erros HTTP normalmente
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const resBody = exception.getResponse();
      response.status(status).json(resBody);
      return;
    }

    // Erro genérico
    response.status(500).json({
      statusCode: 500,
      message: 'Internal server error',
    });
  }
}
