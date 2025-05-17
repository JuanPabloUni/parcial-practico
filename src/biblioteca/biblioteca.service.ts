/* src/biblioteca/biblioteca.service.ts */
/* eslint-disable prettier/prettier */

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { BibliotecaEntity } from './biblioteca.entity/biblioteca.entity';

@Injectable()
export class BibliotecaService {
  constructor(
    @InjectRepository(BibliotecaEntity)
    private readonly bibliotecaRepository: Repository<BibliotecaEntity>,
  ) {}

  async findAll(): Promise<BibliotecaEntity[]> {
    return await this.bibliotecaRepository.find({ relations: ['libros'] });
  }

  async findOne(id: string): Promise<BibliotecaEntity> {
    const biblioteca = await this.bibliotecaRepository.findOne({
      where: { id },
      relations: ['libros'],
    });
    if (!biblioteca)
      throw new BusinessLogicException(
        'La biblioteca con el id dado no fue encontrada',
        BusinessError.NOT_FOUND,
      );
    return biblioteca;
  }

  async create(biblioteca: BibliotecaEntity): Promise<BibliotecaEntity> {
    // Validar horario: horaApertura debe ser menor a horaCierre
    if (biblioteca.horaApertura >= biblioteca.horaCierre) {
      throw new BusinessLogicException(
        'La hora de apertura debe ser menor a la de cierre',
        BusinessError.BAD_REQUEST,
      );
    }
    return await this.bibliotecaRepository.save(biblioteca);
  }

  async update(
    id: string,
    biblioteca: BibliotecaEntity,
  ): Promise<BibliotecaEntity> {
    const persisted = await this.bibliotecaRepository.findOne({ where: { id } });
    if (!persisted)
      throw new BusinessLogicException(
        'La biblioteca con el id dado no fue encontrada',
        BusinessError.NOT_FOUND,
      );

    // Validar horario
    if (biblioteca.horaApertura >= biblioteca.horaCierre) {
      throw new BusinessLogicException(
        'La hora de apertura debe ser menor a la de cierre',
        BusinessError.BAD_REQUEST,
      );
    }
    biblioteca.id = id;
    return await this.bibliotecaRepository.save(biblioteca);
  }

  async delete(id: string) {
    const biblioteca = await this.bibliotecaRepository.findOne({ where: { id } });
    if (!biblioteca)
      throw new BusinessLogicException(
        'La biblioteca con el id dado no fue encontrada',
        BusinessError.NOT_FOUND,
      );
    await this.bibliotecaRepository.remove(biblioteca);
  }
}