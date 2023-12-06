import "./globals.css";
import Navbar from "./components/Navbar";
import { Providers } from "./providers";
import UserDetails from "./components/UserDetails";
import { ThemeProvider } from "@/components/ThemeProvider";
import ToggleMode from "./components/ToggleMode";
import ApprovedContextProvider from "./context/ApprovedContext";
import { Toaster } from "@/components/ui/toaster";

export const metadata = {
	title: "Competition Voting DApp",
	description: "Set up competitions, vote and see the winner(s)",
};

export default function RootLayout({ children }) {
	return (
		<html lang="en">
			<body>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					<Providers>
						<ApprovedContextProvider>
							<Navbar />
							<UserDetails />
							{children}
							<Toaster />
							<ToggleMode />
						</ApprovedContextProvider>
					</Providers>
				</ThemeProvider>
			</body>
		</html>
	);
}
