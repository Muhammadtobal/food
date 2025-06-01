import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Item } from './entities/item.entity';
import { Repository } from 'typeorm';
import { PaginationQueryDto } from 'src/utils/paginateDto';
import { paginate } from 'src/utils/paginate';
import { join } from 'path';
import { unlink } from 'fs/promises';

@Injectable()
export class ItemService {
  constructor(
   @InjectRepository(Item)
       private itemRepository: Repository<Item>,

  ){}
  async create(createItemDto: CreateItemDto,imageFile:string) {
    if(imageFile === null){
      throw new BadRequestException("image null")
    }
    const result= await this.itemRepository.create({
      ...createItemDto,
      image:imageFile
    })
    return await this.itemRepository.save(result)
  }

  async findAll(paginationQueryDto: PaginationQueryDto, filters: any) {
    let { page, limit, allData, sortBy, order } = paginationQueryDto;
       page = Number(page) || 1;
       limit = Number(limit) || 10;
       const sortField = sortBy || 'id';
   
       const sort: Record<string, 'ASC' | 'DESC'> = {
         [sortField]: order === 'asc' ? 'ASC' : 'DESC',
       };
   
       const { data, pagination } = await paginate<Item>(
         this.itemRepository,
         ['category'],
         page,
         limit,
         allData,
         filters,
         sort,
       );
   
       
    const host = process.env.APP_URL || 'http://localhost';
    const port = process.env.PORT || 3000;
  
    const updatedData = data.map(item => ({
      ...item,
      image: item.image
        ? `${host}:${port}/uploads/items/${item.image}`
        : null,
    }));
  
    return { data: updatedData, pagination };
  }

 async findOne(id: number) {
     const item = await this.itemRepository.findOne({
        where: { id },
      });
  
      if (!item) {
        throw new NotFoundException(`Item not found with ID: ${id}`);
      }
  
      const host = process.env.APP_URL || 'http://localhost';
      const port = process.env.PORT || 3000;
      if (item.image) {
        item.image = `${host}:${port}/uploads/items/${item.image}`;
      }
      return item;
  }

  async update(id: number, updateItemDto: UpdateItemDto,imageFilename:string) {
    const item = await this.itemRepository.findOne({ where: { id } });
  
      if (!item) {
        throw new NotFoundException(`Category not found with ID: ${id}`);
      }
      
  
  
      if (imageFilename) {
        const oldImage = item.image;
        const imagePath = join(__dirname, '..', '..', 'uploads', 'items', oldImage);
  
        if (oldImage) {
          try {
            await unlink(imagePath);
          } catch (err) {
            console.warn(`Failed to delete old image: ${imagePath}`, err);
          }
        }
  
        updateItemDto.image = imageFilename;
      }else{
        updateItemDto.image = item.image;
      }
  
      const updatedItem = Object.assign(item, updateItemDto);
      return await this.itemRepository.save(updatedItem);
  }

  async remove(id: number): Promise<void> {
    const item = await this.itemRepository.findOneBy({ id });

    if (!item) {
      throw new NotFoundException(`item not found with ID: ${id}`);
    }

    if (item.image) {
      const imagePath = join(__dirname, '..', '..', 'uploads', 'items', item.image);

      try {
        await unlink(imagePath);
      } catch (error) {
        console.warn(`Failed to delete image: ${imagePath}`, error);
      }
    }

    await this.itemRepository.delete(id);
  }
}
