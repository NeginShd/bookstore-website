import type { Config } from "tailwindcss";
import { fontFamily as defaultFontFamily } from "tailwindcss/defaultTheme";

export default {
    darkMode: ["class"],
    content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    fontFamily: {
      sans: ["var(--font-vazirmatn)", ...defaultFontFamily.sans],
      serif: ["var(--font-vazirmatn)", ...defaultFontFamily.serif],
      mono: defaultFontFamily.mono,
    },
    screens: {
      'xs': '480px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
  	extend: {
  		colors: {
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
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
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
  			},
  			skeleton: 'hsl(var(--skeleton))',
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			},
  			'shimmer': {
  				'0%': {
  					transform: 'translateX(-100%)'
  				},
  				'100%': {
  					transform: 'translateX(100%)'
  				}
  			},
  			'fade-in': {
  				'0%': {
  					opacity: '0',
  					transform: 'translateY(10px)'
  				},
  				'100%': {
  					opacity: '1',
  					transform: 'translateY(0)'
  				}
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out',
  			'shimmer': 'shimmer 1.5s ease-in-out infinite',
  			'fade-in': 'fade-in 0.3s ease-out forwards'
  		},
  		backgroundImage: {
  			'green-gradient': 'linear-gradient(90deg, #022d2b 0%, #22c55e 100%)',
  		},
  	}
  },
  plugins: [
    require("tailwindcss-animate"),
    // RTL support plugin
    function({ addUtilities }: { addUtilities: any }) {
      addUtilities({
        '.rtl': {
          direction: 'rtl',
        },
        '.ltr': {
          direction: 'ltr',
        },
        // Logical property utilities for RTL support
        '.ps-2': { 'padding-inline-start': '0.5rem' },
        '.ps-3': { 'padding-inline-start': '0.75rem' },
        '.ps-4': { 'padding-inline-start': '1rem' },
        '.ps-5': { 'padding-inline-start': '1.25rem' },
        '.ps-6': { 'padding-inline-start': '1.5rem' },
        '.ps-8': { 'padding-inline-start': '2rem' },
        '.ps-12': { 'padding-inline-start': '3rem' },
        '.ps-14': { 'padding-inline-start': '3.5rem' },
        '.pe-2': { 'padding-inline-end': '0.5rem' },
        '.pe-3': { 'padding-inline-end': '0.75rem' },
        '.pe-4': { 'padding-inline-end': '1rem' },
        '.pe-5': { 'padding-inline-end': '1.25rem' },
        '.pe-6': { 'padding-inline-end': '1.5rem' },
        '.pe-8': { 'padding-inline-end': '2rem' },
        '.pe-12': { 'padding-inline-end': '3rem' },
        '.pe-14': { 'padding-inline-end': '3.5rem' },
        '.ms-1': { 'margin-inline-start': '0.25rem' },
        '.ms-1\\.5': { 'margin-inline-start': '0.375rem' },
        '.ms-2': { 'margin-inline-start': '0.5rem' },
        '.ms-3': { 'margin-inline-start': '0.75rem' },
        '.ms-4': { 'margin-inline-start': '1rem' },
        '.me-1': { 'margin-inline-end': '0.25rem' },
        '.me-1\\.5': { 'margin-inline-end': '0.375rem' },
        '.me-2': { 'margin-inline-end': '0.5rem' },
        '.me-3': { 'margin-inline-end': '0.75rem' },
        '.me-4': { 'margin-inline-end': '1rem' },
        '.start-0': { 'inset-inline-start': '0' },
        '.start-4': { 'inset-inline-start': '1rem' },
        '.start-5': { 'inset-inline-start': '1.25rem' },
        '.end-0': { 'inset-inline-end': '0' },
        '.end-4': { 'inset-inline-end': '1rem' },
        '.end-5': { 'inset-inline-end': '1.25rem' },
        '.text-start': { 'text-align': 'start' },
        '.text-end': { 'text-align': 'end' },
      })
    }
  ],
} satisfies Config;
