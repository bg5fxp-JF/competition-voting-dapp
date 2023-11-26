/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/components/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		screens: {
			xxs: "375px",
			xs: "380px",
			sm: "480px",
			md: "768px",
			lg: "976px",
			xl: "1440px",
		},

		fontFamily: {
			Roboto: ["Roboto", "sans-serif"],
		},
		fontSize: {
			"2xsm": "10px",
			xsm: "12px",
			sm: "13px",
			reg: "15px",
			lg: "18px",
			"2xl": "22px",
			"3xl": "25px",
			"4xl": "32px",
			"5xl": "40px",
			"6xl": "50px",
			"7xl": "70px",
			"8xl": "80px",
			"9xl": "80px",
			"10xl": "100px",
		},
		extend: {
			colors: {
				primaryColor: "#A4EBF3",
				secondaryColor: "#CCF2F4",
				accent1: "#AAAAAA",
				accent2: "#36454F",
			},
		},
	},
	plugins: [],
};
