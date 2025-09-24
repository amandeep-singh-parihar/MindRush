import { NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { getAuthSession } from '@/lib/nextauth';
import { quizCreationSchema } from '@/schemas/form/quiz';
import { prisma } from '@/lib/db';
import axios from 'axios';

export async function POST(req: NextRequest) {
	try {
		const session = await getAuthSession();
		if (!session?.user) {
			return NextResponse.json(
				{
					message: 'Unauthorized, You must be logged in to access the game!!!',
				},
				{
					status: 401,
				},
			);
		}

		const body = await req.json();
		const { amount, type, topic } = quizCreationSchema.parse(body);
		const game = await prisma.game.create({
			data: {
				gameType: type,
				timeStarted: new Date(),
				userId: session.user.id,
				topic,
			},
		});
		await prisma.topicCount.upsert({
			where: {
				topic: topic,
			},
			create: {
				topic,
				count: 1,
			},
			update: {
				count: {
					increment: 1,
				},
			},
		});
		const { data } = await axios.post(`${process.env.API_URL}/api/questions`, {
			amount,
			topic,
			type,
		});
		if (type === 'multiple_choice') {
			type mcqType = {
				question: string;
				answer: string;
				option1: string;
				option2: string;
				option3: string;
			};
			let manyData = data.questions.map((q: mcqType) => {
				let options = [q.answer, q.option1, q.option2, q.option3];
				options = options.sort(() => Math.random() - 0.5);
				return {
					question: q.question,
					answer: q.answer,
					options: JSON.stringify(options),
					gameId: game.id,
					questionType: 'multiple_choice',
				};
			});
			await prisma.question.createMany({
				data: manyData,
			});
		} else if (type === 'open_ended') {
			type openType = {
				question: string;
				answer: string;
			};
			let manyData = data.questions.map((question: openType) => {
				return {
					question: question.question,
					answer: question.answer,
					gameId: game.id,
					questionType: 'open_ended',
				};
			});
			await prisma.question.createMany({
				data: manyData,
			});
		}
		return NextResponse.json({
			gameId: game.id,
		});
	} catch (error) {
		console.error('Error in POST /api/game:', error);
		if (error instanceof ZodError) {
			return NextResponse.json(
				{
					error: error.issues,
				},
				{
					status: 400,
				},
			);
		}
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 },
		);
	}
}
