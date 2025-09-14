module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}', 
    './components/**/*.{js,ts,jsx,tsx}',
    './node_modules/@shadcn/ui/**/*.{js,ts,jsx,tsx}' // Include ShadCN UI's components
  ],
  theme: {
    extend: {
      colors: {
        "primary-yellow": "#FFB900",
        "primary-black": "#000000",
      },
      keyframes: {
        slide: {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(-100%)" },
        },
      },
      animation: {
        "slide-infinite": "slide 10s linear infinite",
      },
    
    },
  },
  plugins: [],
}
