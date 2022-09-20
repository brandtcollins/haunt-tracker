/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "darkGray-500": "#0E1011",
        "darkGray-300": "#212427",
        "darkGray-100": "#323538",
      },
      backgroundImage: {
        "TheWeeknd:AfterHoursNightmare":
          "url('../public/images/the-weeknd-after-hours.jpeg')",
        Halloween: "url('../public/images/halloween-michael-myers.jpeg')",
        TheHorrorsofBlumhouse:
          "url('../public/images/horrors-of-blumhouse.jpeg')",
        "UniversalMonsters:LegendsCollide":
          "url('../public/images/universal-monsters-legends-collide.jpeg')",
        SpiritsoftheCoven: "url('../public/images/spirits-of-the-coven.jpeg')",
        "Bugs:EatenAlive": "url('../public/images/bugs-eaten-alive.jpeg')",
        FiestadeChupacabras:
          "url('../public/images/fiesta-de-chupacabras.jpeg')",
        HellblockHorror: "url('../public/images/hellblock-of-horror.jpeg')",
        DescendantsofDestruction:
          "url('../public/images/descendants-of-destruction.jpeg')",
        "DeadMan’sPier:Winter’sWake":
          "url('../public/images/dead-mans-pier-winters-wake.jpeg')",
      },
    },
    plugins: [require("@tailwindcss/forms")],
  },
};
