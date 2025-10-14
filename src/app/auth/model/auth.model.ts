/* ************************************************************************** */
/*                                Interfaces                                  */
/* ************************************************************************** */

export interface User {
  id: number;
  email: string;
  firstName?: string;
  lastName?: string;
  role?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token?: string;
}
