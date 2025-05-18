/* src/libro/libro.controller.ts */
/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { LibroDto } from './libro.dto/libro.dto';
import { LibroEntity } from './libro.entity/libro.entity';
import { LibroService } from './libro.service';

@Controller('books')
@UseInterceptors(BusinessErrorsInterceptor)
export class LibroController {
  constructor(private readonly libroService: LibroService) {}

  @Get()
  async findAll() {
    return await this.libroService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.libroService.findOne(id);
  }

  @Post()
  async create(@Body() libroDto: LibroDto) {
    const libro: LibroEntity = plainToInstance(LibroEntity, libroDto);
    return await this.libroService.create(libro);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() libroDto: LibroDto) {
    const libro: LibroEntity = plainToInstance(LibroEntity, libroDto);
    return await this.libroService.update(id, libro);
  }

  @Delete(':id')
  @HttpCode(204)
  async delete(@Param('id') id: string) {
    return await this.libroService.delete(id);
  }
}