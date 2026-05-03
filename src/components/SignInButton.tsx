'use client';

import React from 'react';
import { Button } from './ui/button';

type Props = {
	text: string;
};

const SignInButton = ({ text }: Props) => {
	return (
		<Button
			className="cursor-pointer"
			asChild
		>
			<a href="/auth/login">{text}</a>
		</Button>
	);
};

export default SignInButton;
