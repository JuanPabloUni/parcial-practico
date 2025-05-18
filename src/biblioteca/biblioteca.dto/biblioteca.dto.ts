/* src/biblioteca/biblioteca.dto.ts */
/* eslint-disable prettier/prettier */
import { IsString, IsNotEmpty, Matches } from 'class-validator';

export class BibliotecaDto {
  @IsString()
  @IsNotEmpty()
  readonly nombre: string;

  @IsString()
  @IsNotEmpty()
  readonly direccion: string;

  @IsString()
  @IsNotEmpty()
  readonly ciudad: string;

  @Matches(/^([0-1]\d|2[0-3]):([0-5]\d):([0-5]\d)$/, { message: 'horaApertura must be in HH:mm:ss format' })
  readonly horaApertura: string;

  @Matches(/^([0-1]\d|2[0-3]):([0-5]\d):([0-5]\d)$/, { message: 'horaCierre must be in HH:mm:ss format' })
  readonly horaCierre: string;
}