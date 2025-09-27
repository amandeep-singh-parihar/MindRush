import QuizCreation from '@/components/QuizCreation';
import { getAuthSession } from '@/lib/nextauth';
import { redirect } from 'next/navigation';
import React from 'react';

type Props = {
	searchParams: {
		topic?: string | string[];
	};
};

export const metadata = {
	title: 'Quiz | MindRush',
};

const QuizPage = async ({ searchParams }: Props) => {
	const session = await getAuthSession();
	if (!session?.user) {
		return redirect('/');
	}

	const topic = searchParams?.topic;
	const topicParam = Array.isArray(topic) ? topic[0] : (topic ?? '');

	return <QuizCreation topicParam={topicParam} />;
};

export default QuizPage;
