import { Question } from '@prisma/client';
import React from 'react';
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '../ui/table';
import { cn } from '@/lib/utils';

type Props = {
	questions: Question[];
};

const QuestionList = ({ questions }: Props) => {
	let gameType = questions[0].questionType;
	return (
		<Table className="mt-4">
			<TableHeader>
				<TableRow>
					<TableHead className="w-[10px]">No.</TableHead>
					<TableHead>Question & Correct Answer</TableHead>
					<TableHead>Your Answer</TableHead>
					{gameType === 'open_ended' && (
						<TableHead className="w-[10px] text-right">Accuracy</TableHead>
					)}
				</TableRow>
			</TableHeader>
			<TableBody>
				<>
					{questions.map((question, idx) => {
						return (
							<TableRow key={question.id}>
								<TableCell className="font-medium">{idx + 1}</TableCell>
								<TableCell className="whitespace-normal break-words">
									{question.question}
									<br />
									<br />
									<span className="font-semibold">{question.answer}</span>
								</TableCell>
								{gameType === 'multiple_choice' && (
									<TableCell
										className={cn({
											'text-green-600': question.isCorrect,
											'text-red-600': !question.isCorrect,
										})}
									>
										{question.userAnswer}
									</TableCell>
								)}
								{gameType === 'open_ended' && (
									<TableCell>{question.userAnswer}</TableCell>
								)}
								{gameType === 'open_ended' && (
									<TableCell className="text-right">
										{(question.percentageCorrect ?? 0) * 100}
									</TableCell>
								)}
							</TableRow>
						);
					})}
				</>
			</TableBody>
			<TableCaption>End of list</TableCaption>
		</Table>
	);
};

export default QuestionList;
