import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, Query, Put } from '@nestjs/common';
import { ItemService } from './item.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { uploadImage } from 'src/utils/multer-options';
import { PaginationQueryDto } from 'src/utils/paginateDto';

@Controller('items')
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @Post()
    @UseInterceptors(FileInterceptor('image', uploadImage('items', 'item')))
  
  async create(@Body() createItemDto: CreateItemDto,@UploadedFile() file: Express.Multer.File) {
   

  const data=await  this.itemService.create(createItemDto,file?.filename);
  return{
    message:"Item created successfully",
    success:true,
    data:data
  }

  }

  @Get()
  async findAll(@Query() paginationQueryDto:PaginationQueryDto,
  @Query() queryParams: any) {
    const { page, limit, allData, sortBy, order, ...filters } = queryParams;
    const { data, pagination } = await this.itemService.findAll(paginationQueryDto, filters);
    return {
      success: true,
      message: 'item fetched successfully',
      data,
      pagination,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    const result = await this.itemService.findOne(id)
    return{
     message:"Item fetched successfully",
     success:true,
     data:result
   }
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('image', uploadImage('items', 'item')))

 async update(@Param('id') id: number, @Body() updateItemDto: UpdateItemDto,
 @UploadedFile() file: Express.Multer.File,) {
  const result = await this.itemService.update(id, updateItemDto, file?.filename);
  return {
    success: true,
    message: 'Item updated successfully',
    data: result,
  };
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
  
    await this.itemService.remove(id);
    return {
      success: true,
      message: 'Item deleted successfully',
    };
  }
}
