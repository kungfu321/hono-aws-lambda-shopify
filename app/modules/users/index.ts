import { Hono } from 'hono';
import { handle } from 'hono/aws-lambda';
import { getItem, putItem, deleteItem } from '../../libs/dynamodb';
import { v4 as uuidv4 } from 'uuid';
import { zValidator } from '@hono/zod-validator';
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

app.get('/:id',
  zValidator('param', UserParamSchema),
  async (c) => {
    const { id } = c.req.valid('param');

    try {
      const user = await getItem(TABLE_NAME, { id });

      if (!user) {
        return c.json({ error: 'User not found' }, 404);
      }

      return c.json({ user });
    } catch (error) {
      console.error(`Error fetching user with id ${id}:`, error);
      return c.json({ error: 'Failed to fetch user' }, 500);
    }
  }
);

app.post('/',
  zValidator('json', CreateUserSchema),
  async (c) => {
    try {
      const userData = c.req.valid('json');

      const newUser: User = {
        id: uuidv4(),
        username: userData.username,
        email: userData.email,
        createdAt: new Date().toISOString(),
      };

      await putItem(TABLE_NAME, newUser);

      return c.json({ user: newUser }, 201);
    } catch (error) {
      console.error('Error creating user:', error);
      return c.json({ error: 'Failed to create user' }, 500);
    }
  }
);

app.put('/:id',
  zValidator('param', UserParamSchema),
  zValidator('json', UpdateUserSchema),
  async (c) => {
    const { id } = c.req.valid('param');
    const updateData = c.req.valid('json');

    try {
      const user = await getItem(TABLE_NAME, { id });

      if (!user) {
        return c.json({ error: 'User not found' }, 404);
      }

      // Update user
      const updatedUser = {
        ...user,
        ...(updateData as Partial<User>),
        updatedAt: new Date().toISOString(),
      };

      await putItem(TABLE_NAME, updatedUser);

      return c.json({ user: updatedUser });
    } catch (error) {
      console.error(`Error updating user with id ${id}:`, error);
      return c.json({ error: 'Failed to update user' }, 500);
    }
  }
);

app.delete('/:id',
  zValidator('param', UserParamSchema),
  async (c) => {
    const { id } = c.req.valid('param');

    try {
      const user = await getItem(TABLE_NAME, { id });

      if (!user) {
        return c.json({ error: 'User not found' }, 404);
      }

      await deleteItem(TABLE_NAME, { id });

      return c.json({ message: 'User deleted successfully' });
    } catch (error) {
      console.error(`Error deleting user with id ${id}:`, error);
      return c.json({ error: 'Failed to delete user' }, 500);
    }
  }
);

// Lambda handler
export const handler = handle(app);
