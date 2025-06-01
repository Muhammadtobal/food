import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { DeliveryInformationService } from './delivery-information.service';
import { CreateDeliveryInformationDto } from './dto/create-delivery-information.dto';
import { UpdateDeliveryInformationDto } from './dto/update-delivery-information.dto';
import { PaginationQueryDto } from 'src/utils/paginateDto';

@Controller('delivery-information')
export class DeliveryInformationController {
  constructor(
    private readonly deliveryInformationService: DeliveryInformationService,
  ) {}

  @Post()
  async create(
    @Body() createDeliveryInformationDto: CreateDeliveryInformationDto,
  ) {
    const result = await this.deliveryInformationService.create(
      createDeliveryInformationDto,
    );
    return {
      success: true,
      message: 'delivery-information created successfully',
      data: result,
    };
  }

  @Get()
  async findAll(
    @Query() paginationQueryDto: PaginationQueryDto,
    @Query() queryParams: any,
  ) {
    const { page, limit, allData, sortBy, order, ...filters } = queryParams;
    const { data, pagination } = await this.deliveryInformationService.findAll(paginationQueryDto, filters);
    return {
      success: true,
      message: 'delivery-information fetched successfully',
      data,
      pagination,
    };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.deliveryInformationService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDeliveryInformationDto: UpdateDeliveryInformationDto,
  ) {
    return this.deliveryInformationService.update(
      +id,
      updateDeliveryInformationDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.deliveryInformationService.remove(+id);
  }
}
