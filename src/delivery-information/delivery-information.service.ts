import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDeliveryInformationDto } from './dto/create-delivery-information.dto';
import { UpdateDeliveryInformationDto } from './dto/update-delivery-information.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DeliveryInformation } from './entities/delivery-information.entity';
import { Repository } from 'typeorm';
import { PaginationQueryDto } from 'src/utils/paginateDto';
import { paginate } from 'src/utils/paginate';
import { get } from 'http';

@Injectable()
export class DeliveryInformationService {
  constructor(
    @InjectRepository(DeliveryInformation)
    private readonly deliveryInformationRepository: Repository<DeliveryInformation>,
  ) {}
  async create(
    createDeliveryInformationDto: CreateDeliveryInformationDto,
    userId: number,
  ) {
    const result = await this.deliveryInformationRepository.create({
      ...createDeliveryInformationDto,
      user: { id: userId },
    });
    return await this.deliveryInformationRepository.save(result);
  }

  async findAll(paginationQueryDto: PaginationQueryDto, filters: any) {
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

  async findOne(id: number) {
    const getOne = await this.deliveryInformationRepository.findOne({
      where: { id },
    });
    if (!getOne)
      throw new NotFoundException(
        `the delivery-information not found with this ${id}`,
      );
    return getOne;
  }

  async update(
    id: number,
    updateDeliveryInformationDto: UpdateDeliveryInformationDto,
  ): Promise<DeliveryInformation> {
    const getOne = await this.deliveryInformationRepository.findOne({
      where: { id },
    });
    if (!getOne) {
      throw new NotFoundException(
        `the delivery-information not found with this ${id}`,
      );
    }
    const updateDeliver = Object.assign(getOne, updateDeliveryInformationDto);
    return await this.deliveryInformationRepository.save(updateDeliver);
  }

  async remove(id: number): Promise<void> {
    const getOne = await this.deliveryInformationRepository.findOne({
      where: { id },
    });
    if (!getOne) {
      throw new NotFoundException(
        `the delivery-information not found with this ${id}`,
      );
    }
    await this.deliveryInformationRepository.delete(id);
  }
}
