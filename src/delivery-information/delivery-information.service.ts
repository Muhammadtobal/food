import { Injectable } from '@nestjs/common';
import { CreateDeliveryInformationDto } from './dto/create-delivery-information.dto';
import { UpdateDeliveryInformationDto } from './dto/update-delivery-information.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DeliveryInformation } from './entities/delivery-information.entity';
import { Repository } from 'typeorm';
import { PaginationQueryDto } from 'src/utils/paginateDto';
import { paginate } from 'src/utils/paginate';

@Injectable()
export class DeliveryInformationService {
  constructor(
    @InjectRepository(DeliveryInformation)
    private readonly deliveryInformationRepository: Repository<DeliveryInformation>,
  ) {}
  async create(createDeliveryInformationDto: CreateDeliveryInformationDto) {
    const result = await this.deliveryInformationRepository.create(
      createDeliveryInformationDto,
    );
    return await this.deliveryInformationRepository.save(result);
  }

async  findAll(paginationQueryDto:PaginationQueryDto,filters:any) {
   let { page, limit, allData, sortBy, order } = paginationQueryDto;
       page = Number(page) || 1;
       limit = Number(limit) || 10;
       const sortField = sortBy || 'id';
   
       const sort: Record<string, 'ASC' | 'DESC'> = {
         [sortField]: order === 'asc' ? 'ASC' : 'DESC',
       };
   
       const { data, pagination } = await paginate<DeliveryInformation>(
         this.deliveryInformationRepository,
         [],
         page,
         limit,
         allData,
         filters,
         sort,
       );
   
       return { data, pagination };
  }

  findOne(id: number) {
    return `This action returns a #${id} deliveryInformation`;
  }

  update(
    id: number,
    updateDeliveryInformationDto: UpdateDeliveryInformationDto,
  ) {
    return `This action updates a #${id} deliveryInformation`;
  }

  remove(id: number) {
    return `This action removes a #${id} deliveryInformation`;
  }
}
