import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Put,
} from '@nestjs/common';
import { DeliveryInformationService } from './delivery-information.service';
import { CreateDeliveryInformationDto } from './dto/create-delivery-information.dto';
import { UpdateDeliveryInformationDto } from './dto/update-delivery-information.dto';
import { PaginationQueryDto } from 'src/utils/paginateDto';
import { retry } from 'rxjs';

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
  async findOne(@Param('id') id: number) {
  const result = await this.deliveryInformationService.findOne(id)
  return {
    success: true,
    message: 'delivery-information fetched successfully',
    data:result,

  };
  }

  @Put(':id')
 async update(
    @Param('id') id: number,
    @Body() updateDeliveryInformationDto: UpdateDeliveryInformationDto,
  ) {
 const result = await this.deliveryInformationService.update(id,updateDeliveryInformationDto)
   return {
    success: true,
    message: 'delivery-information updated successfully',
    data:result,
   }
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    await this.deliveryInformationService.remove(id)
    return {
      success: true,
      message: 'Delivery-Information deleted successfully',
    };
  
  }
}
