
# Test-Project

## Introduction

This project is a test application built using the T3 stack, showcasing a modern web application's capabilities. It integrates technologies like Next.js, Prisma, tRPC, and NextAuth, providing a robust and scalable solution for web development.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Setting Up OAuth2 with Discord and GitHub](#setting-up-oauth2-with-discord-and-github)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [Testing](#testing)

## Features

- OAuth2 integration with Discord and GitHub for authentication.
- Advanced database management using Prisma.
- Seamless API routing with tRPC.
- Handling typescript and validations with Zod for both API and Frontend part in a shared place to reduce development time marginaly and reduce chances of writing bad codes on both sides
- Perfect API test environment with complete and through Jest test for APIs

## Technologies Used

- Next.js
- Prisma
- tRPC
- NextAuth
- ...

## Getting Started

### Prerequisites

- Node.js
- Yarn (or NPM , it's no big deal)
- Docker (for running tests)
- PostgreSQL database

### Installation

1. Clone the repository
2. Install dependencies: `yarn install`
3. Copy `.env.example` to `.env` and fill in the necessary environment variables.

## Setting Up OAuth2 with Discord and GitHub

### Discord Setup

1. Visit the [Discord Developer Portal](https://discord.com/developers/applications) and log in.
2. Click on "New Application", name your application, and create it.
3. Go to the "OAuth2" tab, add a redirect URI (e.g., `http://localhost:3000/api/auth/callback/discord`).
4. Note down the Client ID and Client Secret from the "General Information" tab.
5. Add these credentials to your `.env` file.

### GitHub Setup

1. Navigate to [GitHub Developer Settings](https://github.com/settings/developers).
2. Click on "New OAuth App" under "OAuth Apps".
3. Fill in the application name, homepage URL, and the callback URL (e.g., `http://localhost:3000/api/auth/callback/github`).
4. After creating the app, note down the Client ID and Client Secret.
5. Update your `.env` file with these credentials.

## Database Setup

Run `npx prisma migrate deploy` to set up your database schema as defined in your Prisma models.

## Running the Application

- Start the development server: `yarn dev`
- Build the project: `yarn build`
- Run the built application: `yarn start`

## Testing

### Prerequisites for Testing

- Ensure Docker is installed, as it is required for the test database environment.

### Setting Up the Test Environment

1. **Environment Variables**:
   - Copy `.env.example` to `.env.test`.
   - Configure the database-related environment variables in `.env.test` as follows:
     ```
     DATABASE_URL="postgresql://test_user:test_password@localhost:5432/test_db?schema=public&?pgbouncer=true&connect_timeout=15"
     DATABASE_URL_NON_POOLING="postgresql://test_user:test_password@localhost:5432/test_db?schema=public"
     ```

2. **Running Tests**:
   - Run `yarn test` to execute the test suite.
   - This command will automatically handle setting up and tearing down the Docker-based test database using the `pretest` and `posttest` scripts in `package.json`.

By following these steps, your testing environment will be correctly set up and isolated, ensuring reliable test execution.
