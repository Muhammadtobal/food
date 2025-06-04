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
  Request
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
    private readonly userRepository:Repository<User>,
    private readonly cartItemService: CartItemService) {}
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN,UserRole.User)
  @Post()
  
  async create(@Body() createCartItemDto: CreateCartItemDto, @Request() req) {
    const userEmail= req.user?.email
    const user= await this.userRepository.findOne({where:{email:userEmail
    }})
    const userId=user?.id
    console.log(userId)
    const data = await this.cartItemService.create(createCartItemDto,userId);
    return {
      message: 'Cart-Item created successfully',
      success: true,
      data: data,
    };
  }

  @Get()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN,UserRole.User)
 async findAll(
  @Query() paginationQueryDto:PaginationQueryDto,@Query() queryParams :any, @Request() req) {
    const { page, limit, allData, sortBy, order, ...filters } = queryParams;
    const userEmail= req.user?.email
    const user= await this.userRepository.findOne({where:{email:userEmail
    }})
    const userId=user?.id
    console.log(userId)
    const { data, pagination } = await this.cartItemService.findAll(paginationQueryDto, filters,userId);
    return {
      success: true,
      message: 'Cart-Items fetched successfully',
      data,
      pagination,
    };
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN,UserRole.User)
 async findOne(@Param('id') id: number) {
  const result = await this.cartItemService.findOne(id)
  return{
   message:"Cart-Item fetched successfully",
   success:true,
   data:result
 }
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN,UserRole.User)
  update(
    @Param('id') id: string,
    @Body() updateCartItemDto: UpdateCartItemDto,
  ) {
    return this.cartItemService.update(+id, updateCartItemDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN,UserRole.User)
  remove(@Param('id') id: string) {
    return this.cartItemService.remove(+id);
  }
}
