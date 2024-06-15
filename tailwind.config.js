// tailwind.config.js
module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'custom-green': '#5CDB95',
                'custom-darkgreen': '#379652',
                'custom-blue': '#05386B',
                'custom-lightblue': '#EDF5E1',
            },
        },
    },
    plugins: [],
}
