'use client';

import { SessionProvider } from 'next-auth/react';
import {
	ThemeProvider as NextThemesProvider,
	ThemeProvider,
} from 'next-themes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as React from 'react';

type Props = {
	children: React.ReactNode;
};

const providers = ({ children }: Props) => {
	const [queryClient] = React.useState(() => new QueryClient());
	return (
		<ThemeProvider attribute="class" defaultTheme="light" enableSystem>
			<SessionProvider>
				<QueryClientProvider client={queryClient}>
					{children}
				</QueryClientProvider>
			</SessionProvider>
		</ThemeProvider>
	);
};

export default providers;
