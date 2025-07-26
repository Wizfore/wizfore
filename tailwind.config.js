/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
  	container: {
  		center: true,
  		padding: '2rem',
  		screens: {
  			'2xl': '1400px'
  		}
  	},
  	extend: {
  		colors: {
  			'light-peach': '#FEF3EF',
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
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
  			wizfore: {
  				white: '#FFFFFF',
  				'warm-beige': '#FEFBF6',
  				'light-beige': '#FDF8F0',
  				'coral-primary': '#FF7A59',
  				'coral-secondary': '#FF8C69',
  				'coral-light': '#FFA585',
  				'coral-accent': '#FFB896',
  				'soft-pink': '#FFEDE4',
  				'cream-pink': '#FFF9F4',
  				'light-coral': '#FFCAB0',
  				'warm-brown': '#D4A574',
  				'text-primary': '#2F2F2F',
  				'text-secondary': '#555555',
  				'text-light': '#777777',
  				'text-brand': '#FF7A59'
  			},
  			mindstory: {
  				lime: '#FF6B6B',
  				'lime-dark': '#FF8A80',
  				'lime-light': '#FFAA9D',
  				blue: '#2196F3',
  				green: '#4CAF50',
  				orange: '#FF9800',
  				pink: '#E91E63',
  				purple: '#9C27B0',
  				teal: '#009688',
  				'gray-warm': '#FFE0E0',
  				'gray-text': '#333333',
  				'gray-light': '#FFFAF0'
  			},
  			gcf: {
  				primary: 'hsl(var(--gcf-primary))',
  				'primary-foreground': 'hsl(var(--gcf-primary-foreground))',
  				secondary: 'hsl(var(--gcf-secondary))',
  				'secondary-foreground': 'hsl(var(--gcf-secondary-foreground))',
  				accent: 'hsl(var(--gcf-accent))',
  				'accent-foreground': 'hsl(var(--gcf-accent-foreground))',
  				background: 'hsl(var(--gcf-background))',
  				muted: 'hsl(var(--gcf-muted))',
  				'muted-foreground': 'hsl(var(--gcf-muted-foreground))',
  				border: 'hsl(var(--gcf-border))',
  				card: 'hsl(var(--gcf-card))',
  				'card-foreground': 'hsl(var(--gcf-card-foreground))',
  			},
  			seasonal: {
  				'spring-primary': 'hsl(var(--seasonal-spring-primary))',
  				'spring-accent': 'hsl(var(--seasonal-spring-accent))',
  				'summer-primary': 'hsl(var(--seasonal-summer-primary))',
  				'summer-accent': 'hsl(var(--seasonal-summer-accent))',
  				'autumn-primary': 'hsl(var(--seasonal-autumn-primary))',
  				'autumn-accent': 'hsl(var(--seasonal-autumn-accent))',
  				'winter-primary': 'hsl(var(--seasonal-winter-primary))',
  				'winter-accent': 'hsl(var(--seasonal-winter-accent))',
  			},
  			heart: {
  				primary: 'hsl(var(--heart-primary))',
  				'primary-hover': 'hsl(var(--heart-primary-hover))',
  				'primary-foreground': 'hsl(var(--heart-primary-foreground))',
  				background: 'hsl(var(--heart-background))',
  				bright: 'hsl(var(--heart-bright))',
  				body: 'hsl(var(--heart-body))',
  				gray: 'hsl(var(--heart-gray))',
  				light: 'hsl(var(--heart-light))',
  				line: 'hsl(var(--heart-line))',
  				dark: 'hsl(var(--heart-dark))',
  				'dark-bg': 'hsl(var(--heart-dark-bg))',
  				'white-bg': 'hsl(var(--heart-white-bg))',
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
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		fontFamily: {
  			sans: [
  				'Pretendard Variable',
  				'Pretendard',
  				'Noto Sans KR',
  				'Apple SD Gothic Neo',
  				'Malgun Gothic',
  				'-apple-system',
  				'BlinkMacSystemFont',
  				'system-ui',
  				'Roboto',
  				'sans-serif'
  			],
  			serif: [
  				'Noto Serif KR', 
  				'serif'
  			],
  			mono: [
  				'JetBrains Mono',
  				'Fira Code',
  				'ui-monospace',
  				'SFMono-Regular',
  				'SF Mono',
  				'monospace'
  			]
  		},
  		boxShadow: {
  			'gcf-xs': 'var(--gcf-shadow-xs)',
  			'gcf-sm': 'var(--gcf-shadow-sm)',
  			'gcf-md': 'var(--gcf-shadow-md)',
  			'gcf-lg': 'var(--gcf-shadow-lg)',
  			'gcf-xl': 'var(--gcf-shadow-xl)',
  			'heart-subtle': 'var(--heart-shadow-subtle)',
  			'heart-card': 'var(--heart-shadow-card)',
  			'heart-elevated': 'var(--heart-shadow-elevated)',
  			'heart-deep': 'var(--heart-shadow-deep)',
  		},
  		borderRadius: {
  			'heart-sm': 'var(--heart-radius-sm)',
  			'heart': 'var(--heart-radius)',
  			'heart-lg': 'var(--heart-radius-lg)',
  			'heart-xl': 'var(--heart-radius-xl)',
  			'heart-2xl': 'var(--heart-radius-2xl)',
  			'heart-full': 'var(--heart-radius-full)',
  		},
  		keyframes: {
  			marquee: {
  				from: {
  					transform: 'translateX(0)'
  				},
  				to: {
  					transform: 'translateX(calc(-100% - var(--gap)))'
  				}
  			},
  			'marquee-vertical': {
  				from: {
  					transform: 'translateY(0)'
  				},
  				to: {
  					transform: 'translateY(calc(-100% - var(--gap)))'
  				}
  			}
  		},
  		animation: {
  			marquee: 'marquee var(--duration) linear infinite',
  			'marquee-vertical': 'marquee-vertical var(--duration) linear infinite'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
}
