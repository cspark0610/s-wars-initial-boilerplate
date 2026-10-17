import { ConfigService } from '@nestjs/config';
import { SwapiClient } from '@src/infrastructure/adapters/http/swapi.client';

describe('SwapiClient', () => {
  let client: SwapiClient;
  let configService: ConfigService;

  beforeEach(() => {
    configService = {
      get: jest.fn((key: string) => {
        const values: Record<string, unknown> = {
          HTTP_TIMEOUT_MS: 5000,
          HTTP_RETRY_MAX_ATTEMPTS: 1,
          HTTP_RETRY_INITIAL_DELAY: 10,
          HTTP_RETRY_MAX_DELAY: 100,
        };
        return values[key];
      }),
    } as unknown as ConfigService;

    client = new SwapiClient(configService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('getFilmById', () => {
    it('should return mapped film for /films/3', async () => {
      const mockResponse = {
        result: {
          properties: {
            title: 'Revenge of the Sith',
            episode_id: 3,
            opening_crawl: 'War!',
            director: 'George Lucas',
            producer: 'Rick McCallum',
            release_date: '2005-05-19',
            url: 'https://www.swapi.tech/api/films/3',
          },
        },
      };

      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(mockResponse),
      } as unknown as Response);

      const film = await client.getFilmById(3);

      expect(film.title).toBe('Revenge of the Sith');
      expect(film.episodeId).toBe(3);
      expect(film.url).toBe('https://www.swapi.tech/api/films/3');
      expect(global.fetch).toHaveBeenCalledWith(
        'https://www.swapi.tech/api/films/3',
        expect.any(Object),
      );
    });

    it('should throw when film not found', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue({}),
      } as unknown as Response);

      await expect(client.getFilmById(99)).rejects.toThrow('Film 99 not found in SWAPI');
    });
  });

  describe('getAllFilms', () => {
    it('should return mapped films list', async () => {
      const mockResponse = {
        result: [
          {
            properties: {
              title: 'A New Hope',
              episode_id: 4,
              opening_crawl: 'It is a period of civil war...',
              director: 'George Lucas',
              producer: 'Gary Kurtz',
              release_date: '1977-05-25',
              url: 'https://www.swapi.tech/api/films/1',
            },
          },
        ],
      };

      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(mockResponse),
      } as unknown as Response);

      const films = await client.getAllFilms();

      expect(films).toHaveLength(1);
      expect(films[0].title).toBe('A New Hope');
    });
  });
});
