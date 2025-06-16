import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Query,
  Put,
  ConsoleLogger,
  UseGuards,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { uploadImage } from 'src/utils/multer-options';
import { PaginationQueryDto } from 'src/utils/paginateDto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { AuthGuard } from '@nestjs/passport';
import { UserRole } from 'src/utils/types';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  @UseInterceptors(
    FileInterceptor('image', uploadImage('categories', 'category')),
  )
  async create(
    @Body() createCategoryDto: CreateCategoryDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const data = await this.categoryService.create(
      createCategoryDto,
      file?.filename,
    );
    return {
      message: 'Category created successfully',
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
    const { data, pagination } = await this.categoryService.findAll(
      paginationQueryDto,
      filters,
    );
    return {
      success: true,
      message: 'Categories fetched successfully',
      data,
      pagination,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    const result = await this.categoryService.findOne(id);
    return {
      message: 'Category fetched successfully',
      success: true,
      data: result,
    };
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  @UseInterceptors(
    FileInterceptor('image', uploadImage('categories', 'category')),
  )
  async update(
    @Param('id') id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const result = await this.categoryService.update(
      id,
      updateCategoryDto,
      file?.filename,
    );
    return {
      success: true,
      message: 'Category updated successfully',
      data: result,
    };
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  async remove(@Param('id') id: number) {
    await this.categoryService.remove(id);
    return {
      success: true,
      message: 'Category deleted successfully',
    };
  }
}
