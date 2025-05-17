/* src/biblioteca-libro/biblioteca-libro.service.ts */
/* eslint-disable prettier/prettier */

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BibliotecaEntity } from '../biblioteca/biblioteca.entity/biblioteca.entity';
import { LibroEntity } from '../libro/libro.entity/libro.entity';
import { BusinessLogicException, BusinessError } from '../shared/errors/business-errors';

@Injectable()
export class BibliotecaLibroService {
  constructor(
    @InjectRepository(BibliotecaEntity)
    private readonly bibliotecaRepository: Repository<BibliotecaEntity>,

    @InjectRepository(LibroEntity)
    private readonly libroRepository: Repository<LibroEntity>,
  ) {}

  async addBookToLibrary(bibliotecaId: string, libroId: string): Promise<BibliotecaEntity> {
    const libro = await this.libroRepository.findOne({ where: { id: libroId } });
    if (!libro)
      throw new BusinessLogicException(
        'El libro con el id dado no fue encontrado',
        BusinessError.NOT_FOUND,
      );

    const biblioteca = await this.bibliotecaRepository.findOne({
      where: { id: bibliotecaId },
      relations: ['libros'],
    });
    if (!biblioteca)
      throw new BusinessLogicException(
        'La biblioteca con el id dado no fue encontrada',
        BusinessError.NOT_FOUND,
      );

    biblioteca.libros = [...biblioteca.libros, libro];
    return await this.bibliotecaRepository.save(biblioteca);
  }

  async findBooksFromLibrary(bibliotecaId: string): Promise<LibroEntity[]> {
    const biblioteca = await this.bibliotecaRepository.findOne({
      where: { id: bibliotecaId },
      relations: ['libros'],
    });
    if (!biblioteca)
      throw new BusinessLogicException(
        'La biblioteca con el id dado no fue encontrada',
        BusinessError.NOT_FOUND,
      );

    return biblioteca.libros;
  }

  async findBookFromLibrary(bibliotecaId: string, libroId: string): Promise<LibroEntity> {
    const libro = await this.libroRepository.findOne({ where: { id: libroId } });
    if (!libro)
      throw new BusinessLogicException(
        'El libro con el id dado no fue encontrado',
        BusinessError.NOT_FOUND,
      );

    const biblioteca = await this.bibliotecaRepository.findOne({
      where: { id: bibliotecaId },
      relations: ['libros'],
    });
    if (!biblioteca)
      throw new BusinessLogicException(
        'La biblioteca con el id dado no fue encontrada',
        BusinessError.NOT_FOUND,
      );

    const libroEnBiblioteca = biblioteca.libros.find(b => b.id === libro.id);
    if (!libroEnBiblioteca)
      throw new BusinessLogicException(
        'El libro no está asociado a la biblioteca',
        BusinessError.PRECONDITION_FAILED,
      );

    return libroEnBiblioteca;
  }

  async updateBooksFromLibrary(
    bibliotecaId: string,
    libros: LibroEntity[],
  ): Promise<BibliotecaEntity> {
    const biblioteca = await this.bibliotecaRepository.findOne({
      where: { id: bibliotecaId },
      relations: ['libros'],
    });
    if (!biblioteca)
      throw new BusinessLogicException(
        'La biblioteca con el id dado no fue encontrada',
        BusinessError.NOT_FOUND,
      );

    // Validar existencia de cada libro
    for (const l of libros) {
      const exists = await this.libroRepository.findOne({ where: { id: l.id } });
      if (!exists)
        throw new BusinessLogicException(
          `El libro con id ${l.id} no fue encontrado`,
          BusinessError.NOT_FOUND,
        );
    }

    biblioteca.libros = libros;
    return await this.bibliotecaRepository.save(biblioteca);
  }

  async deleteBookFromLibrary(
    bibliotecaId: string,
    libroId: string,
  ): Promise<void> {
    const libro = await this.libroRepository.findOne({ where: { id: libroId } });
    if (!libro)
      throw new BusinessLogicException(
        'El libro con el id dado no fue encontrado',
        BusinessError.NOT_FOUND,
      );

    const biblioteca = await this.bibliotecaRepository.findOne({
      where: { id: bibliotecaId },
      relations: ['libros'],
    });
    if (!biblioteca)
      throw new BusinessLogicException(
        'La biblioteca con el id dado no fue encontrada',
        BusinessError.NOT_FOUND,
      );

    const libroEnBiblioteca = biblioteca.libros.find(b => b.id === libro.id);
    if (!libroEnBiblioteca)
      throw new BusinessLogicException(
        'El libro no está asociado a la biblioteca',
        BusinessError.PRECONDITION_FAILED,
      );

    biblioteca.libros = biblioteca.libros.filter(b => b.id !== libro.id);
    await this.bibliotecaRepository.save(biblioteca);
  }
}