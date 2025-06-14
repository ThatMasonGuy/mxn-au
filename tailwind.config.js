const animate = require("tailwindcss-animate")

/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: ["class"],
	safelist: ["dark"],
	prefix: "",

	content: [
		'./pages/**/*.{js,jsx,vue}',
		'./components/**/*.{js,jsx,vue}',
		'./app/**/*.{js,jsx,vue}',
		'./src/**/*.{js,jsx,vue}',
	],

	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontSize: {
				sm: '0.750rem',
				base: '1rem',
				xl: '1.333rem',
				'2xl': '1.777rem',
				'3xl': '2.369rem',
				'4xl': '3.158rem',
				'5xl': '4.210rem'
			},
			fontFamily: {
				heading: 'Rubik',
				body: 'Noto Sans Display'
			},
			fontWeight: {
				normal: '400',
				bold: '700'
			},
			height: {
				screen: '100dvh',
			},
			minHeight: {
				screen: '100dvh',
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					'50': 'var(--primary-50)',
					'100': 'var(--primary-100)',
					'200': 'var(--primary-200)',
					'300': 'var(--primary-300)',
					'400': 'var(--primary-400)',
					'500': 'var(--primary-500)',
					'600': 'var(--primary-600)',
					'700': 'var(--primary-700)',
					'800': 'var(--primary-800)',
					'900': 'var(--primary-900)',
					'950': 'var(--primary-950)',
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					'50': 'var(--secondary-50)',
					'100': 'var(--secondary-100)',
					'200': 'var(--secondary-200)',
					'300': 'var(--secondary-300)',
					'400': 'var(--secondary-400)',
					'500': 'var(--secondary-500)',
					'600': 'var(--secondary-600)',
					'700': 'var(--secondary-700)',
					'800': 'var(--secondary-800)',
					'900': 'var(--secondary-900)',
					'950': 'var(--secondary-950)',
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					'50': 'var(--accent-50)',
					'100': 'var(--accent-100)',
					'200': 'var(--accent-200)',
					'300': 'var(--accent-300)',
					'400': 'var(--accent-400)',
					'500': 'var(--accent-500)',
					'600': 'var(--accent-600)',
					'700': 'var(--accent-700)',
					'800': 'var(--accent-800)',
					'900': 'var(--accent-900)',
					'950': 'var(--accent-950)',
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				text: {
					'50': 'var(--text-50)',
					'100': 'var(--text-100)',
					'200': 'var(--text-200)',
					'300': 'var(--text-300)',
					'400': 'var(--text-400)',
					'500': 'var(--text-500)',
					'600': 'var(--text-600)',
					'700': 'var(--text-700)',
					'800': 'var(--text-800)',
					'900': 'var(--text-900)',
					'950': 'var(--text-950)'
				},
				chart: {
					'1': 'hsl(var(--chart-1))',
					'2': 'hsl(var(--chart-2))',
					'3': 'hsl(var(--chart-3))',
					'4': 'hsl(var(--chart-4))',
					'5': 'hsl(var(--chart-5))'
				}
			},
			borderRadius: {
				xl: 'calc(var(--radius) + 4px)',
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: 0
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
						height: 0
					}
				},
				'collapsible-down': {
					from: {
						height: 0
					},
					to: {
						height: 'var(--radix-collapsible-content-height)'
					}
				},
				'collapsible-up': {
					from: {
						height: 'var(--radix-collapsible-content-height)'
					},
					to: {
						height: 0
					}
				},
				'hue': {
					from: {
						filter: 'hue-rotate(0deg)'
					},
					to: {
						filter: 'hue-rotate(360deg)'
					}
				},
				'gradientShift': {
					'0%': { backgroundPosition: '0% 50%' },
					'50%': { backgroundPosition: '100% 50%' },
					'100%': { backgroundPosition: '0% 50%' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'collapsible-down': 'collapsible-down 0.2s ease-in-out',
				'collapsible-up': 'collapsible-up 0.2s ease-in-out',
				'hue': 'hue 6s linear infinite',
				'score-gradient': 'gradientShift 8s linear infinite'
			}
		}
	},
	plugins: [animate, require("tailwindcss-animate"), require('@tailwindcss/typography')],
}