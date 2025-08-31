import React from 'react';
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
} from '@/components/ui/card';

type Props = {};

const RecentActivities = (props: Props) => {
	return (
		<Card className="hover:cursor-pointer hover:opacity-75 border-2 border-zinc-100 shadow-lg">
			<CardHeader>
				<CardTitle className="text-2xl font-bold">Recent Activities</CardTitle>
				<CardDescription>You have player a total of 5 quizzes.</CardDescription>
			</CardHeader>

			<CardContent className="max-h-[580px] overflow-y-scroll">
				all history here
			</CardContent>
		</Card>
	);
};

export default RecentActivities;
