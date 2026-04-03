# CallShield

A comprehensive call management and shield platform for modern communication workflows.

## Tech Stack

- **Frontend**: React with TypeScript
- **Backend**: Node.js with Express and Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: JWT-based auth
- **Deployment**: Railway

## Getting Started

Follow these steps to set up the project locally:

### Prerequisites

- Node.js 20 or higher
- PostgreSQL database
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/callshield.git
   cd callshield
   ```

2. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit the `.env` file and fill in the required values (database URL, API keys, etc.)

3. **Set up the server**
   ```bash
   cd server
   npm install
   npx prisma migrate dev
   ```

4. **Set up the client**
   ```bash
   cd client
   npm install
   ```

### Running Locally

**Start the server:**
```bash
cd server
npm run dev
```
The server will be available at `http://localhost:3000`

**Start the client:**
```bash
cd client
npm run dev
```
The client will be available at `http://localhost:5173`

## Development

### Linting and Testing

For the client:
```bash
cd client
npm run lint
npm run test
npm run build
```

For the server:
```bash
cd server
npm run lint
npm run test
```

### Database Migrations

To create a new migration:
```bash
cd server
npx prisma migrate dev --name migration_name
```

## Deployment

CallShield is configured for easy deployment on **Railway**.

### Deploy to Railway

1. Connect your GitHub repository to Railway
2. Configure environment variables in the Railway dashboard
3. Railway will automatically run migrations and deploy on push to the main branch

For more information, visit [Railway Documentation](https://docs.railway.app)

## License

This project is licensed under the MIT License - see the LICENSE file for details.
