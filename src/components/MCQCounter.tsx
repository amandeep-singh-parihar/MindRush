import React from 'react';
import { Card } from './ui/card';
import { Separator } from '@/components/ui/separator';
import { CheckCircle2, XCircle } from 'lucide-react';
type Props = {
	correctAnswers: number;
	wrongAnswers: number;
};

const MCQCounter = ({ correctAnswers, wrongAnswers }: Props) => {
	return (
		<Card className="flex flex-row items-center justify-center p-2 border-1 border-zinc-100 rounded-lg shadow-md">
			<CheckCircle2 color="green" size={30} />
			<span className="mx-2 text-2xl text-[green]">{correctAnswers}</span>
			<Separator orientation="vertical" className="!w-[2px]" />
			<span className="mx-2 text-2xl text-[red]">{wrongAnswers}</span>
			<XCircle color="red" size={30} />
		</Card>
	);
};

export default MCQCounter;
