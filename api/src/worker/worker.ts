import { bandRepository } from '../db/band-repository';
import { marketRepository } from '../db/market-repository';
import { BandService } from '../services/band-service';
import { MarketService } from '../services/market-service';

export class Worker {
  private readonly bandService = new BandService();
  private readonly marketService = new MarketService();

  public async start() {
    this.watchBands();
    this.watchMarketStats();
  }

  private watchBands() {
    let isProcessing = false;
    setInterval(async () => {
      if (isProcessing) { return; }
      isProcessing = true;

      try {
        const markets = await marketRepository.find({ active: true });
        for (let i = 0; i < markets.length; i++) {
          const market = markets[i];

          const bands = await bandRepository.find({ marketId: market._id });
          for (let index = 0; index < bands.length; index++) {
            const band = bands[index];
            await this.bandService.start(band);
          }
        }
      } catch (err) {
        console.error(err);
      }
      isProcessing = false;
    }, 5000);
  }

  private watchMarketStats() {
    let isProcessing = false;
    setInterval(async () => {
      if (isProcessing) { return; }
      isProcessing = true;

      try {
        const markets = await marketRepository.find({});
        for (let i = 0; i < markets.length; i++) {
          await this.marketService.generateStats(markets[i]._id);
        }
      } catch (err) {
        console.error(err);
      }
      isProcessing = false;
    }, 5000);
  }
}
