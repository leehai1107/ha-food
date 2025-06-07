import type { Config } from "tailwindcss";

export default {
    darkMode: ["class"],
    content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		colors: {
			primary: 'var(--color-primary)',
			secondary: 'var(--color-secondary)',
			accent: 'var(--color-accent)',
			text: 'var(--color-text)',
			link: 'var(--color-link)',
			border: 'var(--color-border)',
			'primary-white': 'var(--color-primary-white)',
			'primary-black': 'var(--color-primary-black)',
			'dark-red':'var(--color-dark-red)',
			'dark-yellow':'var(--color-dark-yellow)',
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			},
  			sidebar: {
  				DEFAULT: 'hsl(var(--sidebar-background))',
  				foreground: 'hsl(var(--sidebar-foreground))',
  				primary: 'hsl(var(--sidebar-primary))',
  				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
  				accent: 'hsl(var(--sidebar-accent))',
  				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
  				border: 'hsl(var(--sidebar-border))',
  				ring: 'hsl(var(--sidebar-ring))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
		  keyframes: {
			'float-in-bottom': {
			  '0%': { opacity: '0', transform: 'translateY(30px)' },
			  '100%': { opacity: '1', transform: 'translateY(0)' },
			},
			'float-in-top': {
				'0%': { opacity: '0', transform: 'translateY(-30px)' },
				'100%': { opacity: '1', transform: 'translateY(0)' },
			},
		  },
		  animation: {
			'float-in-bottom': 'float-in-bottom 0.6s ease-out forwards',
			'float-in-top': 'float-in-top 0.6s ease-out forwards',
			'slide-down': 'slideDown 0.3s ease-out',
		  },
  	}
  },
  plugins: [require("tailwindcss-animate"), require('@tailwindcss/typography'),require('tailwind-scrollbar-hide')],
} satisfies Config;
