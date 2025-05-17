/* src/biblioteca/biblioteca.entity.ts */
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

  @Column({ type: 'time' })
  horaApertura: string;

  @Column({ type: 'time' })
  horaCierre: string;

  @ManyToMany(() => LibroEntity, libro => libro.bibliotecas)
  @JoinTable()
  libros: LibroEntity[];
}
