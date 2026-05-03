import React from 'react';
import { getDbSession } from '@/lib/auth0';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import OEP from '@/components/OEP';

type Props = {
	params: {
		gameId: string;
	};
};

const OpenEndedPage = async ({ params: { gameId } }: Props) => {
	const session = await getDbSession();
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
					answer: true,
				},
			},
		},
	});
	if (!game || game.gameType !== 'open_ended') {
		return redirect('/quiz');
	}
	return <OEP game={game} />;
};

export default OpenEndedPage;
