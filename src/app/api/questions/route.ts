import { NextRequest, NextResponse } from 'next/server';
import { quizCreationSchema } from '@/schemas/form/quiz';
import { ZodError } from 'zod';
import { strict_output } from '@/lib/gemini';

export async function POST(req: NextRequest) {
	try {
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
