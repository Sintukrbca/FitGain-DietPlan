# FitGain Diet Planner

FitGain is a responsive diet and calorie-planning web app built with Node.js, Express, and EJS. It estimates key body metrics and daily nutrition targets, then provides sample meal ideas and an approximate 30-day grocery list.

## Features

- Calculate BMI, BMR, and estimated TDEE.
- Set a calorie target for weight gain, maintenance, or weight loss.
- View estimated daily protein, carbohydrate, and fat targets.
- Explore vegetarian or non-vegetarian meal ideas.
- Generate a sample 30-day grocery list with illustrative prices in INR.
- Print or save the results as a PDF from your browser.

## Built with

- Node.js and Express
- EJS templates
- HTML, CSS, and vanilla JavaScript

## Getting started

### Prerequisites

- Node.js 18 or later
- npm

### Install and run

```bash
npm install
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

To run in development mode with automatic restarts:

```bash
npm run dev
```

The server uses port `3000` by default. Set the `PORT` environment variable to use a different port.

## How to use

1. Enter your age, height, weight, gender, and activity level.
2. Select a weight goal, dietary preference, and monthly food budget.
3. Choose **Calculate my plan** to view your estimates and sample plan.
4. Use **Print / Save PDF** to save or print the results.

## Project structure

```text
fitgain_diet_planner/
├── app.js                 # Express server and calculation logic
├── package.json           # Project metadata and npm scripts
├── public/
│   ├── css/
│   │   └── style.css      # Application styles
│   ├── images/            # FitGain brand assets
│   └── js/
│       └── app.js         # Client-side behavior
└── views/
    └── index.ejs          # Planner and results page
```

## Calculation notes

- BMR is estimated using the Mifflin–St Jeor equation.
- TDEE is estimated by multiplying BMR by an activity-level factor.
- Calorie and macronutrient targets are general estimates.
- Meal portions and grocery quantities are examples; grocery prices are illustrative and may vary by location.

These calculations are for general planning and educational purposes only; they are not medical advice or a clinical diet plan. Consult a qualified healthcare professional or registered dietitian before making significant dietary changes, especially if you have a medical condition, are pregnant, are underweight, or have a history of disordered eating.

## Customization

- Update activity factors, calculations, meal templates, and grocery estimates in `app.js`.
- Update page content and branding in `views/index.ejs`.
- Customize the layout and colors in `public/css/style.css`.

## Developer

**Sintu Kumar** — BCA Graduate and Full-Stack Web Developer

- [Portfolio](https://SintuPrajapati.vercel.app/)
- [GitHub](https://github.com/Sintukrbca)
