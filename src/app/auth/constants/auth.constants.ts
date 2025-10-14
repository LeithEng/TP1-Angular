/* ************************************************************************** */
/*                                Dependencies                                */
/* ************************************************************************** */
// Models
import { AuthState } from "../model/auth.model";

/* ************************************************************************** */
/*                                Constants                                   */
/* ************************************************************************** */

export const AUTH_STORAGE_KEY = 'auth_state';

export const DEFAULT_AUTH_STATE: AuthState = {
  user: null,
  isAuthenticated: false
};