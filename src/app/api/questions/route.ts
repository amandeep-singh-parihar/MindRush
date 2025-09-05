import { NextRequest, NextResponse } from 'next/server';
import { quizCreationSchema } from '@/schemas/form/quiz';
import { ZodError } from 'zod';
import { strict_output } from '@/lib/gemini';
import { getAuthSession } from '@/lib/nextauth';

export async function POST(req: NextRequest) {
	try {
		const session = await getAuthSession();
		if (!session?.user) {
			return NextResponse.json(
				{ error: 'Unauthorized, You must be logged in to create a quiz!!!' },
				{ status: 401 },
			);
		}

		const body = await req.json();
		const { topic, type, amount } = quizCreationSchema.parse(body);

		let questions: any = [];

		if (type === 'open_ended') {
			questions = await strict_output(
				'You are a helpful assistant that creates open-ended questions for quizzes. The questions should be clear, concise, and relevant to the given topic. Each question should encourage critical thinking and creativity.',
				new Array(amount).fill(
					`Generate ${amount} open-ended questions about the topic: ${topic}.`,
				),
				{
					question: '<the actual question text>',
					answer: '<answer (max 15 words)>',
				},
			);
		} else if (type === 'multiple_choice') {
			questions = await strict_output(
				'You are a helpful assistant that creates multiple-choice questions for quizzes. The questions should be clear, concise, and relevant to the given topic. Each question should have one correct answer and three plausible distractors.',
				new Array(amount).fill(
					`Generate ${amount} multiple-choice questions about the topic: ${topic}. Each question should have one correct answer and three plausible distractors.`,
				),
				{
					questions: '<the actual question text>',
					answer: '<the correct answer>',
					option1: '<a plausible distractor>',
					option2: '<a plausible distractor>',
					option3: '<a plausible distractor>',
				},
			);
		}

		return NextResponse.json({ questions }, { status: 200 });
	} catch (error) {
		console.error('Error in the POST /api/questions : ', error);

		if (error instanceof ZodError) {
			return NextResponse.json({ error: error.issues }, { status: 400 });
		}

		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 },
		);
	}
}
