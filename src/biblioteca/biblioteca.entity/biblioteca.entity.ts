/* eslint-disable prettier/prettier */
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';
import { LibroEntity } from '../../libro/libro.entity/libro.entity';

@Entity()
export class BibliotecaEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre: string;

  @Column()
  direccion: string;

  @Column()
  ciudad: string;

  @Column()
  horarioAtencion: string;

  @ManyToMany(() => LibroEntity, libro => libro.bibliotecas)
  @JoinTable()
  libros: LibroEntity[];
}