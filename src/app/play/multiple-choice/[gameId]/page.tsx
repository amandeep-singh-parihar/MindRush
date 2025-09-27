import React from 'react';
import { getAuthSession } from '@/lib/nextauth';
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

	const session = await getAuthSession();
	if (!session?.user) {
		redirect('/'); // no need to return
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
		redirect('/quiz');
	}

	return <MCQ game={game} />;
};

export default MultipleChoicePage;
