import React from 'react';
import keyword_extractor from 'keyword-extractor';

type Props = {
	answer: string;
	setBlankAnswer: React.Dispatch<React.SetStateAction<string>>;
};

const blanks = '_____';

const BlankAnswerInput = ({ answer, setBlankAnswer }: Props) => {
	const keyWords = React.useMemo(() => {
		const words = keyword_extractor.extract(answer, {
			language: 'english',
			remove_digits: true,
			return_changed_case: false,
			remove_duplicates: false,
		});

		const shuffle = words.sort(() => Math.random() - 0.5);
		return shuffle.slice(0, 2);
	}, [answer]);

	const answerWithBlanks = React.useMemo(() => {
		const answerWithBlanks = keyWords.reduce((acc, keyword) => {
			return acc.replace(keyword, blanks);
		}, answer);
		setBlankAnswer(answerWithBlanks);
		return answerWithBlanks;
	}, [keyWords, answer, setBlankAnswer]);
	// console.log(answerWithBlanks);

	return (
		<div className="flex justify-start w-full mt-4">
			<h1 className="text-xl font-semibold">
				{answerWithBlanks.split(blanks).map((part, idx) => {
					return (
						<>
							{part}
							{idx === answerWithBlanks.split(blanks).length - 1 ? null : (
								<input
									type="text"
									id="user_blank_input"
									className="text-center border-black dark:border-white w-28 border-b-2 focus:outline-none"
								/>
							)}
						</>
					);
				})}
			</h1>
		</div>
	);
};

export default BlankAnswerInput;
