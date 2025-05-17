/* src/libro/libro.service.ts */
/* eslint-disable prettier/prettier */

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { LibroEntity } from './libro.entity/libro.entity';

@Injectable()
export class LibroService {
  constructor(
    @InjectRepository(LibroEntity)
    private readonly libroRepository: Repository<LibroEntity>,
  ) {}

  async findAll(): Promise<LibroEntity[]> {
    return await this.libroRepository.find({ relations: ['bibliotecas'] });
  }

  async findOne(id: string): Promise<LibroEntity> {
    const libro = await this.libroRepository.findOne({
      where: { id },
      relations: ['bibliotecas'],
    });
    if (!libro)
      throw new BusinessLogicException(
        'El libro con el id dado no fue encontrado',
        BusinessError.NOT_FOUND,
      );
    return libro;
  }

  async create(libro: LibroEntity): Promise<LibroEntity> {
    // Validar fecha de publicación: no puede ser futura
    if (libro.fechaPublicacion > new Date()) {
      throw new BusinessLogicException(
        'La fecha de publicación no puede ser futura',
        BusinessError.BAD_REQUEST,
      );
    }
    return await this.libroRepository.save(libro);
  }

  async update(id: string, libro: LibroEntity): Promise<LibroEntity> {
    const persisted = await this.libroRepository.findOne({ where: { id } });
    if (!persisted)
      throw new BusinessLogicException(
        'El libro con el id dado no fue encontrado',
        BusinessError.NOT_FOUND,
      );

    // Validar fecha de publicación
    if (libro.fechaPublicacion > new Date()) {
      throw new BusinessLogicException(
        'La fecha de publicación no puede ser futura',
        BusinessError.BAD_REQUEST,
      );
    }
    libro.id = id;
    return await this.libroRepository.save(libro);
  }

  async delete(id: string) {
    const libro = await this.libroRepository.findOne({ where: { id } });
    if (!libro)
      throw new BusinessLogicException(
        'El libro con el id dado no fue encontrado',
        BusinessError.NOT_FOUND,
      );
    await this.libroRepository.remove(libro);
  }
}