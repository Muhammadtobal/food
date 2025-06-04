import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { Repository } from 'typeorm';
import { PaginationQueryDto } from 'src/utils/paginateDto';
import { paginate } from 'src/utils/paginate';
import { find } from 'rxjs';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
  ) {}
  async create(createCartDto: CreateCartDto): Promise<Cart> {
    const result = this.cartRepository.create(createCartDto);
    return this.cartRepository.save(result);
  }

  async findAll(
    paginationQueryDto: PaginationQueryDto,
    filters: any,
  ): Promise<{ data: Cart[]; pagination: any }> {
    let { page, limit, allData, sortBy, order } = paginationQueryDto;
    page = Number(page) || 1;
    limit = Number(limit) || 10;
    const sortField = sortBy || 'id';

    const sort: Record<string, 'ASC' | 'DESC'> = {
      [sortField]: order === 'asc' ? 'ASC' : 'DESC',
    };

    const { data, pagination } = await paginate<Cart>(
      this.cartRepository,
      [],
      page,
      limit,
      allData,
      filters,
      sort,
    );
    return { data, pagination };
  }

  async findOne(id: number): Promise<Cart | null> {
    const findCart =await  this.cartRepository.findOne({ where: { id } });
    if (!findCart) {
      throw new NotFoundException(`the Cart not found with ${id}`);
    }
    return findCart;
  }

  async update(id: number, updateCartDto: UpdateCartDto): Promise<Cart | null> {
    const findCart = await this.cartRepository.findOne({ where: { id } });
    if (!findCart) {
      throw new NotFoundException(`the Cart not found with ${id}`);
    }
    const updatedCart= Object.assign(findCart, updateCartDto);
    return  await this.cartRepository.save(updatedCart);
  }

  async remove(id: number): Promise<void> {
    const findCart = await this.cartRepository.findOne({ where: { id } });
    if (!findCart) {
      throw new NotFoundException('the Cart not found');
    }
   await   this.cartRepository.delete(id)
  }
}
