/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';
import { LibroService } from './libro.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LibroEntity } from './libro.entity/libro.entity';

@Module({
  providers: [LibroService],
  imports: [TypeOrmModule.forFeature([LibroEntity])],
})
export class LibroModule {}
