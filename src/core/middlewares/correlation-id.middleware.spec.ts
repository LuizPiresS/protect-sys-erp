import { Test, TestingModule } from '@nestjs/testing';
import { Request, Response, NextFunction } from 'express';
import { CorrelationIdMiddleware } from './correlation-id.middleware';
import { v4 as uuidv4 } from 'uuid';

// Mock do uuid
jest.mock('uuid', () => ({
  v4: jest.fn(),
}));

describe('CorrelationIdMiddleware', () => {
  let middleware: CorrelationIdMiddleware;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.MockedFunction<NextFunction>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CorrelationIdMiddleware],
    }).compile();

    middleware = module.get<CorrelationIdMiddleware>(CorrelationIdMiddleware);

    // Reset dos mocks
    jest.clearAllMocks();

    // Setup dos mocks
    mockRequest = {
      headers: {},
    };

    mockResponse = {
      setHeader: jest.fn(),
    };

    mockNext = jest.fn() as jest.MockedFunction<NextFunction>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('use', () => {
    it('deve gerar um novo correlation ID quando não existe no header', () => {
      // Arrange
      const mockUuid = 'test-uuid-123';
      (uuidv4 as jest.Mock).mockReturnValue(mockUuid);

      mockRequest.headers = {};

      // Act
      middleware.use(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      // Assert
      expect(mockRequest['correlationId']).toBe(mockUuid);
      expect(mockResponse.setHeader).toHaveBeenCalledWith(
        'x-correlation-id',
        mockUuid,
      );
      expect(mockNext).toHaveBeenCalled();
      expect(uuidv4).toHaveBeenCalledTimes(1);
    });

    it('deve usar o correlation ID existente no header quando fornecido', () => {
      // Arrange
      const existingCorrelationId = 'existing-correlation-id-456';
      mockRequest.headers = {
        'x-correlation-id': existingCorrelationId,
      };

      // Act
      middleware.use(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      // Assert
      expect(mockRequest['correlationId']).toBe(existingCorrelationId);
      expect(mockResponse.setHeader).toHaveBeenCalledWith(
        'x-correlation-id',
        existingCorrelationId,
      );
      expect(mockNext).toHaveBeenCalled();
      expect(uuidv4).not.toHaveBeenCalled();
    });

    it('deve usar o correlation ID existente quando fornecido em diferentes formatos de header', () => {
      // Arrange
      const existingCorrelationId = 'existing-correlation-id-789';
      mockRequest.headers = {
        'x-correlation-id': existingCorrelationId, // Formato correto
      };

      // Act
      middleware.use(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      // Assert
      expect(mockRequest['correlationId']).toBe(existingCorrelationId);
      expect(mockResponse.setHeader).toHaveBeenCalledWith(
        'x-correlation-id',
        existingCorrelationId,
      );
      expect(mockNext).toHaveBeenCalled();
    });

    it('deve gerar um novo correlation ID quando o header está vazio', () => {
      // Arrange
      const mockUuid = 'test-uuid-empty';
      (uuidv4 as jest.Mock).mockReturnValue(mockUuid);

      mockRequest.headers = {
        'x-correlation-id': '',
      };

      // Act
      middleware.use(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      // Assert
      expect(mockRequest['correlationId']).toBe(mockUuid);
      expect(mockResponse.setHeader).toHaveBeenCalledWith(
        'x-correlation-id',
        mockUuid,
      );
      expect(mockNext).toHaveBeenCalled();
      expect(uuidv4).toHaveBeenCalledTimes(1);
    });

    it('deve gerar um novo correlation ID quando o header é undefined', () => {
      // Arrange
      const mockUuid = 'test-uuid-undefined';
      (uuidv4 as jest.Mock).mockReturnValue(mockUuid);

      mockRequest.headers = {
        'x-correlation-id': undefined,
      };

      // Act
      middleware.use(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      // Assert
      expect(mockRequest['correlationId']).toBe(mockUuid);
      expect(mockResponse.setHeader).toHaveBeenCalledWith(
        'x-correlation-id',
        mockUuid,
      );
      expect(mockNext).toHaveBeenCalled();
      expect(uuidv4).toHaveBeenCalledTimes(1);
    });

    it('deve gerar um novo correlation ID quando o header é null', () => {
      // Arrange
      const mockUuid = 'test-uuid-null';
      (uuidv4 as jest.Mock).mockReturnValue(mockUuid);

      mockRequest.headers = {
        'x-correlation-id': null,
      };

      // Act
      middleware.use(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      // Assert
      expect(mockRequest['correlationId']).toBe(mockUuid);
      expect(mockResponse.setHeader).toHaveBeenCalledWith(
        'x-correlation-id',
        mockUuid,
      );
      expect(mockNext).toHaveBeenCalled();
      expect(uuidv4).toHaveBeenCalledTimes(1);
    });

    it('deve sempre chamar next() independentemente do cenário', () => {
      // Arrange
      const mockUuid = 'test-uuid-next';
      (uuidv4 as jest.Mock).mockReturnValue(mockUuid);

      // Act - Cenário 1: Sem header
      middleware.use(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );
      expect(mockNext).toHaveBeenCalledTimes(1);

      // Reset
      mockNext.mockClear();

      // Act - Cenário 2: Com header
      mockRequest.headers = { 'x-correlation-id': 'existing-id' };
      middleware.use(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );
      expect(mockNext).toHaveBeenCalledTimes(1);
    });

    it('deve definir o correlation ID no request object corretamente', () => {
      // Arrange
      const mockUuid = 'test-uuid-request';
      (uuidv4 as jest.Mock).mockReturnValue(mockUuid);

      // Act
      middleware.use(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      // Assert
      expect(mockRequest['correlationId']).toBeDefined();
      expect(typeof mockRequest['correlationId']).toBe('string');
      expect(mockRequest['correlationId']).toBe(mockUuid);
    });

    it('deve definir o header de resposta corretamente', () => {
      // Arrange
      const mockUuid = 'test-uuid-response';
      (uuidv4 as jest.Mock).mockReturnValue(mockUuid);

      // Act
      middleware.use(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      // Assert
      expect(mockResponse.setHeader).toHaveBeenCalledWith(
        'x-correlation-id',
        mockUuid,
      );
      expect(mockResponse.setHeader).toHaveBeenCalledTimes(1);
    });

    it('deve gerar novo correlation ID quando header tem formato incorreto', () => {
      // Arrange
      const mockUuid = 'test-uuid-case-sensitive';
      (uuidv4 as jest.Mock).mockReturnValue(mockUuid);

      mockRequest.headers = {
        'X-CORRELATION-ID': 'case-insensitive-id', // Formato incorreto (maiúsculas)
      };

      // Act
      middleware.use(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      // Assert
      expect(mockRequest['correlationId']).toBe(mockUuid);
      expect(mockResponse.setHeader).toHaveBeenCalledWith(
        'x-correlation-id',
        mockUuid,
      );
      expect(uuidv4).toHaveBeenCalledTimes(1);
    });
  });

  describe('integração com uuid', () => {
    it('deve chamar uuid.v4() apenas quando necessário gerar novo ID', () => {
      // Arrange
      const mockUuid = 'generated-uuid';
      (uuidv4 as jest.Mock).mockReturnValue(mockUuid);

      // Act - Sem header (deve gerar)
      middleware.use(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );
      expect(uuidv4).toHaveBeenCalledTimes(1);

      // Reset
      (uuidv4 as jest.Mock).mockClear();

      // Act - Com header (não deve gerar)
      mockRequest.headers = { 'x-correlation-id': 'existing-id' };
      middleware.use(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );
      expect(uuidv4).not.toHaveBeenCalled();
    });

    it('deve usar o valor retornado pelo uuid.v4()', () => {
      // Arrange
      const mockUuid = 'specific-uuid-value';
      (uuidv4 as jest.Mock).mockReturnValue(mockUuid);

      // Act
      middleware.use(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      // Assert
      expect(mockRequest['correlationId']).toBe(mockUuid);
      expect(mockResponse.setHeader).toHaveBeenCalledWith(
        'x-correlation-id',
        mockUuid,
      );
    });
  });
});
