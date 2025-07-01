import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  SecretsManagerClient,
  GetSecretValueCommand,
  CreateSecretCommand,
  UpdateSecretCommand,
  DeleteSecretCommand,
  ListSecretsCommand,
} from '@aws-sdk/client-secrets-manager';

export interface CreateSecretOptions {
  name: string;
  description?: string;
  secretString: string;
}

export interface UpdateSecretOptions {
  name: string;
  secretString: string;
}

@Injectable()
export class SecretsManagerService {
  private readonly logger = new Logger(SecretsManagerService.name);

  constructor(
    private readonly secretsManagerClient: SecretsManagerClient,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Obtém o valor de um secret
   */
  async getSecret(secretName: string): Promise<string> {
    const command = new GetSecretValueCommand({
      SecretId: secretName,
    });

    try {
      const response = await this.secretsManagerClient.send(command);
      this.logger.log(`Secret retrieved successfully: ${secretName}`);
      return response.SecretString;
    } catch (error) {
      this.logger.error(`Failed to get secret ${secretName}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Obtém um secret como objeto JSON
   */
  async getSecretAsJson<T>(secretName: string): Promise<T> {
    const secretString = await this.getSecret(secretName);
    try {
      return JSON.parse(secretString) as T;
    } catch (error) {
      this.logger.error(
        `Failed to parse secret ${secretName} as JSON: ${error.message}`,
      );
      throw error;
    }
  }

  /**
   * Cria um novo secret
   */
  async createSecret(options: CreateSecretOptions): Promise<string> {
    const command = new CreateSecretCommand({
      Name: options.name,
      Description: options.description,
      SecretString: options.secretString,
    });

    try {
      const response = await this.secretsManagerClient.send(command);
      this.logger.log(`Secret created successfully: ${options.name}`);
      return response.ARN;
    } catch (error) {
      this.logger.error(
        `Failed to create secret ${options.name}: ${error.message}`,
      );
      throw error;
    }
  }

  /**
   * Atualiza um secret existente
   */
  async updateSecret(options: UpdateSecretOptions): Promise<string> {
    const command = new UpdateSecretCommand({
      SecretId: options.name,
      SecretString: options.secretString,
    });

    try {
      const response = await this.secretsManagerClient.send(command);
      this.logger.log(`Secret updated successfully: ${options.name}`);
      return response.ARN;
    } catch (error) {
      this.logger.error(
        `Failed to update secret ${options.name}: ${error.message}`,
      );
      throw error;
    }
  }

  /**
   * Deleta um secret
   */
  async deleteSecret(secretName: string): Promise<boolean> {
    const command = new DeleteSecretCommand({
      SecretId: secretName,
      ForceDeleteWithoutRecovery: true,
    });

    try {
      await this.secretsManagerClient.send(command);
      this.logger.log(`Secret deleted successfully: ${secretName}`);
      return true;
    } catch (error) {
      this.logger.error(
        `Failed to delete secret ${secretName}: ${error.message}`,
      );
      throw error;
    }
  }

  /**
   * Lista todos os secrets
   */
  async listSecrets(): Promise<string[]> {
    const command = new ListSecretsCommand({});

    try {
      const response = await this.secretsManagerClient.send(command);
      const secrets =
        response.SecretList?.map((secret) => secret.Name).filter(Boolean) || [];
      this.logger.log(`Listed ${secrets.length} secrets`);
      return secrets as string[];
    } catch (error) {
      this.logger.error(`Failed to list secrets: ${error.message}`);
      throw error;
    }
  }

  /**
   * Obtém configuração de email
   */
  async getEmailConfig(): Promise<{
    host: string;
    port: number;
    username: string;
    password: string;
    from: string;
  }> {
    const secretName = this.configService.get<string>(
      'AWS_SECRET_EMAIL_CONFIG',
      'protect-sys/email-config',
    );
    return this.getSecretAsJson(secretName);
  }

  /**
   * Obtém configuração de JWT
   */
  async getJwtConfig(): Promise<{
    secret: string;
    expiresIn: string;
    refreshExpiresIn: string;
  }> {
    const secretName = this.configService.get<string>(
      'AWS_SECRET_JWT_CONFIG',
      'protect-sys/jwt-config',
    );
    return this.getSecretAsJson(secretName);
  }

  /**
   * Obtém configuração de pagamento
   */
  async getPaymentConfig(): Promise<{
    provider: string;
    apiKey: string;
    webhookSecret: string;
  }> {
    const secretName = this.configService.get<string>(
      'AWS_SECRET_PAYMENT_CONFIG',
      'protect-sys/payment-config',
    );
    return this.getSecretAsJson(secretName);
  }

  /**
   * Atualiza configuração de email
   */
  async updateEmailConfig(config: {
    host: string;
    port: number;
    username: string;
    password: string;
    from: string;
  }): Promise<string> {
    const secretName = this.configService.get<string>(
      'AWS_SECRET_EMAIL_CONFIG',
      'protect-sys/email-config',
    );
    return this.updateSecret({
      name: secretName,
      secretString: JSON.stringify(config),
    });
  }

  /**
   * Atualiza configuração de JWT
   */
  async updateJwtConfig(config: {
    secret: string;
    expiresIn: string;
    refreshExpiresIn: string;
  }): Promise<string> {
    const secretName = this.configService.get<string>(
      'AWS_SECRET_JWT_CONFIG',
      'protect-sys/jwt-config',
    );
    return this.updateSecret({
      name: secretName,
      secretString: JSON.stringify(config),
    });
  }

  /**
   * Atualiza configuração de pagamento
   */
  async updatePaymentConfig(config: {
    provider: string;
    apiKey: string;
    webhookSecret: string;
  }): Promise<string> {
    const secretName = this.configService.get<string>(
      'AWS_SECRET_PAYMENT_CONFIG',
      'protect-sys/payment-config',
    );
    return this.updateSecret({
      name: secretName,
      secretString: JSON.stringify(config),
    });
  }
}
