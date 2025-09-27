import React from 'react';
import {
	Card,
	CardHeader,
	CardDescription,
	CardTitle,
	CardContent,
} from '@/components/ui/card';
import CustomWorldCloud from '@/components/CustomWorldCloud';
import { prisma } from '@/lib/db';
type Props = {};

const HotTopics = async (props: Props) => {
	const topics = await prisma.topicCount.findMany({});
	const formattedTopics = topics.map((topic) => {
		return {
			text: topic.topic,
			value: topic.count,
		};
	});
	return (
		<Card className="hover:cursor-pointer border-2 border-[#e6e8ed] shadow-lg hover:shadow-2xl transition-shadow duration-300 ease-linear">
			<CardHeader>
				<CardTitle className="text-3xl font-bold">Hot Topics</CardTitle>
				<CardDescription>
					Explore trending subjects and stay updated with the latest
				</CardDescription>
			</CardHeader>

			<CardContent className="flex items-center justify-center">
				<CustomWorldCloud formattedTopics={formattedTopics} />
			</CardContent>
		</Card>
	);
};

export default HotTopics;
