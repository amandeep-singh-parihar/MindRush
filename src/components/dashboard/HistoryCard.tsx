'use client';
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { History } from 'lucide-react';
import { useRouter } from 'next/navigation';

type Props = {};

const HistoryCard = (props: Props) => {
	const router = useRouter();
	return (
		<Card
			className="hover:cursor-pointer border-2 border-[#e6e8ed] shadow-lg hover:shadow-2xl transition-shadow duration-300 ease-linear"
			onClick={() => router.push('/history')}
		>
			<CardHeader className="flex flex-row items-center justify-between space-y-0">
				<CardTitle className="text-3xl font-bold">History</CardTitle>
				<History size={28} strokeWidth={2.5} />
			</CardHeader>

			<CardContent>
				<p className="text-sm text-muted-foreground">
					View your past quizzes and track your learning progress over time.
				</p>
			</CardContent>
		</Card>
	);
};

export default HistoryCard;
