import React from 'react';
import {
	Card,
	CardHeader,
	CardDescription,
	CardTitle,
	CardContent,
} from '@/components/ui/card';
import CustomWorldCloud from '@/components/CustomWorldCloud';
import './style.css';
type Props = {};

const HotTopics = (props: Props) => {
	return (
		<Card className="card hover:cursor-pointer hover:opacity-75 border-2 border-zinc-100 shadow-lg">
			<CardHeader>
				<CardTitle className="text-2xl font-bold">Hot Topics</CardTitle>
				<CardDescription>
					Explore trending subjects and stay updated with the latest
				</CardDescription>
			</CardHeader>

			<CardContent className="flex items-center justify-center">
				<CustomWorldCloud />
			</CardContent>
		</Card>
	);
};

export default HotTopics;
