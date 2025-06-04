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
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { PaginationQueryDto } from 'src/utils/paginateDto';

@Controller('carts')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  async create(@Body() createCartDto: CreateCartDto) {
    const data = await this.cartService.create(createCartDto);
    return {
      message: 'Cart created successfully',
      success: true,
      data: data,
    };
  }

  @Get()
  async findAll(
    @Query() paginationQueryDto: PaginationQueryDto,
    @Query() queryParams: any,
  ) {
    const { page, limit, allData, sortBy, order, ...filters } = queryParams;
    const { data, pagination } = await this.cartService.findAll(
      paginationQueryDto,
      filters,
    );
    return {
      success: true,
      message: 'Carts fetched successfully',
      data,
      pagination,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    const data = await this.cartService.findOne(id);
    return {
      success: true,
      message: 'Carts fetched successfully',
      data: data,
    };
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() updateCartDto: UpdateCartDto) {
    const data = await this.cartService.update(id, updateCartDto);
    return {
      success: true,
      message: 'Carts Updated successfully',
      data: data,
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    await this.cartService.remove(id);
    return {
      success: true,
      message: 'Carts deleted successfully',
    };
  }
}
