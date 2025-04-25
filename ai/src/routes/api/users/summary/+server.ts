import { db } from '$lib/server/db';
import { user } from '$lib/server/db/schema';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

export const GET: RequestHandler = async () => {
	try {
		// 🔐 Seed admin account if not exists
		const existingAdmin = await db.select().from(user).where(eq(user.account, 'admin'));
		if (existingAdmin.length === 0) {
			const hashed = await bcrypt.hash('admin123', 10);
			await db.insert(user).values({
				account: 'admin',
				password: hashed,
				role: 'admin'
			});
			console.log('✅ Admin user created');
		}

		// 1. Get users from the database
		const data = await db.select().from(user);

		// 2. Generate summary using DeepSeek
		const prompt = `Give me a one-line summary of this user data: ${JSON.stringify(data)}`;

		const ollamaResponse = await fetch('http://localhost:11434/api/generate', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				model: 'deepseek-chat',
				prompt,
				stream: false
			})
		});

		const result = await ollamaResponse.json();

		// 3. Return summary and data
		return json({
			summary: result.response.trim(),
			data
		});
	} catch (error) {
		console.error('GET /users with DeepSeek summary error:', error);
		return json({ error: 'Failed to summarize user data' }, { status: 500 });
	}
};
