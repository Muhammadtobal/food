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
  UseGuards,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { PaginationQueryDto } from 'src/utils/paginateDto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/utils/types';

@Controller('carts')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.User)
  async create(@Body() createCartDto: CreateCartDto) {
    const data = await this.cartService.create(createCartDto);

    return {
      message: 'Cart created successfully',
      success: true,
      data: data,
    };
  }

  @Get()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
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
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.User)
  async findOne(@Param('id') id: number) {
    const data = await this.cartService.findOne(id);
    return {
      success: true,
      message: 'Carts fetched successfully',
      data: data,
    };
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
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
