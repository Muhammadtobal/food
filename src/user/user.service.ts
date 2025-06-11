import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationQueryDto } from 'src/utils/paginateDto';
import { User } from './entities/user.entity';
import { paginate } from 'src/utils/paginate';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  async findAll(paginationQueryDto: PaginationQueryDto, filters: any) {
    let { page, limit, allData, sortBy, order } = paginationQueryDto;
    page = Number(page) || 1;
    limit = Number(limit) || 10;
    const sortField = sortBy || 'id';

    const sort: Record<string, 'ASC' | 'DESC'> = {
      [sortField]: order === 'asc' ? 'ASC' : 'DESC',
    };

    const { data, pagination } = await paginate<User>(
      this.userRepository,
      [],
      page,
      limit,
      allData,
      filters,
      sort,
    );
    const usersWithoutPasswords = data.map(({ password, ...rest }) => rest);

    return { data: usersWithoutPasswords, pagination };
  }

  async findOne(id: number): Promise<Omit<User, 'password'> | null> {
    const getOne = await this.userRepository.findOne({ where: { id } });
    if (!getOne) {
      throw new NotFoundException(`the user not found with this id ${id}`);
    }
    return getOne;
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<Omit<User, 'password'> | null> {
    const getOne = await this.userRepository.findOne({ where: { id } });
    if (!getOne) {
      throw new NotFoundException(`the user not found with this id ${id}`);
    }
    const hashedPassword = await bcrypt.hash(updateUserDto.password, 10);
    updateUserDto.password = hashedPassword;
    const updateUser = Object.assign(getOne, updateUserDto);
    const { password, ...userWithoutPassword } = updateUser;

    return await this.userRepository.save(userWithoutPassword);
  }

  async remove(id: number): Promise<void> {
    const getOne = await this.userRepository.findOne({ where: { id } });
    if (!getOne) {
      throw new NotFoundException(`the user not found with this id ${id}`);
    }
    await this.userRepository.delete(id);
  }
}
