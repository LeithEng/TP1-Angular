/* ************************************************************************** */
/*                                Dependencies                                */
/* ************************************************************************** */

// Lib dependencies
import { Injectable, signal, computed } from '@angular/core';

// Models
import { Todo, TodoStatus } from '../model/todo';

/* ************************************************************************** */
/*                                  Service                                   */
/* ************************************************************************** */

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  /* ********************************************************************** */
  /*                            Private Properties                          */
  /* ********************************************************************** */

  private todosSignal = signal<Todo[]>([
    {
      id: 1,
      name: 'Apprendre Angular',
      content: 'Maîtriser les signals et le nouveau control flow',
      status: 'in progress',
      createdAt: new Date(),
    },
    {
      id: 2,
      name: 'Faire le TP',
      content: 'Compléter tous les exercices du TP1',
      status: 'waiting',
      createdAt: new Date(),
    },
    {
      id: 3,
      name: "Réviser pour l'examen",
      content: "Préparer l'examen de GL4",
      status: 'waiting',
      createdAt: new Date(),
    },
  ]);

  private nextId = 4;

  /* ********************************************************************** */
  /*                           Computed Signals                             */
  /* ********************************************************************** */

  waitingTodos = computed(() =>
    this.todosSignal().filter((todo) => todo.status === 'waiting')
  );
  inProgressTodos = computed(() =>
    this.todosSignal().filter((todo) => todo.status === 'in progress')
  );
  doneTodos = computed(() =>
    this.todosSignal().filter((todo) => todo.status === 'done')
  );
  allTodos = computed(() => this.todosSignal());
  totalCount = computed(() => this.todosSignal().length);
  waitingCount = computed(() => this.waitingTodos().length);
  inProgressCount = computed(() => this.inProgressTodos().length);
  doneCount = computed(() => this.doneTodos().length);

  /* ********************************************************************** */
  /*                            Public Methods                              */
  /* ********************************************************************** */

  addTodo(name: string, content: string): void {
    const newTodo: Todo = {
      id: this.nextId++,
      name: name.trim(),
      content: content.trim(),
      status: 'waiting',
      createdAt: new Date(),
    };

    this.todosSignal.update((todos) => [...todos, newTodo]);
  }

  updateTodoStatus(id: number, status: TodoStatus): void {
    this.todosSignal.update((todos) =>
      todos.map((todo) =>
        todo.id === id ? { ...todo, status, updatedAt: new Date() } : todo
      )
    );
  }

  deleteTodo(id: number): void {
    this.todosSignal.update((todos) => todos.filter((todo) => todo.id !== id));
  }

  updateTodo(id: number, name: string, content: string): void {
    this.todosSignal.update((todos) =>
      todos.map((todo) =>
        todo.id === id
          ? {
              ...todo,
              name: name.trim(),
              content: content.trim(),
              updatedAt: new Date(),
            }
          : todo
      )
    );
  }

  getTodoById(id: number): Todo | undefined {
    return this.todosSignal().find((todo) => todo.id === id);
  }

  clearAllTodos(): void {
    this.todosSignal.set([]);
  }

  clearDoneTodos(): void {
    this.todosSignal.update((todos) =>
      todos.filter((todo) => todo.status !== 'done')
    );
  }
}
