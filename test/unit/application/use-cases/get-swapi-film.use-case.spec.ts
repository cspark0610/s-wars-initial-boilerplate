import { createMock } from '@golevelup/ts-jest';
import { GetSwapiFilmUseCase } from '@src/application/use-cases/get-swapi-film.use-case';
import { SwapiService } from '@src/domain/ports/swapi.service';

describe('GetSwapiFilmUseCase', () => {
  let useCase: GetSwapiFilmUseCase;
  let swapiService: jest.Mocked<SwapiService>;

  beforeEach(() => {
    swapiService = createMock<SwapiService>();
    useCase = new GetSwapiFilmUseCase(swapiService);
  });

  it('should return film for uid 3', async () => {
    swapiService.getFilmById.mockResolvedValue({
      title: 'Return of the Jedi',
      episodeId: 6,
      openingCrawl: '...',
      director: 'Richard Marquand',
      producer: 'Howard G. Kazanjian, George Lucas, Rick McCallum',
      releaseDate: '1983-05-25',
      url: 'https://www.swapi.tech/api/films/3',
    });

    const result = await useCase.execute('3');

    expect(result.title).toBe('Return of the Jedi');
    expect(swapiService.getFilmById).toHaveBeenCalledWith('3');
  });
});
