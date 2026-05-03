import React from 'react';
import { redirect } from 'next/navigation';
import { getDbSession } from '@/lib/auth0';
import QuizMeCard from '@/components/dashboard/QuizMeCard';
import HistoryCard from '@/components/dashboard/HistoryCard';
import HotTopics from './HotTopics';
import RecentActivities from './RecentActivities';

type Props = {};

export const metadata = {
	title: 'Dashboard - Mindrush',
};

const Dashboard = async (props: Props) => {
	const session = await getDbSession();
	if (!session?.user) {
		return redirect('/');
	}

	return (
		<main className="p-8 mx-auto max-w-7xl">
			<div className="flex items-center">
				<h2 className="mr-2 text-3xl font-bold tracking-tight">Dashboard</h2>
			</div>

			{/* First row */}
			<div className="grid gap-4 mt-4 md:grid-cols-2">
				<QuizMeCard />
				<HistoryCard />
			</div>

			{/* Second row */}
			<div className="grid gap-4 mt-4 md:grid-cols-2 lg:grid-cols-7">
				{/* HotTopics takes more space */}
				<div className="md:col-span-1 lg:col-span-4">
					<HotTopics />
				</div>

				{/* RecentActivities takes less space */}
				<div className="md:col-span-1 lg:col-span-3">
					<RecentActivities />
				</div>
			</div>
		</main>
	);
};

export default Dashboard;
