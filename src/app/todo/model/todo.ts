/* ************************************************************************** */
/*                                  Enums                                     */
/* ************************************************************************** */

export enum TodoStatus {
  WAITING = 'waiting',
  IN_PROGRESS = 'in progress',
  DONE = 'done',
}

/* ************************************************************************** */
/*                                Interfaces                                  */
/* ************************************************************************** */

export interface Todo {
  id: number;
  name: string;
  content: string;
  status: TodoStatus;
  createdAt?: Date;
  updatedAt?: Date;
}
