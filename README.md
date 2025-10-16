Of course\! Here is the information formatted properly in Markdown with improved clarity.

# Task Management 🚀

This guide provides instructions for setting up and running the Task Management application.

-----

## Installation

First, install all the necessary project dependencies using Yarn.

```bash
yarn install
```

-----

## Backend Setup

### 1\. Configure Environment Variables

Create a **`.env`** file in the root of the backend directory. Add the following variables, replacing the comments with your actual credentials.

```env
# Your Neon DB PostgreSQL connection link
DATABASE_URL=postgres://...

# Set to 'true' to automatically synchronize the database schema
DB_SYNCHRONIZE=true

# A securely generated secret for JWT
JWT_SECRET=your_super_secret_jwt_token

# The port the backend server will run on
PORT=3000
```

### 2\. Run the Server

Start the backend server with the following command:

```bash
yarn start-backend
```

-----

## Frontend Setup

To start the frontend development server, run this command:

```bash
yarn start-frontend
```

-----

## Generate Tailwind CSS (Optional)

If you need to generate the Tailwind CSS configuration for the Angular project, use the following NX command:

```bash
nx g @nx/angular:setup-tailwind taskmanagementsys
```