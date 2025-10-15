import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, Task, AuthService, User } from '../services';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-gray-100">
      <!-- Header -->
      <header class="bg-white shadow-sm">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center py-4">
            <div>
              <h1 class="text-2xl font-bold text-gray-900">Task Manager</h1>
              <p class="text-gray-600">
                Welcome, {{ currentUser?.firstName }} ({{ currentUser?.role }})
              </p>
            </div>
            <button
              (click)="authService.logout()"
              class="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <!-- Main Content -->
      <main class="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <!-- Create Task Form -->
        <div class="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 class="text-lg font-semibold mb-4">Create New Task</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              [(ngModel)]="newTask.title"
              placeholder="Task title"
              class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <select
              [(ngModel)]="newTask.status"
              class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>

            <textarea
              [(ngModel)]="newTask.description"
              placeholder="Description"
              class="md:col-span-2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="3"
            ></textarea>

            <button
              (click)="createTask()"
              [disabled]="!newTask.title"
              class="md:col-span-2 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:opacity-50"
            >
              Add Task
            </button>
          </div>
        </div>

        <!-- Tasks List -->
        <div class="bg-white rounded-lg shadow-md">
          <div class="px-6 py-4 border-b">
            <h2 class="text-lg font-semibold">
              Your Tasks ({{ tasks.length }})
            </h2>
          </div>

          <div class="divide-y">
            <div *ngFor="let task of tasks" class="p-6 hover:bg-gray-50">
              <div class="flex justify-between items-start">
                <div class="flex-1">
                  <h3 class="text-lg font-medium text-gray-900">
                    {{ task.title }}
                  </h3>
                  <p class="mt-1 text-gray-600">{{ task.description }}</p>
                  <div class="mt-2 flex items-center space-x-4">
                    <span
                      [class]="getStatusClass(task.status)"
                      class="px-2 py-1 text-xs font-medium rounded-full"
                    >
                      {{ task.status }}
                    </span>
                    <span class="text-sm text-gray-500">
                      Created: {{ task.createdAt | date : 'medium' }}
                    </span>
                  </div>
                </div>
                <div class="flex space-x-2">
                  <button
                    (click)="deleteTask(task.id)"
                    class="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>

            <div
              *ngIf="tasks.length === 0"
              class="p-6 text-center text-gray-500"
            >
              No tasks found. Create your first task above!
            </div>
          </div>
        </div>
      </main>
    </div>
  `,
})
export class TasksComponent implements OnInit {
  tasks: Task[] = [];
  currentUser: User | null = null;
  newTask: Partial<Task> = {
    title: '',
    description: '',
    status: 'pending',
  };

  public authService = inject(AuthService);
  private apiService = inject(ApiService);

  ngOnInit() {
    this.authService.currentUser$.subscribe((user) => {
      this.currentUser = user;
    });
    this.loadTasks();
  }

  async loadTasks() {
    try {
      this.tasks = await this.apiService.getTasks();
    } catch (error) {
      console.error('Failed to load tasks', error);
    }
  }

  async createTask() {
    if (!this.newTask.title) return;

    try {
      const task = await this.apiService.createTask(this.newTask);
      this.tasks.push(task);
      this.newTask = { title: '', description: '', status: 'pending' };
    } catch (error) {
      console.error('Failed to create task', error);
    }
  }

  async deleteTask(id: number) {
    try {
      await this.apiService.deleteTask(id);
      this.tasks = this.tasks.filter((t) => t.id !== id);
    } catch (error) {
      console.error('Failed to delete task', error);
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }
}