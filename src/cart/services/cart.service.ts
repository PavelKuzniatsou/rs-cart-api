import { Injectable, Inject } from '@nestjs/common';

import { v4 } from 'uuid';

import { Cart } from '../models';

import { Client } from 'pg';
const { PG_HOST, PG_PORT, PG_DATABASE, PG_USERNAME, PG_PASSWORD } = process.env;
const dbOptions = {
  host: PG_HOST,
  port: PG_PORT,
  database: PG_DATABASE,
  user: PG_USERNAME,
  password: PG_PASSWORD,
  ssl: {
    rejectUnauthorized: false,
  },
  connectionTimeoutMillis: 5000,
};

@Injectable()
export class CartService {
  async createByUserId(): Promise<Cart> {
    const id = v4(v4());
    const date = new Date(Date.now())
      .toISOString()
      .replace('T', ' ')
      .replace('Z', '');
    const client = new Client(dbOptions);
    await client.connect();

    try {
      await client.query(
        `insert into carts (id, created_at, updated_at) values ($1, $2, $3)`,
        [id, date, date],
      );
      const userCart = {
        id,
        items: [],
      };

      return userCart;
    } catch (e) {
      console.log(e);
      return null;
    } finally {
      await client.end(); // closes connection
    }
  }

  async findOrCreateByUserId(userId: string): Promise<Cart> {
    const client = new Client(dbOptions);
    await client.connect();

    try {
      const res = await client.query(
        'select product_id, count from cart_items where cart_id = $1;',
        [userId],
      );
      console.log('updateByUserId: ', userId);
      console.log('rows: ', res.rows);
      if (res.rows.length === 0) {
        return this.createByUserId();
      } else {
        const items = res.rows.map(cartItem => ({
          product: cartItem.product_id,
          count: cartItem.count,
        }));

        console.log('items: ', items);
        return {
          id: userId,
          items: items,
        };
      }
    } catch (e) {
      console.log(e);
      return null;
    } finally {
      await client.end(); // closes connection
    }
  }

  async updateByUserId(userId: string, { items }: Cart): Promise<Cart> {
    console.log('updateByUserId: ', userId, items);
    const client = new Client(dbOptions);
    await client.connect();
    try {
      const values = items
        .map(item => {
          return `('${userId}', ${item.count})`;
        })
        .join(', ');
      const query = 'insert into cart_items (cart_id, count) values ' + values;
      console.log('query: ', query);
      await client.query(query);

      return this.findOrCreateByUserId(userId);
    } catch (e) {
      console.log(e);
      return null;
    } finally {
      await client.end(); // closes connection
    }

    // return this.userCarts[userId];
    // const { id, ...rest } = this.findOrCreateByUserId(userId);

    // const updatedCart = {
    //   id,
    //   ...rest,
    //   items: [...items],
    // };

    // this.userCarts[userId] = { ...updatedCart };

    // return { ...updatedCart };
  }

  async removeByUserId(userId): Promise<void> {
    console.log('removeByUserId: ', userId);
    const client = new Client(dbOptions);
    await client.connect();
    try {
      await client.query('delete from cart_items where cart_id = $1;', [
        userId,
      ]);
      await client.query('delete from carts where id = $1;', [userId]);
    } catch (e) {
      console.log(e);
    } finally {
      await client.end(); // closes connection
    }
  }
}
