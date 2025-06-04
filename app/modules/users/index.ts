import { Hono } from 'hono';
import { handle } from 'hono/aws-lambda';
import { getItem, putItem, deleteItem } from '@/database/dynamodb';
import { v4 as uuidv4 } from 'uuid';
import { zValidator } from '@hono/zod-validator';
import { errorHandler, NotFoundError } from '@/middleware';
import {
  User,
  CreateUserSchema,
  UpdateUserSchema,
  UserParamSchema
} from './schema';

// Define table name
const TABLE_NAME = process.env.USERS_TABLE_NAME || 'Users';

// Create Hono app
const app = new Hono().basePath('/users');

// Apply global error handling middleware
app.onError(errorHandler);

app.get('/:id',
  zValidator('param', UserParamSchema),
  async (c) => {
    const { id } = c.req.valid('param');

    const user = await getItem(TABLE_NAME, { id });

    if (!user) {
      throw new NotFoundError(`User with id ${id} not found`);
    }

    return c.json({ user });
  }
);

app.post('/',
  zValidator('json', CreateUserSchema),
  async (c) => {
    const userData = c.req.valid('json');

    const newUser: User = {
      id: uuidv4(),
      username: userData.username,
      email: userData.email,
      createdAt: new Date().toISOString(),
    };

    await putItem(TABLE_NAME, newUser);

    return c.json({ user: newUser }, 201);
  }
);

app.put('/:id',
  zValidator('param', UserParamSchema),
  zValidator('json', UpdateUserSchema),
  async (c) => {
    const { id } = c.req.valid('param');
    const updateData = c.req.valid('json');

    const user = await getItem(TABLE_NAME, { id });

    if (!user) {
      throw new NotFoundError(`User with id ${id} not found`);
    }

    // Update user
    const updatedUser = {
      ...user,
      ...(updateData as Partial<User>),
      updatedAt: new Date().toISOString(),
    };

    await putItem(TABLE_NAME, updatedUser);

    return c.json({ user: updatedUser });
  }
);

app.delete('/:id',
  zValidator('param', UserParamSchema),
  async (c) => {
    const { id } = c.req.valid('param');

    const user = await getItem(TABLE_NAME, { id });

    if (!user) {
      throw new NotFoundError(`User with id ${id} not found`);
    }

    await deleteItem(TABLE_NAME, { id });

    return c.json({ message: 'User deleted successfully' });
  }
);

// Lambda handler
export const handler = handle(app);
