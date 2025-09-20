import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Hourglass } from 'lucide-react';
import {formatTime } from "@/lib/utils"
import { differenceInSeconds } from 'date-fns';

type Props = {
	timeStarted: Date;
	timeEnded: Date;
};

const TimeTakeCard = ({timeStarted, timeEnded}: Props) => {
	return (
		<Card className="md:col-span-3">
			<CardHeader className="flex flex-row items-center justify-between pb-2 spacep-y-0">
				<CardTitle className="text-2xl font-bold">Time Taken</CardTitle>
				<Hourglass/>
			</CardHeader>
			<CardContent>
				<div className="text-sm font-medium">{formatTime(differenceInSeconds(timeStarted, timeEnded))}</div>
			</CardContent>
		</Card>
	);
};

export default TimeTakeCard;
