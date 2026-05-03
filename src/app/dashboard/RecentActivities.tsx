import React from 'react';
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
} from '@/components/ui/card';
import { getDbSession } from '@/lib/auth0-db';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import HistoryComponent from '@/components/HistoryComponent';

type Props = {};

const RecentActivities = async (props: Props) => {
	const session = await getDbSession();
	if (!session?.user) {
		return redirect('/');
	}
	const cnt = await prisma.game.count({
		where: {
			userId: session.user.id,
		},
	});
	return (
		<Card className="hover:cursor-pointer border-2 border-[#e6e8ed] shadow-lg hover:shadow-2xl transition-shadow duration-300 ease-linear">
			<CardHeader>
				<CardTitle className="text-3xl font-bold">Recent Activities</CardTitle>
				<CardDescription>
					You have played a total of {cnt} games.
				</CardDescription>
			</CardHeader>

			<CardContent className="max-h-[580px] overflow-y-scroll">
				<HistoryComponent limit={10} userId={session.user.id} />
			</CardContent>
		</Card>
	);
};

export default RecentActivities;
