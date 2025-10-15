import { Injectable } from '@angular/core';
import axios from 'axios';
import { environment } from '../../environments/environment';

export interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface Organization {
  id: number;
  name: string;
  description: string;
  parentId?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.apiUrl;

  constructor() {
    // Axios interceptors are set up in AuthService
  }

  async getTasks(): Promise<Task[]> {
    const response = await axios.get<Task[]>(`${this.apiUrl}/tasks`);
    return response.data;
  }

  async createTask(task: Partial<Task>): Promise<Task> {
    const response = await axios.post<Task>(`${this.apiUrl}/tasks`, task);
    return response.data;
  }

  async updateTask(id: number, task: Partial<Task>): Promise<Task> {
    const response = await axios.put<Task>(`${this.apiUrl}/tasks/${id}`, task);
    return response.data;
  }

  async deleteTask(id: number): Promise<void> {
    await axios.delete(`${this.apiUrl}/tasks/${id}`);
  }

  async getOrganizations(): Promise<Organization[]> {
    const response = await axios.get<Organization[]>(`${this.apiUrl}/organizations`);
    return response.data;
  }

  async getUsers(): Promise<any[]> {
    const response = await axios.get(`${this.apiUrl}/users`);
    return response.data;
  }
}