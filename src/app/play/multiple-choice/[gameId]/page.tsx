import React from 'react';
import { getAuthSession } from '@/lib/nextauth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import MCQ from '@/components/MCQ';

type Props = {
	params: {
		gameId: string;
	};
};

const MultipleChoicePage = async ({ params: { gameId } }: Props) => {
	const session = await getAuthSession();
	if (!session?.user) {
		return redirect('/');
	}
	const game = await prisma.game.findUnique({
		where: {
			id: gameId,
		},
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
	return <MCQ game={game} />;
};

export default MultipleChoicePage;
