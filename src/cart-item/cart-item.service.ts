import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CartItem } from './entities/cart-item.entity';
import { Repository } from 'typeorm';
import { Cart } from 'src/cart/entities/cart.entity';
import { CartService } from 'src/cart/cart.service';
import { ItemService } from 'src/item/item.service';
import { Item } from 'src/item/entities/item.entity';
import { PaginationQueryDto } from 'src/utils/paginateDto';
import { paginate } from 'src/utils/paginate';
import { observeNotification } from 'rxjs/internal/Notification';

@Injectable()
export class CartItemService {
  constructor(
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,
    @InjectRepository(Cart)
    private readonly CartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,
  ) {}
  async create(
    createCartItemDto: CreateCartItemDto,
    userId: number | undefined,
  ): Promise<CartItem> {
    const cart = await this.CartRepository.findOne({
      where: {
        user: {
          id: userId,
        },
      },
    });
    if (!cart) {
      throw new NotFoundException(
        `Cart with ID ${createCartItemDto.cartId} not found`,
      );
    }

    const item = await this.itemRepository.findOne({
      where: { id: createCartItemDto.itemId },
    });

    if (!item) {
      throw new NotFoundException(
        `Item with ID ${createCartItemDto.itemId} not found`,
      );
    }
    const existingCartItem = await this.cartItemRepository.findOne({
      where: {
        cart: { id: cart.id },
        item: { id: createCartItemDto.itemId },
      },
    });

    // if (existingCartItem) {
    //   existingCartItem.quantity += createCartItemDto.quantity;
    //   existingCartItem.subtotal =
    //     existingCartItem.quantity * Number(item.price);
    //   return await this.cartItemRepository.save(existingCartItem);
    // }

    const subtotal = createCartItemDto.quantity * Number(item.price);

    const result = this.cartItemRepository.create({
      quantity: createCartItemDto.quantity,

      subtotal,
      cart: cart,
      item,
    });

    return await this.cartItemRepository.save(result);
  }

  async findAll(
    paginationQueryDto: PaginationQueryDto,
    filters: any,
    userId: number | undefined,
    role: string,
  ): Promise<{ data: CartItem[]; pagination: any; total: any }> {
    let { page, limit, allData, sortBy, order } = paginationQueryDto;
    page = Number(page) || 1;
    limit = Number(limit) || 10;
    const sortField = sortBy || 'id';

    const sort: Record<string, 'ASC' | 'DESC'> = {
      [sortField]: order === 'asc' ? 'ASC' : 'DESC',
    };
    const cart = await this.CartRepository.findOne({
      where: {
        user: {
          id: userId,
        },
      },
    });
    if (!cart) {
      throw new NotFoundException(`Cart with ID  not found`);
    }
    if (role === 'user') {
      filters.cart = { id: cart.id };
      filters.deleted = false;
    }

    const cartItem = await this.cartItemRepository.find({
      where: {
        cart: {
          id: cart.id,
        },
      },
    });
    const cartItems = cartItem.filter((i) => {
      if (i.deleted === false) return i;
    });

    const t = cartItems.reduce((acc, curr) => {
      return acc + curr.subtotal;
    }, 0);
    const total = Number(t + 5);

    const { data, pagination } = await paginate<CartItem>(
      this.cartItemRepository,
      ['item', 'cart'],
      page,
      limit,
      allData,
      filters,
      sort,
    );
    return { data, pagination, total };
  }

  async findOne(id: number): Promise<CartItem | null> {
    const getOne = await this.cartItemRepository.findOne({
      where: { id },
      relations: ['item', 'cart'],
    });
    if (!getOne) {
      throw new NotFoundException(`the Cart-Item Not Found with ${id}`);
    }
    return getOne;
  }

  async update(
    id: number,
    updateCartItemDto: UpdateCartItemDto,
  ): Promise<CartItem | null> {
    const getOne = await this.cartItemRepository.findOne({
      where: { id },
      relations: ['item', 'cart'],
    });

    if (!getOne) {
      throw new NotFoundException(`Cart item not found with id ${id}`);
    }

    // تحديث item فقط إذا تم إرساله في الـ DTO
    let item: Item | null = getOne.item;

    if (updateCartItemDto.itemId !== undefined) {
      item = await this.itemRepository.findOne({
        where: { id: updateCartItemDto.itemId },
      });

      if (!item) {
        throw new NotFoundException(
          `Item not found with id ${updateCartItemDto.itemId}`,
        );
      }

      getOne.item = item;
    }

    // تحديث الكمية (إن وُجدت)
    if (updateCartItemDto.quantity !== undefined) {
      getOne.quantity = updateCartItemDto.quantity;
    }

    // إعادة حساب المجموع بناءً على السعر والكمية
    if (item && getOne.quantity !== undefined) {
      getOne.subtotal = getOne.quantity * Number(item.price);
    }

    // أو إذا تم إرسال total يدويًا
    if (updateCartItemDto.subtotal !== undefined) {
      getOne.subtotal = updateCartItemDto.subtotal;
    }

    return await this.cartItemRepository.save(getOne);
  }

  async remove(id: number): Promise<void> {
    const getOne = await this.cartItemRepository.findOne({
      where: { id },
      relations: ['item', 'cart'],
    });
    if (!getOne) {
      throw new NotFoundException(`the Cart-Item Not Found with ${id}`);
    }
    await this.cartItemRepository.delete(id);
  }
  async updateCartItemQuantity(
    updateCartItemDto: UpdateCartItemDto,
  ): Promise<CartItem | null> {
    const getOne = await this.cartItemRepository.findOne({
      where: {
        item: {
          id: updateCartItemDto?.itemId,
        },
      },
      relations: ['item', 'cart'],
    });
    if (!getOne) {
      throw new NotFoundException(`the Cart-Item Not Found with `);
    }
    if (getOne.quantity > 0) {
      getOne.quantity = Number(getOne.quantity - 1);
      getOne.subtotal = Number(getOne.item.price) * getOne.quantity;
    } else {
      throw new BadRequestException('the Quantity has been 0');
    }
    return await this.cartItemRepository.save(getOne);
  }
}
