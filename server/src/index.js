import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';

// Import routes
import authRoutes from './routes/auth-routes.js';
import callRoutes from './routes/call-routes.js';
import complaintRoutes from './routes/complaint-routes.js';
import claimRoutes from './routes/claim-routes.js';
import userRoutes from './routes/user-routes.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/calls', callRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/claims', claimRoutes);
app.use('/api/user', userRoutes);

// Serve static files from public directory if it exists
app.use(express.static(path.join(__dirname, '../public')));

// Catch-all for SPA: serve index.html
app.get('*', (req, res) => {
  const indexPath = path.join(__dirname, '../public/index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      res.status(404).json({ error: 'Not found' });
    }
  });
});

// Global error handler middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`CallShield server running on port ${PORT}`);
});
