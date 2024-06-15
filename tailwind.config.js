// tailwind.config.js
module.exports = {
  content: [
      "./src/**/*.{js,jsx,ts,tsx}",
      'node_modules/flowbite-react/lib/esm/**/*.js',
  ],
  theme: {
      extend: {
          colors: {
              'custom-green': '#53a079',
          },
      },
  },
  plugins: [
    
  ],
}
