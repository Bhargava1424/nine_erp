/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
//   daisyui: {
//     themes: [
//       {
//         mytheme: {
        
// "primary": "#ffffff",
//        },
//       },
//     ],
//   },
theme: {
  extend: {
    colors: {
      'dark-bg': '#303030',
    },
  },
},
  plugins: [require("daisyui")],
}