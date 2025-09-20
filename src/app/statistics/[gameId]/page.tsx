import AccuracyCard from '@/components/statistics/AccuracyCard';
import QuestionList from '@/components/statistics/QuestionList';
import ResultCard from '@/components/statistics/ResultCard';
import TimeTakeCard from '@/components/statistics/TimeTakeCard';
import { buttonVariants } from '@/components/ui/button';
import { prisma } from '@/lib/db';
import { getAuthSession } from '@/lib/nextauth';
import { LucideLayoutDashboard } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import React from 'react';

type Props = {
	params: {
		gameId: string;
	};
};

const page = async ({ params: { gameId } }: Props) => {
	const session = await getAuthSession();
	if (!session?.user) {
		redirect('/');
	}

	const game = await prisma.game.findUnique({
		where: {
			id: gameId,
		},
		include: {
			questions: true,
		},
	});
	if (!game) {
		redirect('/quiz');
	}

	let accuracy: number = 0;
	if (game.gameType === 'multiple_choice') {
		let totalCorrect = game.questions.reduce((acc, question) => {
			if (question.isCorrect) {
				return acc + 1;
			}
			return acc;
		}, 0);
		accuracy = (totalCorrect / game.questions.length) * 100;
	} else if (game.gameType === 'open_ended') {
		let totalPercentage = game.questions.reduce((acc, question) => {
			return acc + (question.percentageCorrect || 0);
		}, 0);

		accuracy = (totalPercentage / game.questions.length) * 100;
	}

	accuracy = Math.round(accuracy * 100) / 100;

	return (
		<>
			<div className="p-8 mx-auto max-w-7xl">
				<div className="flex items-center justify-between space-y-2">
					<h2 className="text-3xl font-bold tracking-tight">Statistics</h2>
					<div className="flex items-center space-x-2">
						<Link href="/dashboard" className={buttonVariants()}>
							<LucideLayoutDashboard />
							Back to Dashboard
						</Link>
					</div>
				</div>

				<div className="grid gap-4 mt-4 md:grid-cols-8">
					<ResultCard accuracy={accuracy} />
					<AccuracyCard accuracy={accuracy} />
					<TimeTakeCard timeEnded={new Date()} timeStarted={game.timeStarted} />
				</div>

				<QuestionList questions={game.questions} />
			</div>
		</>
	);
};

export default page;
