/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus } from '@nestjs/common';

export enum BusinessError {
  NOT_FOUND = 'NOT_FOUND',
  PRECONDITION_FAILED = 'PRECONDITION_FAILED',
  BAD_REQUEST = 'BAD_REQUEST',
}

export class BusinessLogicException extends HttpException {
  constructor(public readonly message: string, public readonly type: BusinessError) {
    super({ message, type }, HttpStatus.BAD_REQUEST);
  }
}