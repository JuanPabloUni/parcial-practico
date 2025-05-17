/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';
import { BibliotecaService } from './biblioteca.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BibliotecaEntity } from './biblioteca.entity/biblioteca.entity';

@Module({
  providers: [BibliotecaService],
  imports: [TypeOrmModule.forFeature([BibliotecaEntity])],
})
export class BibliotecaModule {}
