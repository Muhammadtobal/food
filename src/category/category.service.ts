import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationQueryDto } from 'src/utils/paginateDto';
import { paginate } from 'src/utils/paginate';
import { join } from 'path';
import { unlink } from 'fs/promises';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}
  async create(createCategoryDto: CreateCategoryDto, imageFile: string | null) {
    const newCategory =  this.categoryRepository.create({
      ...createCategoryDto,
      image: imageFile ?? undefined ,
    });
    return await this.categoryRepository.save(newCategory);
  }

  async findAll(paginationQueryDto: PaginationQueryDto, filters: any) {
    let { page, limit, allData, sortBy, order } = paginationQueryDto;
    page = Number(page) || 1;
    limit = Number(limit) || 10;
    const sortField = sortBy || 'id';

    const sort: Record<string, 'ASC' | 'DESC'> = {
      [sortField]: order === 'asc' ? 'ASC' : 'DESC',
    };

    const { data, pagination } = await paginate<Category>(
      this.categoryRepository,
      ['items'],
      page,
      limit,
      allData,
      filters,
      sort,
    );

    return { data, pagination };
  }

  async findOne(id: number) {
    const category = await this.categoryRepository.findOne({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException(`Category not found with ID: ${id}`);
    }

    return category;
  }

  
  async update(id: number, updateCategoryDto: UpdateCategoryDto , imageFilename?: string): Promise<Category> {
    const category = await this.categoryRepository.findOne({ where: { id } });

    if (!category) {
      throw new NotFoundException(`Category not found with ID: ${id}`);
    }
    


    if (imageFilename) {
      const oldImage = category.image;
  
      if (oldImage) {  
        const imagePath = join(__dirname, '..', '..', 'uploads', 'categories', oldImage);
  
        try {
          await unlink(imagePath);
        } catch (err) {
          console.warn(`Failed to delete old image: ${imagePath}`, err);
        }
      }
  
      updateCategoryDto.image = imageFilename;
    }else{
      updateCategoryDto.image = category.image;
    }

    const updatedCategory = Object.assign(category, updateCategoryDto);
    return await this.categoryRepository.save(updatedCategory);
  }


  async remove(id: number): Promise<void> {
    const category = await this.categoryRepository.findOneBy({ id });

    if (!category) {
      throw new NotFoundException(`Category not found with ID: ${id}`);
    }

    if (category.image) {
      const imagePath = join(__dirname, '..', '..', 'uploads', 'categories', category.image);

      try {
        await unlink(imagePath);
      } catch (error) {
        console.warn(`Failed to delete image: ${imagePath}`, error);
      }
    }

    await this.categoryRepository.delete(id);
  }
}