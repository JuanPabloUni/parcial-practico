/* src/libro/libro.service.spec.ts */
/* eslint-disable prettier/prettier */

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { LibroEntity } from './libro.entity/libro.entity';
import { LibroService } from './libro.service';
import { faker } from '@faker-js/faker';

describe('LibroService', () => {
  let service: LibroService;
  let repository: Repository<LibroEntity>;
  let librosList: LibroEntity[] = [];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [LibroService],
    }).compile();

    service = module.get<LibroService>(LibroService);
    repository = module.get<Repository<LibroEntity>>(getRepositoryToken(LibroEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    await repository.clear();
    librosList = [];
    for (let i = 0; i < 5; i++) {
      const book = await repository.save({
        titulo: faker.lorem.words(3),
        autor: faker.person.fullName(),
        fechaPublicacion: faker.date.past(),
        isbn: faker.number.int({ min: 1000000000, max: 9999999999 }).toString(),
        bibliotecas: [],
      });
      librosList.push(book);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all libros', async () => {
    const all = await service.findAll();
    expect(all).not.toBeNull();
    expect(all).toHaveLength(librosList.length);
  });

  it('findOne should return a libro by id', async () => {
    const stored = librosList[0];
    const book = await service.findOne(stored.id);
    expect(book).not.toBeNull();
    expect(book.titulo).toEqual(stored.titulo);
  });

  it('findOne should throw exception for invalid id', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty(
      'message',
      'El libro con el id dado no fue encontrado',
    );
  });

  it('create should return a new libro', async () => {
    const newBook: LibroEntity = {
      id: '',
      titulo: faker.lorem.words(2),
      autor: faker.person.fullName(),
      fechaPublicacion: new Date(),
      isbn: faker.number.int({ min: 1000000000, max: 9999999999 }).toString(),
      bibliotecas: [],
    };
    const created = await service.create(newBook);
    expect(created).not.toBeNull();

    const stored = await repository.findOne({ where: { id: created.id } });
    expect(stored).not.toBeNull();
    expect(stored.titulo).toEqual(created.titulo);
  });

  it('create should throw exception if fechaPublicacion is future', async () => {
    const future = new Date();
    future.setFullYear(future.getFullYear() + 1);
    const invalidBook: LibroEntity = {
      id: '',
      titulo: faker.lorem.words(2),
      autor: faker.person.fullName(),
      fechaPublicacion: future,
      isbn: faker.number.int({ min: 1000000000, max: 9999999999 }).toString(),
      bibliotecas: [],
    };
    await expect(() => service.create(invalidBook)).rejects.toHaveProperty(
      'message',
      'La fecha de publicación no puede ser futura',
    );
  });

  it('update should modify a libro', async () => {
    const book = librosList[0];
    book.titulo = 'Titulo Actualizado';
    book.fechaPublicacion = new Date();
    const updated = await service.update(book.id, book);
    expect(updated).not.toBeNull();
    expect(updated.titulo).toEqual('Titulo Actualizado');
  });

  it('update should throw exception for invalid id', async () => {
    const book = librosList[0];
    await expect(() => service.update('0', book)).rejects.toHaveProperty(
      'message',
      'El libro con el id dado no fue encontrado',
    );
  });

  it('update should throw exception if fechaPublicacion is future', async () => {
    const book = librosList[1];
    const future = new Date(); future.setFullYear(future.getFullYear() + 1);
    book.fechaPublicacion = future;
    await expect(() => service.update(book.id, book)).rejects.toHaveProperty(
      'message',
      'La fecha de publicación no puede ser futura',
    );
  });

  it('delete should remove a libro', async () => {
    const book = librosList[0];
    await service.delete(book.id);
    const deleted = await repository.findOne({ where: { id: book.id } });
    expect(deleted).toBeNull();
  });

  it('delete should throw exception for invalid id', async () => {
    await expect(() => service.delete('0')).rejects.toHaveProperty(
      'message',
      'El libro con el id dado no fue encontrado',
    );
  });
});