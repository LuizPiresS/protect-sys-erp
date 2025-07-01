import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  SNSClient,
  PublishCommand,
  CreateTopicCommand,
  SubscribeCommand,
  ListTopicsCommand,
  ListSubscriptionsByTopicCommand,
} from '@aws-sdk/client-sns';

export interface PublishMessageOptions {
  topicName: string;
  message: string;
  subject?: string;
  messageAttributes?: Record<string, any>;
}

export interface SubscribeOptions {
  topicName: string;
  protocol: 'email' | 'sms' | 'http' | 'https' | 'lambda';
  endpoint: string;
}

@Injectable()
export class SNSService {
  private readonly logger = new Logger(SNSService.name);

  constructor(
    private readonly snsClient: SNSClient,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Publica uma mensagem em um tópico SNS
   */
  async publishMessage(options: PublishMessageOptions): Promise<string> {
    const topicArn = await this.getTopicArn(options.topicName);
    
    const command = new PublishCommand({
      TopicArn: topicArn,
      Message: options.message,
      Subject: options.subject,
      MessageAttributes: options.messageAttributes,
    });

    try {
      const response = await this.snsClient.send(command);
      this.logger.log(`Message published successfully to topic ${options.topicName}`);
      return response.MessageId;
    } catch (error) {
      this.logger.error(`Failed to publish message to topic ${options.topicName}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Cria um novo tópico SNS
   */
  async createTopic(topicName: string): Promise<string> {
    const command = new CreateTopicCommand({
      Name: topicName,
    });

    try {
      const response = await this.snsClient.send(command);
      this.logger.log(`Topic created successfully: ${topicName}`);
      return response.TopicArn;
    } catch (error) {
      this.logger.error(`Failed to create topic ${topicName}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Inscreve um endpoint em um tópico
   */
  async subscribe(options: SubscribeOptions): Promise<string> {
    const topicArn = await this.getTopicArn(options.topicName);
    
    const command = new SubscribeCommand({
      TopicArn: topicArn,
      Protocol: options.protocol,
      Endpoint: options.endpoint,
    });

    try {
      const response = await this.snsClient.send(command);
      this.logger.log(`Subscribed ${options.endpoint} to topic ${options.topicName}`);
      return response.SubscriptionArn;
    } catch (error) {
      this.logger.error(`Failed to subscribe to topic ${options.topicName}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Lista todos os tópicos
   */
  async listTopics(): Promise<string[]> {
    const command = new ListTopicsCommand({});

    try {
      const response = await this.snsClient.send(command);
      const topics = response.Topics?.map(topic => topic.TopicArn).filter(Boolean) || [];
      this.logger.log(`Listed ${topics.length} topics`);
      return topics as string[];
    } catch (error) {
      this.logger.error(`Failed to list topics: ${error.message}`);
      throw error;
    }
  }

  /**
   * Lista inscrições de um tópico
   */
  async listSubscriptions(topicName: string): Promise<any[]> {
    const topicArn = await this.getTopicArn(topicName);
    
    const command = new ListSubscriptionsByTopicCommand({
      TopicArn: topicArn,
    });

    try {
      const response = await this.snsClient.send(command);
      const subscriptions = response.Subscriptions || [];
      this.logger.log(`Listed ${subscriptions.length} subscriptions for topic ${topicName}`);
      return subscriptions;
    } catch (error) {
      this.logger.error(`Failed to list subscriptions for topic ${topicName}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Obtém o ARN de um tópico
   */
  private async getTopicArn(topicName: string): Promise<string> {
    const topics = await this.listTopics();
    const topicArn = topics.find(arn => arn.includes(topicName));
    
    if (!topicArn) {
      throw new Error(`Topic ${topicName} not found`);
    }
    
    return topicArn;
  }

  /**
   * Envia notificação de usuário
   */
  async sendUserNotification(userId: string, message: string, subject?: string): Promise<string> {
    const topicName = this.configService.get<string>('AWS_SNS_TOPIC_USER_NOTIFICATIONS', 'protect-sys-user-notifications');
    
    return this.publishMessage({
      topicName,
      message: JSON.stringify({
        userId,
        message,
        timestamp: new Date().toISOString(),
      }),
      subject: subject || 'Notificação de Usuário',
      messageAttributes: {
        userId: {
          DataType: 'String',
          StringValue: userId,
        },
        type: {
          DataType: 'String',
          StringValue: 'user_notification',
        },
      },
    });
  }

  /**
   * Envia notificação de pagamento
   */
  async sendPaymentNotification(paymentId: string, message: string, subject?: string): Promise<string> {
    const topicName = this.configService.get<string>('AWS_SNS_TOPIC_PAYMENT_NOTIFICATIONS', 'protect-sys-payment-notifications');
    
    return this.publishMessage({
      topicName,
      message: JSON.stringify({
        paymentId,
        message,
        timestamp: new Date().toISOString(),
      }),
      subject: subject || 'Notificação de Pagamento',
      messageAttributes: {
        paymentId: {
          DataType: 'String',
          StringValue: paymentId,
        },
        type: {
          DataType: 'String',
          StringValue: 'payment_notification',
        },
      },
    });
  }

  /**
   * Envia notificação de sistema
   */
  async sendSystemNotification(level: 'info' | 'warning' | 'error', message: string, subject?: string): Promise<string> {
    const topicName = this.configService.get<string>('AWS_SNS_TOPIC_SYSTEM_NOTIFICATIONS', 'protect-sys-system-notifications');
    
    return this.publishMessage({
      topicName,
      message: JSON.stringify({
        level,
        message,
        timestamp: new Date().toISOString(),
      }),
      subject: subject || `Notificação de Sistema - ${level.toUpperCase()}`,
      messageAttributes: {
        level: {
          DataType: 'String',
          StringValue: level,
        },
        type: {
          DataType: 'String',
          StringValue: 'system_notification',
        },
      },
    });
  }
} 