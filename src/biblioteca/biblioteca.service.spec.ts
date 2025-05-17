/* src/biblioteca/biblioteca.service.spec.ts */
/* eslint-disable prettier/prettier */

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { BibliotecaEntity } from './biblioteca.entity/biblioteca.entity';
import { BibliotecaService } from './biblioteca.service';
import { faker } from '@faker-js/faker';

describe('BibliotecaService', () => {
  let service: BibliotecaService;
  let repository: Repository<BibliotecaEntity>;
  let bibliotecasList: BibliotecaEntity[] = [];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [BibliotecaService],
    }).compile();

    service = module.get<BibliotecaService>(BibliotecaService);
    repository = module.get<Repository<BibliotecaEntity>>(getRepositoryToken(BibliotecaEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    await repository.clear();
    bibliotecasList = [];
    for (let i = 0; i < 5; i++) {
      const entity = await repository.save({
        nombre: faker.company.name(),
        direccion: faker.location.streetAddress(),
        ciudad: faker.location.city(),
        horaApertura: '08:00:00',
        horaCierre: '17:00:00',
        libros: [],
      });
      bibliotecasList.push(entity);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all bibliotecas', async () => {
    const bibliotecas = await service.findAll();
    expect(bibliotecas).not.toBeNull();
    expect(bibliotecas).toHaveLength(bibliotecasList.length);
  });

  it('findOne should return a biblioteca by id', async () => {
    const stored = bibliotecasList[0];
    const biblioteca = await service.findOne(stored.id);
    expect(biblioteca).not.toBeNull();
    expect(biblioteca.nombre).toEqual(stored.nombre);
  });

  it('findOne should throw exception for invalid id', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty(
      'message',
      'La biblioteca con el id dado no fue encontrada',
    );
  });

  it('create should return a new biblioteca', async () => {
    const newEntity: BibliotecaEntity = {
      id: '',
      nombre: faker.company.name(),
      direccion: faker.location.streetAddress(),
      ciudad: faker.location.city(),
      horaApertura: '09:00:00',
      horaCierre: '18:00:00',
      libros: [],
    };

    const created = await service.create(newEntity);
    expect(created).not.toBeNull();

    const stored = await repository.findOne({ where: { id: created.id } });
    expect(stored).not.toBeNull();
    expect(stored.nombre).toEqual(created.nombre);
  });

  it('create should throw exception if horaApertura >= horaCierre', async () => {
    const invalid: BibliotecaEntity = {
      id: '',
      nombre: faker.company.name(),
      direccion: faker.location.streetAddress(),
      ciudad: faker.location.city(),
      horaApertura: '19:00:00',
      horaCierre: '18:00:00',
      libros: [],
    };
    await expect(() => service.create(invalid)).rejects.toHaveProperty(
      'message',
      'La hora de apertura debe ser menor a la de cierre',
    );
  });

  it('update should modify a biblioteca', async () => {
    const entity = bibliotecasList[0];
    entity.nombre = 'Nombre Actualizado';
    entity.horaApertura = '07:00:00';
    entity.horaCierre = '16:00:00';

    const updated = await service.update(entity.id, entity);
    expect(updated).not.toBeNull();
    expect(updated.nombre).toEqual('Nombre Actualizado');
  });

  it('update should throw exception for invalid id', async () => {
    const entity = bibliotecasList[0];
    await expect(() => service.update('0', entity)).rejects.toHaveProperty(
      'message',
      'La biblioteca con el id dado no fue encontrada',
    );
  });

  it('update should throw exception if horaApertura >= horaCierre', async () => {
    const entity = bibliotecasList[1];
    entity.horaApertura = '18:00:00';
    entity.horaCierre = '17:00:00';
    await expect(() => service.update(entity.id, entity)).rejects.toHaveProperty(
      'message',
      'La hora de apertura debe ser menor a la de cierre',
    );
  });

  it('delete should remove a biblioteca', async () => {
    const entity = bibliotecasList[0];
    await service.delete(entity.id);
    const deleted = await repository.findOne({ where: { id: entity.id } });
    expect(deleted).toBeNull();
  });

  it('delete should throw exception for invalid id', async () => {
    await expect(() => service.delete('0')).rejects.toHaveProperty(
      'message',
      'La biblioteca con el id dado no fue encontrada',
    );
  });
});