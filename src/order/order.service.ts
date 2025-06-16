import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CartItem } from 'src/cart-item/entities/cart-item.entity';
import { Repository } from 'typeorm';
import { Cart } from 'src/cart/entities/cart.entity';
import { Order } from './entities/order.entity';
import { PaginationQueryDto } from 'src/utils/paginateDto';
import { paginate } from 'src/utils/paginate';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(CartItem)
    private readonly cartItemRepo: Repository<CartItem>,
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
  ) {}
  async create(createOrderDto: CreateOrderDto, userId: number): Promise<Order> {
    const cart = await this.cartRepository.findOne({
      where: {
        user: {
          id: userId,
        },
      },
    });

    if (!cart) {
      throw new NotFoundException('Cart not found for this user');
    }
    const result = await this.orderRepository.create({
      cart: cart,
    });
    return await this.orderRepository.save(result);
  }

  async findAll(
    paginationQueryDto: PaginationQueryDto,
    filters: any,
    userId: number | undefined,
  ): Promise<{ data: Order[]; pagination: any }> {
    let { page, limit, allData, sortBy, order } = paginationQueryDto;
    page = Number(page) || 1;
    limit = Number(limit) || 10;
    const sortField = sortBy || 'id';

    const sort: Record<string, 'ASC' | 'DESC'> = {
      [sortField]: order === 'asc' ? 'ASC' : 'DESC',
    };

    const cart = await this.cartRepository.findOne({
      where: {
        user: {
          id: userId,
        },
      },
    });
    if (!cart) {
      throw new NotFoundException('Cart not found for this user');
    }
    const getOrder = await this.orderRepository.findOne({
      where: {
        cart: {
          id: cart.id,
        },
      },
    });
    const { data, pagination } = await paginate<Order>(
      this.orderRepository,
      ['cart'],
      page,
      limit,
      allData,
      filters,
      sort,
    );
    return { data, pagination };
  }

  async findOne(userId: number): Promise<Order | null> {
    const cart = await this.cartRepository.findOne({
      where: {
        user: {
          id: userId,
        },
      },
    });
    if (!cart) {
      throw new NotFoundException('Cart not found for this user');
    }
    const getOrder = await this.orderRepository.findOne({
      where: {
        cart: {
          id: cart.id,
        },
      },
    });
    return getOrder;
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
