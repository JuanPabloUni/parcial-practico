/* src/biblioteca-libro/biblioteca-libro.service.spec.ts */
/* eslint-disable prettier/prettier */

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { BibliotecaLibroService } from './biblioteca-libro.service';
import { BibliotecaEntity } from '../biblioteca/biblioteca.entity/biblioteca.entity';
import { LibroEntity } from '../libro/libro.entity/libro.entity';
import { faker } from '@faker-js/faker';

describe('BibliotecaLibroService', () => {
  let service: BibliotecaLibroService;
  let bibliotecaRepository: Repository<BibliotecaEntity>;
  let libroRepository: Repository<LibroEntity>;
  let biblioteca: BibliotecaEntity;
  let librosList: LibroEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [BibliotecaLibroService],
    }).compile();

    service = module.get<BibliotecaLibroService>(BibliotecaLibroService);
    bibliotecaRepository = module.get<Repository<BibliotecaEntity>>(getRepositoryToken(BibliotecaEntity));
    libroRepository = module.get<Repository<LibroEntity>>(getRepositoryToken(LibroEntity));

    await seedDatabase();
  });

  const seedDatabase = async () => {
    await libroRepository.clear();
    await bibliotecaRepository.clear();

    librosList = [];
    for (let i = 0; i < 5; i++) {
      const libro: LibroEntity = await libroRepository.save({
        titulo: faker.lorem.words(3),
        autor: faker.person.fullName(),
        fechaPublicacion: faker.date.past(),
        isbn: faker.number.int({ min: 1000000000, max: 9999999999 }).toString(),
        bibliotecas: [],
      });
      librosList.push(libro);
    }

    biblioteca = await bibliotecaRepository.save({
      nombre: faker.company.name(),
      direccion: faker.location.streetAddress(),
      ciudad: faker.location.city(),
      horaApertura: '08:00:00',
      horaCierre: '17:00:00',
      libros: librosList,
    });
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addBookToLibrary should add a book to a library', async () => {
    const newLibro: LibroEntity = await libroRepository.save({
      titulo: faker.lorem.words(2),
      autor: faker.person.fullName(),
      fechaPublicacion: faker.date.past(),
      isbn: faker.number.int({ min: 1000000000, max: 9999999999 }).toString(),
      bibliotecas: [],
    });

    const newBiblioteca: BibliotecaEntity = await bibliotecaRepository.save({
      nombre: faker.company.name(),
      direccion: faker.location.streetAddress(),
      ciudad: faker.location.city(),
      horaApertura: '09:00:00',
      horaCierre: '18:00:00',
      libros: [],
    });

    const result = await service.addBookToLibrary(newBiblioteca.id, newLibro.id);
    expect(result.libros.length).toBe(1);
    expect(result.libros[0]).not.toBeNull();
    expect(result.libros[0].titulo).toBe(newLibro.titulo);
    expect(result.libros[0].autor).toBe(newLibro.autor);
    expect(result.libros[0].isbn).toBe(newLibro.isbn);
  });

  it('addBookToLibrary should throw exception for invalid book', async () => {
    await expect(() => service.addBookToLibrary(biblioteca.id, '0'))
      .rejects.toHaveProperty('message', 'El libro con el id dado no fue encontrado');
  });

  it('addBookToLibrary should throw exception for invalid library', async () => {
    const libro = librosList[0];
    await expect(() => service.addBookToLibrary('0', libro.id))
      .rejects.toHaveProperty('message', 'La biblioteca con el id dado no fue encontrada');
  });

  it('findBooksFromLibrary should return books by library', async () => {
    const books = await service.findBooksFromLibrary(biblioteca.id);
    expect(books.length).toBe(5);
  });

  it('findBooksFromLibrary should throw exception for invalid library', async () => {
    await expect(() => service.findBooksFromLibrary('0'))
      .rejects.toHaveProperty('message', 'La biblioteca con el id dado no fue encontrada');
  });

  it('findBookFromLibrary should return a book from library', async () => {
    const libro = librosList[0];
    const stored = await service.findBookFromLibrary(biblioteca.id, libro.id);
    expect(stored).not.toBeNull();
    expect(stored.titulo).toBe(libro.titulo);
  });

  it('findBookFromLibrary should throw exception for invalid book', async () => {
    await expect(() => service.findBookFromLibrary(biblioteca.id, '0'))
      .rejects.toHaveProperty('message', 'El libro con el id dado no fue encontrado');
  });

  it('findBookFromLibrary should throw exception for invalid library', async () => {
    const libro = librosList[0];
    await expect(() => service.findBookFromLibrary('0', libro.id))
      .rejects.toHaveProperty('message', 'La biblioteca con el id dado no fue encontrada');
  });

  it('findBookFromLibrary should throw exception if book not associated', async () => {
    const newLibro: LibroEntity = await libroRepository.save({
      titulo: faker.lorem.words(2),
      autor: faker.person.fullName(),
      fechaPublicacion: faker.date.past(),
      isbn: faker.number.int({ min: 1000000000, max: 9999999999 }).toString(),
      bibliotecas: [],
    });
    await expect(() => service.findBookFromLibrary(biblioteca.id, newLibro.id))
      .rejects.toHaveProperty('message', 'El libro no está asociado a la biblioteca');
  });

  it('updateBooksFromLibrary should update books list for a library', async () => {
    const newLibro: LibroEntity = librosList[0];
    const updated = await service.updateBooksFromLibrary(biblioteca.id, [newLibro]);
    expect(updated.libros.length).toBe(1);
    expect(updated.libros[0].id).toBe(newLibro.id);
  });

  it('updateBooksFromLibrary should throw exception for invalid library', async () => {
    const libro = librosList[0];
    await expect(() => service.updateBooksFromLibrary('0', [libro]))
      .rejects.toHaveProperty('message', 'La biblioteca con el id dado no fue encontrada');
  });

  it('updateBooksFromLibrary should throw exception for invalid book', async () => {
    const libro = {...librosList[0], id: '0'};
    await expect(() => service.updateBooksFromLibrary(biblioteca.id, [libro]))
      .rejects.toHaveProperty('message', `El libro con id ${libro.id} no fue encontrado`);
  });

  it('deleteBookFromLibrary should remove a book from library', async () => {
    const libro = librosList[0];
    await service.deleteBookFromLibrary(biblioteca.id, libro.id);
    const stored = await bibliotecaRepository.findOne({ where: { id: biblioteca.id }, relations: ['libros'] });
    const deleted = stored.libros.find(b => b.id === libro.id);
    expect(deleted).toBeUndefined();
  });

  it('deleteBookFromLibrary should throw exception for invalid book', async () => {
    await expect(() => service.deleteBookFromLibrary(biblioteca.id, '0'))
      .rejects.toHaveProperty('message', 'El libro con el id dado no fue encontrado');
  });

  it('deleteBookFromLibrary should throw exception for invalid library', async () => {
    const libro = librosList[0];
    await expect(() => service.deleteBookFromLibrary('0', libro.id))
      .rejects.toHaveProperty('message', 'La biblioteca con el id dado no fue encontrada');
  });

  it('deleteBookFromLibrary should throw exception for non-associated book', async () => {
    const newLibro: LibroEntity = await libroRepository.save({
      titulo: faker.lorem.words(2),
      autor: faker.person.fullName(),
      fechaPublicacion: faker.date.past(),
      isbn: faker.number.int({ min: 1000000000, max: 9999999999 }).toString(),
      bibliotecas: [],
    });
    await expect(() => service.deleteBookFromLibrary(biblioteca.id, newLibro.id))
      .rejects.toHaveProperty('message', 'El libro no está asociado a la biblioteca');
  });
});