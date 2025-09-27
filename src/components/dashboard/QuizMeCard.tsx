'use client';
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { BrainCircuit } from 'lucide-react';
import { useRouter } from 'next/navigation';
type Props = {};

const QuizMeCard = (props: Props) => {
	const router = useRouter();

	return (
		<Card
			className="hover:cursor-pointer border-2 border-[#e6e8ed] shadow-lg hover:shadow-2xl transition-shadow duration-300 ease-linear"
			onClick={() => router.push('/quiz')}
		>
			<CardHeader className="flex flex-row items-center justify-between space-y-0">
				<CardTitle className="text-3xl font-bold">Quiz Me!</CardTitle>
				<BrainCircuit size={28} strokeWidth={2.5} />
			</CardHeader>

			<CardContent>
				<p className="text-sm text-muted-foreground">
					Challenge yourself with a quick quiz to test your knowledge and
					reinforce learning.
				</p>
			</CardContent>
		</Card>
	);
};

export default QuizMeCard;
