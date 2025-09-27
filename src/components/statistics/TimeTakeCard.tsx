import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Hourglass } from 'lucide-react';
import { formatTime } from '@/lib/utils';
import { differenceInSeconds } from 'date-fns';

type Props = {
	timeEnded: Date;
	timeStarted: Date;
};

const TimeTakeCard = ({ timeStarted, timeEnded }: Props) => {
	return (
		<Card className="md:col-span-4 border-2 border-[#e6e8ed]">
			<CardHeader className="flex flex-row items-center justify-between pb-2 spacep-y-0">
				<CardTitle className="text-2xl font-bold">Time Taken</CardTitle>
				<Hourglass />
			</CardHeader>
			<CardContent>
				<div className="text-sm font-medium">
					{formatTime(differenceInSeconds(timeEnded, timeStarted))}
				</div>
			</CardContent>
		</Card>
	);
};

export default TimeTakeCard;
