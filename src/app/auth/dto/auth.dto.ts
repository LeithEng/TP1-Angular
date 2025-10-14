/* ************************************************************************** */
/*                                  DTOs                                      */
/* ************************************************************************** */

// Models
import { User } from '../model/auth.model';

export class LoginCredentialsDto {
  email: string;
  password: string;

  constructor(email: string = '', password: string = '') {
    this.email = email;
    this.password = password;
  }
}

export class LoginResponseDto {
  success: boolean;
  user?: User;
  token?: string;
  message?: string;

  constructor(success: boolean, user?: User, token?: string, message?: string) {
    this.success = success;
    this.user = user;
    this.token = token;
    this.message = message;
  }
}

export class UpdateUserDto {
  email?: string;
  firstName?: string;
  lastName?: string;
  role?: string;

  constructor(data?: Partial<UpdateUserDto>) {
    Object.assign(this, data);
  }
}
