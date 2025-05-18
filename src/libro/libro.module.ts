/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';
import { LibroService } from './libro.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LibroEntity } from './libro.entity/libro.entity';
import { LibroController } from './libro.controller';

@Module({
  providers: [LibroService],
  imports: [TypeOrmModule.forFeature([LibroEntity])],
  controllers: [LibroController],
})
export class LibroModule {}
