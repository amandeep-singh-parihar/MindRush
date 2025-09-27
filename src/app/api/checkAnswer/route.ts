import { z } from 'zod';
import { ZodError } from 'zod';
import { checkAnswerSchema } from '@/schemas/form/quiz';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { compareTwoStrings } from 'string-similarity';

export async function POST(req: Request) {
	try {
		const body = await req.json();
		const { questionId, userAnswer } = checkAnswerSchema.parse(body);

		const question = await prisma.question.findUnique({
			where: { id: questionId },
		});

		if (!question) {
			return NextResponse.json(
				{ error: 'Question not found' },
				{ status: 404 },
			);
		}

		// save the user's answer
		await prisma.question.update({
			where: { id: questionId },
			data: { userAnswer },
		});

		if (question.questionType === 'multiple_choice') {
			const isCorrect =
				question.answer.toLowerCase().trim() ===
				userAnswer.toLowerCase().trim();

			await prisma.question.update({
				where: { id: questionId },
				data: { isCorrect },
			});

			return NextResponse.json({ isCorrect }, { status: 200 });
		}

		if (question.questionType === 'open_ended') {
			let percentageMatch = compareTwoStrings(
				userAnswer.toLowerCase().trim(),
				question.answer.toLowerCase().trimEnd(),
			);

			percentageMatch = Math.round(percentageMatch * 100) / 100;

			await prisma.question.update({
				where: { id: questionId },
				data: { percentageCorrect: percentageMatch },
			});

			return NextResponse.json({ percentageMatch }, { status: 200 });
		}

		return NextResponse.json(
			{ error: 'Unsupported question type' },
			{ status: 400 },
		);
	} catch (error) {
		if (error instanceof ZodError) {
			return NextResponse.json({ error: error.issues }, { status: 400 });
		}

		console.error('Unexpected error in checkAnswer:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 },
		);
	}
}
