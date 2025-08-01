import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
  Put,
} from '@nestjs/common';
import { CartItemService } from './cart-item.service';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { PaginationQueryDto } from 'src/utils/paginateDto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { UserRole } from 'src/utils/types';
import { Roles } from 'src/common/decorators/roles.decorator';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';

@Controller('cart-item')
export class CartItemController {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly cartItemService: CartItemService,
  ) {}
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.User)
  @Post()
  async create(@Body() createCartItemDto: CreateCartItemDto, @Request() req) {
    const userEmail = req.user?.email;
    const user = await this.userRepository.findOne({
      where: { email: userEmail },
    });
    const userId = user?.id;

    const data = await this.cartItemService.create(createCartItemDto, userId);
    return {
      message: 'Cart-Item created successfully',
      success: true,
      data: data,
    };
  }

  @Get()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.User)
  async findAll(
    @Query() paginationQueryDto: PaginationQueryDto,
    @Query() queryParams: any,
    @Request() req,
  ) {
    const { page, limit, allData, sortBy, order, ...filters } = queryParams;
    const userEmail = req.user?.email;
    const role = req.user.role;
    const user = await this.userRepository.findOne({
      where: { email: userEmail },
    });
    const userId = user?.id;

    const { data, pagination, total } = await this.cartItemService.findAll(
      paginationQueryDto,
      filters,
      userId,
      role,
    );
    return {
      success: true,
      message: 'Cart-Items fetched successfully',
      data,
      total,
      pagination,
    };
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.User)
  async findOne(@Param('id') id: number) {
    const result = await this.cartItemService.findOne(id);
    return {
      message: 'Cart-Item fetched successfully',
      success: true,
      data: result,
    };
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  async update(
    @Param('id') id: number,
    @Body() updateCartItemDto: UpdateCartItemDto,
  ) {
    const result = await this.cartItemService.update(id, updateCartItemDto);
    return {
      message: 'Cart-Item updated successfully',
      success: true,
      data: result,
    };
  }
  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.User)
  async remove(@Param('id') id: number) {
    await this.cartItemService.remove(+id);

    return {
      message: 'Cart-Item deleted successfully',
      success: true,
    };
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.User)
  async updateCartItemQuantity(
    @Param('id') id: number,
    @Body() updateCartItemDto: UpdateCartItemDto,
    @Request() req,
  ) {
    const userId = req.user?.userId;
    const result = await this.cartItemService.updateCartItemQuantity(
      id,
      userId,
    );
    return {
      message: 'Cart-Item updated successfully',
      success: true,
      data: result,
    };
  }
}
