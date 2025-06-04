import { Context } from 'hono';

// Custom error classes
export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
  }
}

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class DatabaseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DatabaseError';
  }
}

// Global error handler middleware
export const errorHandler = (err: Error, c: Context) => {
  console.error('Error occurred:', {
    name: err.name,
    message: err.message,
    stack: err.stack,
    timestamp: new Date().toISOString(),
  });

  // Handle specific error types
  if (err instanceof NotFoundError) {
    return c.json({ error: err.message }, 404);
  }

  if (err instanceof ValidationError) {
    return c.json({ error: 'Validation error', details: err.message }, 400);
  }

  if (err instanceof DatabaseError) {
    return c.json({ error: 'Database error', details: err.message }, 500);
  }

  // Handle DynamoDB specific errors
  if (err.name === 'ResourceNotFoundException') {
    return c.json({ error: 'Resource not found' }, 404);
  }

  if (err.name === 'ConditionalCheckFailedException') {
    return c.json({ error: 'Conditional check failed' }, 409);
  }

  if (err.name === 'ValidationException') {
    return c.json({ error: 'Invalid request parameters' }, 400);
  }

  // Handle AWS SDK errors
  if (err.name === 'ThrottlingException' || err.name === 'ProvisionedThroughputExceededException') {
    return c.json({ error: 'Service temporarily unavailable, please try again' }, 503);
  }

  // Default server error
  return c.json({ 
    error: 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { details: err.message })
  }, 500);
}; 