# MongoDB Express API

A simple Express REST API connected to MongoDB with bcrypt password hashing.

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- A MongoDB instance (local or [MongoDB Atlas](https://www.mongodb.com/atlas))

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file in the project root:

```
MONGO_DB_URI=mongodb://localhost:27017
DB_NAME=your_database_name
PORT=3000
```

3. Start the development server:

```bash
npm run dev
```

> `npm run dev` uses `nodemon`, which automatically restarts the server when files change. Install it globally if needed: `npm install -g nodemon`

## API Endpoints

| Method | Path     | Description       |
|--------|----------|-------------------|
| GET    | /users   | Returns all users |

On first run, the app seeds an initial user into the database if none exist.
