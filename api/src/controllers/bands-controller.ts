import { Body, Get, Post, Query, Route, Tags } from 'tsoa';
import { bandRepository, IBand, IStoredBand } from '../db/band-repository';
import { ServerError } from '../errors/server-error';
import { BandService, IRemoveBandRequest, IValidateRemoveResult } from '../services/band-service';

@Route('bands')
export class BandsController {
  @Get()
  @Tags('Bands')
  public async getBands(@Query() marketId: string): Promise<IStoredBand[]> {
    return await bandRepository.find({ marketId });
  }

  @Post()
  @Tags('Bands')
  public async createBand(@Body() request: IBand): Promise<IStoredBand> {
    if (request.spreadBps <= 0 || request.spreadBps > 10000) {
      throw new ServerError('spread should be > 0 and <= 10000 (bps)', 400);
    }

    if (request.ratio < .01 || request.ratio > 1) {
      throw new ServerError('ratio should be > .01 and < 1', 400);
    }

    if (request.expirationSeconds < 600) {
      throw new ServerError('expirationSeconds should be >= 600 (10 minutes)');
    }

    return await bandRepository.create(request);
  }

  @Post('validate-remove/{bandId}')
  @Tags('Bands')
  public async validateRemoveBand(bandId: string): Promise<IValidateRemoveResult> {
    return await new BandService().validateRemove(bandId);
  }

  @Post('remove')
  @Tags('Bands')
  public async removeBand(@Body() request: IRemoveBandRequest) {
    await new BandService().remove(request);
  }
}
