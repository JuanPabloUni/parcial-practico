/* src/libro/libro.dto.ts */
/* eslint-disable prettier/prettier */
import { IsString, IsNotEmpty, IsDateString } from 'class-validator';

export class LibroDto {
  @IsString()
  @IsNotEmpty()
  readonly titulo: string;

  @IsString()
  @IsNotEmpty()
  readonly autor: string;

  @IsDateString()
  @IsNotEmpty()
  readonly fechaPublicacion: string;

  @IsString()
  @IsNotEmpty()
  readonly isbn: string;
}