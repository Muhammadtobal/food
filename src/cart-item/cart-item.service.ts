import { Injectable, NotFoundException } from '@nestjs/common';
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
  async create(createCartItemDto: CreateCartItemDto,userId:number |undefined): Promise<CartItem > {
   
    const cart = await this.CartRepository.findOne({where:{user:{
      id:userId
    }}});
    if (!cart) {
      throw new NotFoundException(`Cart with ID ${createCartItemDto.cartId} not found`);
    }
  
    const item = await this.itemRepository.findOne({where:{id:createCartItemDto.itemId}});
    if (!item) {
      throw new NotFoundException(`Item with ID ${createCartItemDto.itemId} not found`);
    }
  

    const total = createCartItemDto.quantity * Number(item.price);
 
    const result = this.cartItemRepository.create({
      quantity: createCartItemDto.quantity,
      total,
      cart:cart, 
      item,
    });
  
    
    return await this.cartItemRepository.save(result);
  }
  

  async  findAll(paginationQueryDto:PaginationQueryDto,filters:any,userId:number | undefined) {
let { page, limit, allData, sortBy, order } = paginationQueryDto;
    page = Number(page) || 1;
    limit = Number(limit) || 10;
    const sortField = sortBy || 'id';

    const sort: Record<string, 'ASC' | 'DESC'> = {
      [sortField]: order === 'asc' ? 'ASC' : 'DESC',
    };
    const cart = await this.CartRepository.findOne({where:{user:{
      id:userId
    }}});
    if (!cart) {
      throw new NotFoundException(`Cart with ID  not found`);
    }
      
filters.cart={id:cart.id}
     
    const { data, pagination } = await paginate<CartItem>(
      this.cartItemRepository,
      ['item','cart'],
      page,
      limit,
      allData,
      filters,
      sort,
    );
   return {data,pagination}
  }

  async findOne(id: number) {
const getOne= await this.cartItemRepository.findOne({where:{id},relations:['item','cart']})
if(!getOne){
  throw new NotFoundException(`the Cart-Item Not Found with ${id}`)
}
return getOne
  }

  update(id: number, updateCartItemDto: UpdateCartItemDto) {
    return `This action updates a #${id} cartItem`;
  }

  remove(id: number) {
    return `This action removes a #${id} cartItem`;
  }
}
