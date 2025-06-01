import { Test, TestingModule } from '@nestjs/testing';
import { DeliveryInformationService } from './delivery-information.service';

describe('DeliveryInformationService', () => {
  let service: DeliveryInformationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DeliveryInformationService],
    }).compile();

    service = module.get<DeliveryInformationService>(DeliveryInformationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
