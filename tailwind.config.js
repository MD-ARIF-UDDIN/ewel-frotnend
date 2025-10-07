/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    content: [
        './pages/**/*.{js,jsx}',
        './components/**/*.{js,jsx}',
        './app/**/*.{js,jsx}',
        './src/**/*.{js,jsx}',
    ],
    prefix: "",
    theme: {
        container: {
            center: true,
            padding: "2rem",
            screens: {
                "2xl": "1400px",
            },
        },
        extend: {
            fontFamily: {
                'inter': ['Inter', 'sans-serif'],
                'poppins': ['Poppins', 'sans-serif'],
                'sans': ['Inter', 'system-ui', 'sans-serif'],
            },
            colors: {
                border: "hsl(var(--border))",
                "border-light": "hsl(var(--border-light))",
                "border-dark": "hsl(var(--border-dark))",
                input: "hsl(var(--input))",
                "input-focus": "hsl(var(--input-focus))",
                ring: "hsl(var(--ring))",
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                surface: "hsl(var(--surface))",
                "surface-hover": "hsl(var(--surface-hover))",
                "surface-active": "hsl(var(--surface-active))",
                "surface-variant": "hsl(var(--surface-variant))",
                primary: {
                    DEFAULT: "hsl(var(--primary))",
                    foreground: "hsl(var(--primary-foreground))",
                    hover: "hsl(var(--primary-hover))",
                    light: "hsl(var(--primary-light))",
                    dark: "hsl(var(--primary-dark))",
                },
                secondary: {
                    DEFAULT: "hsl(var(--secondary))",
                    foreground: "hsl(var(--secondary-foreground))",
                    hover: "hsl(var(--secondary-hover))",
                    light: "hsl(var(--secondary-light))",
                    dark: "hsl(var(--secondary-dark))",
                },
                destructive: {
                    DEFAULT: "hsl(var(--destructive))",
                    foreground: "hsl(var(--destructive-foreground))",
                    light: "hsl(var(--destructive-light))",
                    dark: "hsl(var(--destructive-dark))",
                },
                success: {
                    DEFAULT: "hsl(var(--success))",
                    foreground: "hsl(var(--success-foreground))",
                    light: "hsl(var(--success-light))",
                    dark: "hsl(var(--success-dark))",
                },
                warning: {
                    DEFAULT: "hsl(var(--warning))",
                    foreground: "hsl(var(--warning-foreground))",
                    light: "hsl(var(--warning-light))",
                    dark: "hsl(var(--warning-dark))",
                },
                info: {
                    DEFAULT: "hsl(var(--info))",
                    foreground: "hsl(var(--info-foreground))",
                    light: "hsl(var(--info-light))",
                    dark: "hsl(var(--info-dark))",
                },
                muted: {
                    DEFAULT: "hsl(var(--muted))",
                    foreground: "hsl(var(--muted-foreground))",
                    hover: "hsl(var(--muted-hover))",
                    light: "hsl(var(--muted-light))",
                    dark: "hsl(var(--muted-dark))",
                },
                accent: {
                    DEFAULT: "hsl(var(--accent))",
                    foreground: "hsl(var(--accent-foreground))",
                    hover: "hsl(var(--accent-hover))",
                    light: "hsl(var(--accent-light))",
                    dark: "hsl(var(--accent-dark))",
                },
                popover: {
                    DEFAULT: "hsl(var(--popover))",
                    foreground: "hsl(var(--popover-foreground))",
                },
                card: {
                    DEFAULT: "hsl(var(--card))",
                    foreground: "hsl(var(--card-foreground))",
                },
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
            },
            boxShadow: {
                'modern': 'var(--shadow-md)',
                'modern-lg': 'var(--shadow-lg)',
                'modern-xl': 'var(--shadow-xl)',
            },
            backgroundImage: {
                'gradient-primary': 'var(--gradient-primary)',
                'gradient-secondary': 'var(--gradient-secondary)',
                'gradient-accent': 'var(--gradient-accent)',
            },
            keyframes: {
                "accordion-down": {
                    from: { height: "0" },
                    to: { height: "var(--radix-accordion-content-height)" },
                },
                "accordion-up": {
                    from: { height: "var(--radix-accordion-content-height)" },
                    to: { height: "0" },
                },
                "fade-in": {
                    "0%": { opacity: "0" },
                    "100%": { opacity: "1" },
                },
                "slide-up": {
                    "0%": { transform: "translateY(20px)", opacity: "0" },
                    "100%": { transform: "translateY(0)", opacity: "1" },
                },
                "bounce-in": {
                    "0%": { transform: "scale(0.3)", opacity: "0" },
                    "50%": { transform: "scale(1.05)" },
                    "70%": { transform: "scale(0.9)" },
                    "100%": { transform: "scale(1)", opacity: "1" },
                },
                "shimmer": {
                    "0%": { backgroundPosition: "-1000px 0" },
                    "100%": { backgroundPosition: "1000px 0" },
                },
            },
            animation: {
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
                "fade-in": "fade-in 0.5s ease-in-out",
                "slide-up": "slide-up 0.3s ease-out",
                "bounce-in": "bounce-in 0.6s ease-out",
                "shimmer": "shimmer 2s infinite linear",
            },
        },
    },
    plugins: [require("tailwindcss-animate")],
}


