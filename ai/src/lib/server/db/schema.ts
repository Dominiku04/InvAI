import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const user = sqliteTable('user', {
	id: integer('id').primaryKey().notNull(),
	account: text('account').notNull().unique(),
	password: text('password').notNull(),
	role: text('role').default('user'),
	createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`)
});
