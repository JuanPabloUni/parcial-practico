/* eslint-disable prettier/prettier */
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { BibliotecaEntity } from '../../biblioteca/biblioteca.entity/biblioteca.entity';

@Entity()
export class LibroEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  titulo: string;

  @Column()
  autor: string;

  @Column({ type: 'date' })
  fechaPublicacion: Date;

  @Column()
  isbn: string;

  @ManyToMany(() => BibliotecaEntity, biblioteca => biblioteca.libros)
  bibliotecas: BibliotecaEntity[];
}