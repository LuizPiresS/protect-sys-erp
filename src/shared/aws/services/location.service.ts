import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  LocationClient,
  SearchPlaceIndexForTextCommand,
  SearchPlaceIndexForPositionCommand,
  CreatePlaceIndexCommand,
  ListPlaceIndexesCommand,
  DeletePlaceIndexCommand,
} from '@aws-sdk/client-location';

export interface GeocodingResult {
  lat: number;
  lng: number;
  address: string;
  confidence?: string;
}

export interface ReverseGeocodingResult {
  address: string;
  lat: number;
  lng: number;
  confidence?: string;
}

export interface CreatePlaceIndexOptions {
  indexName: string;
  dataSource: string;
  description?: string;
}

@Injectable()
export class LocationService {
  private readonly logger = new Logger(LocationService.name);
  private readonly defaultIndexName: string;

  constructor(
    private readonly locationClient: LocationClient,
    private readonly configService: ConfigService,
  ) {
    this.defaultIndexName = this.configService.get<string>(
      'AWS_LOCATION_INDEX_NAME',
      'protect-sys-place-index',
    );
  }

  /**
   * Faz geocodificação de um endereço
   */
  async geocodeAddress(
    address: string,
    indexName?: string,
  ): Promise<GeocodingResult[]> {
    const command = new SearchPlaceIndexForTextCommand({
      IndexName: indexName || this.defaultIndexName,
      Text: address,
      MaxResults: 5,
    });

    try {
      const response = await this.locationClient.send(command);
      const results: GeocodingResult[] = [];

      if (response.Results) {
        for (const result of response.Results) {
          if (
            result.Place &&
            result.Place.Geometry &&
            result.Place.Geometry.Point
          ) {
            const point = result.Place.Geometry.Point;
            results.push({
              lat: point[1], // Latitude
              lng: point[0], // Longitude
              address: result.Place.Label || address,
            });
          }
        }
      }

      this.logger.log(
        `Geocoded address "${address}" - found ${results.length} results`,
      );
      return results;
    } catch (error) {
      this.logger.error(
        `Failed to geocode address "${address}": ${error.message}`,
      );
      throw error;
    }
  }

  /**
   * Faz geocodificação reversa (coordenadas para endereço)
   */
  async reverseGeocode(
    lat: number,
    lng: number,
    indexName?: string,
  ): Promise<ReverseGeocodingResult[]> {
    const command = new SearchPlaceIndexForPositionCommand({
      IndexName: indexName || this.defaultIndexName,
      Position: [lng, lat], // [longitude, latitude]
      MaxResults: 5,
    });

    try {
      const response = await this.locationClient.send(command);
      const results: ReverseGeocodingResult[] = [];

      if (response.Results) {
        for (const result of response.Results) {
          if (
            result.Place &&
            result.Place.Geometry &&
            result.Place.Geometry.Point
          ) {
            const point = result.Place.Geometry.Point;
            results.push({
              address: result.Place.Label || 'Endereço não encontrado',
              lat: point[1], // Latitude
              lng: point[0], // Longitude
            });
          }
        }
      }

      this.logger.log(
        `Reverse geocoded coordinates [${lat}, ${lng}] - found ${results.length} results`,
      );
      return results;
    } catch (error) {
      this.logger.error(
        `Failed to reverse geocode coordinates [${lat}, ${lng}]: ${error.message}`,
      );
      throw error;
    }
  }

  /**
   * Cria um novo place index
   */
  async createPlaceIndex(options: CreatePlaceIndexOptions): Promise<string> {
    const command = new CreatePlaceIndexCommand({
      IndexName: options.indexName,
      DataSource: options.dataSource,
      Description: options.description,
    });

    try {
      const response = await this.locationClient.send(command);
      this.logger.log(`Place index created successfully: ${options.indexName}`);
      return response.IndexArn;
    } catch (error) {
      this.logger.error(
        `Failed to create place index ${options.indexName}: ${error.message}`,
      );
      throw error;
    }
  }

  /**
   * Lista todos os place indexes
   */
  async listPlaceIndexes(): Promise<string[]> {
    const command = new ListPlaceIndexesCommand({});

    try {
      const response = await this.locationClient.send(command);
      const indexes =
        response.Entries?.map((entry) => entry.IndexName).filter(Boolean) || [];
      this.logger.log(`Listed ${indexes.length} place indexes`);
      return indexes as string[];
    } catch (error) {
      this.logger.error(`Failed to list place indexes: ${error.message}`);
      throw error;
    }
  }

  /**
   * Deleta um place index
   */
  async deletePlaceIndex(indexName: string): Promise<boolean> {
    const command = new DeletePlaceIndexCommand({
      IndexName: indexName,
    });

    try {
      await this.locationClient.send(command);
      this.logger.log(`Place index deleted successfully: ${indexName}`);
      return true;
    } catch (error) {
      this.logger.error(
        `Failed to delete place index ${indexName}: ${error.message}`,
      );
      throw error;
    }
  }

  /**
   * Geocodifica um endereço e retorna o primeiro resultado
   */
  async getCoordinates(
    address: string,
    indexName?: string,
  ): Promise<{ lat: number; lng: number }> {
    const results = await this.geocodeAddress(address, indexName);

    if (results.length === 0) {
      throw new Error(`No results found for address: ${address}`);
    }

    return {
      lat: results[0].lat,
      lng: results[0].lng,
    };
  }

  /**
   * Geocodifica um endereço completo (rua, número, bairro, cidade)
   */
  async geocodeFullAddress(
    street: string,
    number: string,
    neighborhood: string,
    city?: string,
  ): Promise<GeocodingResult[]> {
    const fullAddress = `${street}, ${number}, ${neighborhood}${city ? `, ${city}` : ''}`;
    return this.geocodeAddress(fullAddress);
  }

  /**
   * Calcula a distância entre dois pontos (fórmula de Haversine)
   */
  calculateDistance(
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number,
  ): number {
    const R = 6371; // Raio da Terra em km
    const dLat = this.toRadians(lat2 - lat1);
    const dLng = this.toRadians(lng2 - lng1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) *
        Math.cos(this.toRadians(lat2)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  /**
   * Converte graus para radianos
   */
  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  /**
   * Verifica se um place index existe
   */
  async placeIndexExists(indexName: string): Promise<boolean> {
    const indexes = await this.listPlaceIndexes();
    return indexes.includes(indexName);
  }

  /**
   * Cria o place index padrão se não existir
   */
  async ensureDefaultPlaceIndex(): Promise<void> {
    if (!(await this.placeIndexExists(this.defaultIndexName))) {
      this.logger.log(`Creating default place index: ${this.defaultIndexName}`);
      await this.createPlaceIndex({
        indexName: this.defaultIndexName,
        dataSource: 'Here',
        description:
          'Place index padrão para geocodificação do Protect-Sys-ERP',
      });
    }
  }
}
