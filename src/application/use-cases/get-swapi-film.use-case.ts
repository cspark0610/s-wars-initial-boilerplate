import { Injectable, Inject } from '@nestjs/common';
import { SWAPI_SERVICE, SwapiFilm, SwapiService } from '@src/domain/ports/swapi.service';

@Injectable()
export class GetSwapiFilmUseCase {
  constructor(@Inject(SWAPI_SERVICE) private readonly swapiService: SwapiService) {}

  async execute(uid: string | number): Promise<SwapiFilm> {
    return this.swapiService.getFilmById(uid);
  }
}
