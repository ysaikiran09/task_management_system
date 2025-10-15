import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, Task, AuthService, User } from '../services';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div *ngIf="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div class="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg relative">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold">
            {{ editingTask ? 'Edit Task' : 'Create New Task' }}
          </h2>
          <button (click)="closeModal()" class="text-gray-500 hover:text-gray-800">&times;</button>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            [(ngModel)]="taskFormModel.title"
            placeholder="Task title"
            class="md:col-span-2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            [(ngModel)]="taskFormModel.status"
            class="md:col-span-2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          <textarea
            [(ngModel)]="taskFormModel.description"
            placeholder="Description"
            class="md:col-span-2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="4"
          ></textarea>
        </div>

        <div class="mt-6 flex justify-end space-x-2">
          <button (click)="closeModal()" class="bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300">
            Cancel
          </button>
          <button
            (click)="editingTask ? updateTask() : createTask()"
            [disabled]="!taskFormModel.title"
            class="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:opacity-50"
          >
            {{ editingTask ? 'Save Changes' : 'Create Task' }}
          </button>
        </div>
      </div>
    </div>

    <div class="min-h-screen bg-gray-50">
      <header class="bg-white shadow-sm sticky top-0 z-10">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center py-4">
            <div class="flex items-center space-x-4">
              <h1 class="text-2xl font-bold text-gray-900">Task Board</h1>
              <p class="text-gray-600 hidden sm:block">
                Welcome, {{ currentUser?.firstName }}
              </p>
            </div>
            <div class="flex items-center space-x-4">
               <button (click)="openModal()" class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 font-semibold flex items-center space-x-2">
                <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" /></svg>
                <span>Create Task</span>
              </button>
              <button (click)="authService.logout()" class="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300">
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div *ngFor="let status of statuses" class="bg-gray-100 rounded-lg p-4">
            <h3 class="text-lg font-semibold text-gray-700 mb-4 px-2 flex justify-between">
              {{ status | titlecase }}
              <span class="text-sm font-normal bg-gray-200 text-gray-600 rounded-full px-2 py-0.5">
                {{ getTasksByStatus(status).length }}
              </span>
            </h3>
            
            <div class="space-y-4">
              <div *ngFor="let task of getTasksByStatus(status)" 
                  class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex flex-col space-y-4 transition hover:shadow-md cursor-pointer"
                  (click)="editTask(task)">
                
                <div class="flex justify-between items-center">
                  <h4 class="font-semibold text-gray-800">{{ task.title }}</h4>
                  <button (click)="deleteTask(task.id); $event.stopPropagation()" class="text-gray-400 hover:text-red-500">
                     <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M8.707 10l-2.647 2.646a.5.5 0 00.708.708L10 10.707l2.646 2.647a.5.5 0 00.708-.708L10.707 10l2.647-2.646a.5.5 0 00-.708-.708L10 9.293 7.354 6.646a.5.5 0 10-.708.708L9.293 10z" clip-rule="evenodd" /></svg>
                  </button>
                </div>

                <p *ngIf="task.description" class="text-sm text-gray-600">
                  {{ task.description }}
                </p>

                <div class="flex items-center text-xs text-gray-500">
                  <span class="flex items-center">
                    <svg class="w-4 h-4 mr-1 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" /></svg>
                    {{ getCreatorName(task.createdById) }}
                  </span>
                </div>
              </div>
              <div *ngIf="getTasksByStatus(status).length === 0" class="text-center text-sm text-gray-400 pt-4">
                No tasks here.
              </div>
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
  taskFormModel: Partial<Task> = {
    title: '',
    description: '',
    status: 'pending',
  };
  editingTask: Task | null = null;
  
  // New: For modal visibility
  isModalOpen = false;
  
  // New: Defines the Kanban columns
  statuses: Task['status'][] = ['pending', 'in-progress', 'completed'];

  private usersMap = new Map<number, User>();

  public authService = inject(AuthService);
  private apiService = inject(ApiService);

  ngOnInit() {
    this.authService.currentUser$.subscribe((user) => (this.currentUser = user));
    this.loadInitialData();
  }

  async loadInitialData() {
    try {
      const [users, tasks] = await Promise.all([
        this.apiService.getUsers(),
        this.apiService.getTasks(),
      ]);
      this.usersMap = new Map(users.map((user) => [user.id, user]));
      this.tasks = tasks;
    } catch (error) {
      console.error('Failed to load initial data', error);
    }
  }

  // New: Filters tasks for each Kanban column
  getTasksByStatus(status: string): Task[] {
    return this.tasks.filter((task) => task.status === status);
  }

  getCreatorName(userId: number | undefined): string {
    if (userId === undefined) return 'Unknown';
    const user = this.usersMap.get(userId);
    return user ? `${user.firstName} ${user.lastName}` : 'Unknown User';
  }

  // New: Methods to control the modal
  openModal() {
    this.editingTask = null;
    this.resetForm();
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  private resetForm() {
    this.taskFormModel = { title: '', description: '', status: 'pending' };
  }

  async createTask() {
    if (!this.taskFormModel.title) return;
    try {
      const task = await this.apiService.createTask(this.taskFormModel);
      this.tasks.push(task);
      this.closeModal();
    } catch (error) {
      console.error('Failed to create task', error);
    }
  }

  editTask(task: Task) {
    this.editingTask = task;
    this.taskFormModel = {
      title: task.title,
      description: task.description,
      status: task.status,
    };
    this.isModalOpen = true;
  }

  async updateTask() {
    if (!this.editingTask) return;
    try {
      const updatedTask = await this.apiService.updateTask(
        this.editingTask.id,
        this.taskFormModel
      );
      const index = this.tasks.findIndex((t) => t.id === this.editingTask!.id);
      if (index !== -1) this.tasks[index] = updatedTask;
      this.closeModal();
    } catch (error) {
      console.error('Failed to update task', error);
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
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  }
}