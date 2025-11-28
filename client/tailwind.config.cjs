module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          100: '#DBEAFE',
          500: '#3B82F6',
          600: '#2563EB',
        },
        accent: {
          500: '#F97316',
        },
        success: {
          500: '#16A34A',
        },
        danger: {
          500: '#DC2626',
        },
        neutral: {
          'bg-body': '#F3F4F6',
          surface: '#FFFFFF',
          'border-subtle': '#E5E7EB',
          'text-main': '#111827',
          'text-muted': '#6B7280',
        }
      },
      fontFamily: {
        sans: ['Inter', 'SF Pro Text', 'Roboto', 'ui-sans-serif', 'system-ui'],
      },
      borderRadius: {
        '2xl': '1rem',
      },
    },
  },
  plugins: [],
}
