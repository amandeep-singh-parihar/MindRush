import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Hourglass } from 'lucide-react';
import { formatTime } from '@/lib/utils';
import { differenceInSeconds } from 'date-fns';

type Props = {
	timeEnded: Date | null;
	timeStarted: Date;
};

const TimeTakeCard = ({ timeStarted, timeEnded }: Props) => {
	if (!timeEnded) {
		return (
			<Card className="md:col-span-4 border-2 border-[#e6e8ed]">
				<CardHeader className="flex flex-row items-center justify-between pb-2">
					<CardTitle className="text-2xl font-bold">Time Taken</CardTitle>
					<Hourglass />
				</CardHeader>
				<CardContent>
					<div className="text-sm font-medium">In progress...</div>
				</CardContent>
			</Card>
		);
	}

	const seconds = differenceInSeconds(timeEnded, timeStarted);

	return (
		<Card className="md:col-span-4 border-2 border-[#e6e8ed]">
			<CardHeader className="flex flex-row items-center justify-between pb-2">
				<CardTitle className="text-2xl font-bold">Time Taken</CardTitle>
				<Hourglass />
			</CardHeader>
			<CardContent>
				<div className="text-sm font-medium">{formatTime(seconds)}</div>
			</CardContent>
		</Card>
	);
};

export default TimeTakeCard;
