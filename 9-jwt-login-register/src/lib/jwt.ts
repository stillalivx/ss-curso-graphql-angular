import { IUser } from '../interfaces/user.interface';
import jwt from 'jsonwebtoken';

export default class Jwt {
  private secretKey = process.env.SECRET_KEY || 'ijPIUH932J&%$_';
  // Información del Payload para crear token que usaremos para indentificarnos

  sign(data: IUser, expiresIn = 360): string {
    return jwt.sign({
      user: data,
    }, this.secretKey, {
      expiresIn
    });
  }

  verify(token: string): string {
    try {
      return <string>jwt.verify(token, this.secretKey);
    } catch (e) {
      return 'Token invalido';
    }

    return '';
  }
}