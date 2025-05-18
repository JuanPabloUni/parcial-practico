/* src/biblioteca-libro/biblioteca-libro.module.ts */
/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BibliotecaEntity } from '../biblioteca/biblioteca.entity/biblioteca.entity';
import { LibroEntity } from '../libro/libro.entity/libro.entity';
import { BibliotecaLibroService } from './biblioteca-libro.service';
import { BibliotecaLibroController } from './biblioteca-libro.controller';

@Module({
  imports: [TypeOrmModule.forFeature([BibliotecaEntity, LibroEntity])],
  providers: [BibliotecaLibroService],
  exports: [BibliotecaLibroService],
  controllers: [BibliotecaLibroController],
})
export class BibliotecaLibroModule {}