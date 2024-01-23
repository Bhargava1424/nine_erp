module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        'dark-bg': '#303030',
      },
    },
  },
  daisyui: {
    themes: [
      "light",
      // other themes you might want to include
    ],
  },
  plugins: [require("daisyui")],
}
