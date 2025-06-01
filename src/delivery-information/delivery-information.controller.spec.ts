import { Test, TestingModule } from '@nestjs/testing';
import { DeliveryInformationController } from './delivery-information.controller';
import { DeliveryInformationService } from './delivery-information.service';

describe('DeliveryInformationController', () => {
  let controller: DeliveryInformationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeliveryInformationController],
      providers: [DeliveryInformationService],
    }).compile();

    controller = module.get<DeliveryInformationController>(DeliveryInformationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
