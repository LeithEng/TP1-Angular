/* ************************************************************************** */
/*                                Dependencies                                */
/* ************************************************************************** */

// Lib dependencies
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common'; 

// Service
import { TodoService } from '../service/todo.service';

// Models
import { TodoStatus } from '../model/todo';

/* ************************************************************************** */
/*                                 Component                                  */
/* ************************************************************************** */

@Component({
  selector: 'app-todo-manager',
  standalone: true,
  imports: [FormsModule, DatePipe],
  templateUrl: './todo.component.html',
  styleUrl: './todo.component.css',
})
export class TodoComponent {
  /* ********************************************************************** */
  /*                          Injected Services                             */
  /* ********************************************************************** */

  todoService = inject(TodoService);

  /* ********************************************************************** */
  /*                            Properties                                  */
  /* ********************************************************************** */

  newTodoName = '';
  newTodoContent = '';
  showClearConfirm = false;

  /* ********************************************************************** */
  /*                            Public Methods                              */
  /* ********************************************************************** */

  addTodo(): void {
    if (this.isValidInput()) {
      this.todoService.addTodo(this.newTodoName, this.newTodoContent);
      this.clearInputs();
    }
  }

  changeStatus(id: number, status: TodoStatus): void {
    this.todoService.updateTodoStatus(id, status);
  }

  deleteTodo(id: number): void {
    this.todoService.deleteTodo(id);
  }

  clearDoneTodos(): void {
    this.todoService.clearDoneTodos();
  }

  toggleClearConfirm(): void {
    this.showClearConfirm = !this.showClearConfirm;
  }

  clearAllTodos(): void {
    this.todoService.clearAllTodos();
    this.showClearConfirm = false;
  }

  /* ********************************************************************** */
  /*                            Private Methods                             */
  /* ********************************************************************** */

  private isValidInput(): boolean {
    return (
      this.newTodoName.trim().length > 0 &&
      this.newTodoContent.trim().length > 0
    );
  }

  private clearInputs(): void {
    this.newTodoName = '';
    this.newTodoContent = '';
  }
}
