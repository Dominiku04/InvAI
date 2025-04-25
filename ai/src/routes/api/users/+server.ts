// src/routes/api/users/login/+server.ts
import { db } from '$lib/server/db';
import { user } from '$lib/server/db/schema';
import { json } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import type { RequestHandler } from './$types';
import bcrypt from 'bcryptjs';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { account, password } = await request.json();

		if (!account || !password) {
			return json({ error: 'Missing credentials' }, { status: 400 });
		}

		const result = await db.select().from(user).where(eq(user.account, account));

		if (!result || result.length === 0) {
			return json({ error: 'User not found' }, { status: 404 });
		}

		const foundUser = result[0];

		// Compare hashed password
		const isMatch = await bcrypt.compare(password, foundUser.password);
		if (!isMatch) {
			return json({ error: 'Invalid password' }, { status: 401 });
		}

		// Simulate login success (use cookies or JWT later)
		return json({ message: 'Login successful', user: { account: foundUser.account, role: foundUser.role } });
	} catch (error) {
		console.error('POST /users/login error:', error);
		return json({ error: 'Login failed' }, { status: 500 });
	}
};
