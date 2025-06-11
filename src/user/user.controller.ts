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
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationQueryDto } from 'src/utils/paginateDto';
import { filter } from 'rxjs';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  async findAll(
    @Query() paginationQueryDto: PaginationQueryDto,
    @Query() queryParams: any,
  ) {
    const { page, limit, allData, sortBy, order, ...filters } = queryParams;
    const { data, pagination } = await this.userService.findAll(
      paginationQueryDto,
      filters,
    );
    return {
      message: 'Users fetched successfully',
      success: true,

      data: data,
      pagination,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
 const data = await this.userService.findOne(id)
 return {
  message: 'Users fetched successfully',
  success: true,
  data:data
 }
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
   const data= await this.userService.update(id,updateUserDto)
   return {
    message: 'Users updated successfully',
    success: true,
    data:data
   } 
  }

  @Delete(':id')
 async remove(@Param('id') id: number) {
   await this.userService.remove(id)
   return {
    message: 'Users deleted successfully',
    success: true,

   } 
  }
}
