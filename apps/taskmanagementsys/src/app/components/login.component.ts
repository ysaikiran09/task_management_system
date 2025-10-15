import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  template: `
    <div
      class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4"
    >
      <div
        class="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
      >
        <!-- Header -->
        <div
          class="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white"
        >
          <h1 class="text-2xl font-bold text-center">TaskFlow</h1>
          <p class="text-blue-100 text-center mt-2">
            Manage your tasks efficiently
          </p>
        </div>

        <div class="p-8">
          <!-- Login Form -->
          <div *ngIf="!showRegister">
            <h2 class="text-2xl font-bold text-gray-800 text-center mb-2">
              Welcome Back
            </h2>
            <p class="text-gray-600 text-center mb-6">
              Sign in to your account
            </p>

            <form (ngSubmit)="onSubmit()" class="space-y-4">
              <div>
                <label
                  for="login-email"
                  class="block text-sm font-medium text-gray-700 mb-2"
                  >Email Address</label
                >
                <input
                  id="login-email"
                  type="email"
                  [(ngModel)]="email"
                  name="email"
                  placeholder="Enter your email"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  required
                />
              </div>

              <div>
                <label
                  for="login-password"
                  class="block text-sm font-medium text-gray-700 mb-2"
                  >Password</label
                >
                <input
                  id="login-password"
                  type="password"
                  [(ngModel)]="password"
                  name="password"
                  placeholder="Enter your password"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  required
                />
              </div>

              <button
                type="submit"
                [disabled]="loading"
                class="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                <span *ngIf="!loading">Sign In</span>
                <span *ngIf="loading" class="flex items-center justify-center">
                  <svg
                    class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      class="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      stroke-width="4"
                    ></circle>
                    <path
                      class="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Signing In...
                </span>
              </button>
            </form>

            <div class="mt-6 text-center">
              <p class="text-gray-600">Don't have an account?</p>
              <button
                (click)="showRegister = true"
                class="text-blue-600 hover:text-blue-700 font-medium mt-2 transition-colors duration-200"
              >
                Create an account
              </button>
            </div>
          </div>

          <!-- Registration Form -->
          <div *ngIf="showRegister">
            <h2 class="text-2xl font-bold text-gray-800 text-center mb-2">
              Create Account
            </h2>
            <p class="text-gray-600 text-center mb-6">Join us to get started</p>

            <form (ngSubmit)="onRegister()" class="space-y-4">
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label for="register-first-name" class="block text-sm font-medium text-gray-700 mb-2"
                    >First Name</label
                  >
                  <input
                    id="register-first-name"
                    type="text"
                    [(ngModel)]="registerData.firstName"
                    name="firstName"
                    placeholder="John"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
                <div>
                  <label for="register-last-name" class="block text-sm font-medium text-gray-700 mb-2"
                    >Last Name</label
                  >
                  <input
                    id="register-last-name"
                    type="text"
                    [(ngModel)]="registerData.lastName"
                    name="lastName"
                    placeholder="Doe"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>

              <div>
                <label for="register-email" class="block text-sm font-medium text-gray-700 mb-2"
                  >Email Address</label
                >
                <input
                  id="register-email"
                  type="email"
                  [(ngModel)]="registerData.email"
                  name="regEmail"
                  placeholder="john@example.com"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              <div>
                <label
                  for="register-password"
                  class="block text-sm font-medium text-gray-700 mb-2"
                  >Password</label
                >
                <input
                  id="register-password"
                  type="password"
                  [(ngModel)]="registerData.password"
                  name="regPassword"
                  placeholder="Create a password"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              <div>
                <label
                  for="register-organization-id"
                  class="block text-sm font-medium text-gray-700 mb-2"
                  >Organization ID</label
                >
                <input
                  id="register-organization-id"
                  type="number"
                  [(ngModel)]="registerData.organizationId"
                  name="organizationId"
                  placeholder="1"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              <button
                type="submit"
                [disabled]="loading"
                class="w-full bg-gradient-to-r from-green-600 to-emerald-700 text-white py-3 px-4 rounded-lg hover:from-green-700 hover:to-emerald-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                <span *ngIf="!loading">Create Account</span>
                <span *ngIf="loading" class="flex items-center justify-center">
                  <svg
                    class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      class="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      stroke-width="4"
                    ></circle>
                    <path
                      class="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Creating Account...
                </span>
              </button>
            </form>

            <div class="mt-6 text-center">
              <p class="text-gray-600">Already have an account?</p>
              <button
                (click)="showRegister = false"
                class="text-blue-600 hover:text-blue-700 font-medium mt-2 transition-colors duration-200"
              >
                Back to Sign In
              </button>
            </div>
          </div>

          <!-- Error Message -->
          <div
            *ngIf="error"
            class="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg"
          >
            <div class="flex items-center">
              <svg
                class="w-5 h-5 text-red-400 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clip-rule="evenodd"
                ></path>
              </svg>
              <span class="text-red-800 text-sm font-medium">{{ error }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class LoginComponent {
  email = '';
  password = '';
  error = '';
  loading = false;
  showRegister = false;

  registerData = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    organizationId: 1,
  };

  authService = inject(AuthService);
  router = inject(Router);

  async onSubmit() {
    if (!this.email || !this.password) {
      this.error = 'Please fill in all fields';
      return;
    }

    this.loading = true;
    this.error = '';

    try {
      await this.authService.login(this.email, this.password);
      this.router.navigate(['/tasks']);
    } catch (error: any) {
      this.error =
        error.response?.data?.message ||
        'Login failed. Please check your credentials.';
    } finally {
      this.loading = false;
    }
  }

  async onRegister() {
    this.loading = true;
    this.error = '';

    try {
      await this.authService.register(this.registerData);
      this.showRegister = false;
      this.error =
        'Registration successful! Please sign in with your credentials.';
      // Clear form
      this.registerData = {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        organizationId: 1,
      };
    } catch (error: any) {
      this.error =
        error.response?.data?.message ||
        'Registration failed. Please try again.';
    } finally {
      this.loading = false;
    }
  }
}
