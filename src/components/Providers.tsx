'use client';

import { SessionProvider } from 'next-auth/react';
import {
	ThemeProvider as NextThemesProvider,
	ThemeProvider,
} from 'next-themes';
import * as React from 'react';

type Props = {
	children: React.ReactNode;
};

const providers = ({ children }: Props) => {
	return (
		<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
			<SessionProvider>{children}</SessionProvider>;
		</ThemeProvider>
	);
};

export default providers;
