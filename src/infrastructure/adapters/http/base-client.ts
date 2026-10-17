import { ConfigService } from '@nestjs/config';
import { ConfigKey } from '@src/config/config-keys';

export abstract class BaseClient {
  constructor(
    protected readonly baseUrl: string,
    protected readonly configService: ConfigService,
  ) {}

  protected async get<T>(path: string): Promise<T> {
    const url = `${this.baseUrl}${path}`;
    const timeoutMs = this.configService.get<number>(ConfigKey.HTTP_TIMEOUT_MS) ?? 5000;
    const maxAttempts = this.configService.get<number>(ConfigKey.HTTP_RETRY_MAX_ATTEMPTS) ?? 3;
    const initialDelay = this.configService.get<number>(ConfigKey.HTTP_RETRY_INITIAL_DELAY) ?? 100;
    const maxDelay = this.configService.get<number>(ConfigKey.HTTP_RETRY_MAX_DELAY) ?? 1000;

    let lastError: unknown = new Error(`Failed to fetch ${url}`);

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

        const response = await fetch(url, {
          method: 'GET',
          signal: controller.signal,
        });
        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        return (await response.json()) as T;
      } catch (error) {
        lastError = error;
        if (attempt < maxAttempts) {
          const delay = Math.min(initialDelay * 2 ** (attempt - 1), maxDelay);
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    }

    throw lastError;
  }
}
