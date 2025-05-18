/* src/biblioteca/biblioteca.controller.ts */
/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { BibliotecaDto } from './biblioteca.dto/biblioteca.dto';
import { BibliotecaEntity } from './biblioteca.entity/biblioteca.entity';
import { BibliotecaService } from './biblioteca.service';

@Controller('libraries')
@UseInterceptors(BusinessErrorsInterceptor)
export class BibliotecaController {
  constructor(private readonly bibliotecaService: BibliotecaService) {}

  @Get()
  async findAll() {
    return await this.bibliotecaService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.bibliotecaService.findOne(id);
  }

  @Post()
  async create(@Body() bibliotecaDto: BibliotecaDto) {
    const biblioteca: BibliotecaEntity = plainToInstance(BibliotecaEntity, bibliotecaDto);
    return await this.bibliotecaService.create(biblioteca);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() bibliotecaDto: BibliotecaDto) {
    const biblioteca: BibliotecaEntity = plainToInstance(BibliotecaEntity, bibliotecaDto);
    return await this.bibliotecaService.update(id, biblioteca);
  }

  @Delete(':id')
  @HttpCode(204)
  async delete(@Param('id') id: string) {
    return await this.bibliotecaService.delete(id);
  }
}