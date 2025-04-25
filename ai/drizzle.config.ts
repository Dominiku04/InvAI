import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

const { DATABASE_URL, DATABASE_AUTH_TOKEN } = process.env;

if (!DATABASE_URL) {
	throw new Error('DATABASE_URL is not set');
}

export default defineConfig({
	schema: './src/lib/server/db/schema.ts',
	dialect: 'turso',
	dbCredentials: {
		url: DATABASE_URL,
		authToken: DATABASE_AUTH_TOKEN
	},
	verbose: true,
	strict: true
});
