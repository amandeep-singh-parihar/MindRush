import React from 'react';
import { getDbSession } from '@/lib/auth0-db';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import MCQ from '@/components/MCQ';

interface PageProps {
	params: {
		gameId: string;
	};
}

const MultipleChoicePage = async ({ params }: PageProps) => {
	const { gameId } = params;

	const session = await getDbSession();
	if (!session?.user) {
		return redirect('/');
	}

	const game = await prisma.game.findUnique({
		where: { id: gameId },
		include: {
			questions: {
				select: {
					id: true,
					question: true,
					options: true,
				},
			},
		},
	});

	if (!game || game.gameType !== 'multiple_choice') {
		return redirect('/quiz');
	}
	const serializableGame = {
		...game,
		timeStarted: game.timeStarted.toISOString(),
		questions: game.questions.map((question) => ({
			...question,
			options: JSON.stringify(question.options),
		})),
	};

	return <MCQ game={serializableGame} />;
};

export default MultipleChoicePage;
