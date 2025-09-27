import React, { useState, useEffect, useMemo } from 'react';
import keyword_extractor from 'keyword-extractor';

type Props = {
	answer: string;
	onAnswerChange: (answer: string) => void;
};

const blanks = '_____';

const BlankAnswerInput = ({ answer, onAnswerChange }: Props) => {
	const keywords = useMemo(() => {
		const words = keyword_extractor.extract(answer, {
			language: 'english',
			remove_digits: true,
			return_changed_case: false,
			remove_duplicates: false,
		});
		return words.sort(() => Math.random() - 0.5).slice(0, 2);
	}, [answer]);

	const answerWithBlanks = useMemo(() => {
		return keywords.reduce((acc, keyword) => {
			return acc.replace(keyword, blanks);
		}, answer);
	}, [keywords, answer]);

	const [userInputs, setUserInputs] = useState<string[]>([]);

	useEffect(() => {
		setUserInputs(Array(keywords.length).fill(''));
		onAnswerChange(answerWithBlanks);
	}, [answerWithBlanks, keywords.length, onAnswerChange]);

	useEffect(() => {
		let filledAnswer = answerWithBlanks;
		userInputs.forEach((input) => {
			filledAnswer = filledAnswer.replace(blanks, input);
		});
		onAnswerChange(filledAnswer);
	}, [userInputs, answerWithBlanks, onAnswerChange]);

	const handleInputChange = (index: number, value: string) => {
		setUserInputs((prevInputs) => {
			const newInputs = [...prevInputs];
			newInputs[index] = value;
			return newInputs;
		});
	};

	const parts = useMemo(
		() => answerWithBlanks.split(blanks),
		[answerWithBlanks],
	);

	return (
		<div className="flex justify-start w-full mt-4">
			<h1 className="text-xl font-semibold leading-loose">
				{parts.map((part, idx) => (
					<React.Fragment key={idx}>
						{part}
						{idx < parts.length - 1 && (
							<input
								type="text"
								className="text-center border-black dark:border-white w-28 border-b-2 focus:outline-none bg-transparent mx-2"
								value={userInputs[idx] || ''}
								onChange={(e) => handleInputChange(idx, e.target.value)}
							/>
						)}
					</React.Fragment>
				))}
			</h1>
		</div>
	);
};

export default BlankAnswerInput;
