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
import { DeliveryInformationService } from 'src/delivery-information/delivery-information.service';
import { CreateDeliveryInformationDto } from 'src/delivery-information/dto/create-delivery-information.dto';
import { DeliveryInformation } from 'src/delivery-information/entities/delivery-information.entity';

@Injectable()
export class OrderService {
  constructor(
    private readonly deliveryInformationService: DeliveryInformationService,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(CartItem)
    private readonly cartItemRepo: Repository<CartItem>,
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
  ) {}
  async create(userId: any, delivery: DeliveryInformation): Promise<Order> {
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
      delivery,
    });
    return await this.orderRepository.save(result);
  }

  async findAll(
    paginationQueryDto: PaginationQueryDto,
    filters: any,
    userId: number | undefined,
  ): Promise<{
    data: Order[];
    pagination: any;
    length: any;
    result: any;
    sumPrice: any;
  }> {
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
    const getCartItem = await this.cartItemRepo.find({
      where: {
        cart: {
          id: cart.id,
        },
      },
      relations: ['item'],
    });
    const length = getCartItem.length;
    // console.log(length);
    const result = getCartItem.map((item) => ({
      name: item.item.name,
      quantity: item.quantity,
    }));
    const sumPrice = getCartItem.reduce((acc, curr) => {
      return acc + Number(curr.item.price);
    }, 0);

    // console.log(result);
    // console.log(getCartItem);
    const { data, pagination } = await paginate<Order>(
      this.orderRepository,
      ['cart', 'delivery'],
      page,
      limit,
      allData,
      filters,
      sort,
    );
    return { data, pagination, length, result, sumPrice };
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

  async update(
    id: number,
    updateOrderDto: UpdateOrderDto,
  ): Promise<Order | null> {
    const getOne = await this.orderRepository.findOne({ where: { id } });
    if (!getOne) {
      throw new NotFoundException('The order not found');
    }
    const newOrder = Object.assign(getOne, updateOrderDto);
    return await this.orderRepository.save(newOrder);
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
