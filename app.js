const express = require("express");
const path = require("path");
const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

const activityFactors = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.475,
  very: 1.65
};

const activityLabels = {
  sedentary: "Mostly sitting / little exercise",
  light: "Light activity / exercise 1–3 days",
  moderate: "Gym or exercise 4–5 days",
  very: "Hard training / physically active work"
};

const rupee = n => Math.round(n).toLocaleString("en-IN");

function calculateProfile(input) {
  const weight = Number(input.weight);
  const height = Number(input.height);
  const age = Number(input.age);
  const gender = input.gender;
  const activity = input.activity;
  const goal = input.goal || "gain";
  const diet = input.diet || "veg";
  const budget = Number(input.budget) || 4000;

  if (![weight, height, age].every(Number.isFinite) ||
      weight < 25 || weight > 300 || height < 120 || height > 230 ||
      age < 15 || age > 100 || !["male", "female"].includes(gender) ||
      !activityFactors[activity]) {
    throw new Error("Please enter valid age, height, weight, gender and activity level.");
  }

  // Mifflin-St Jeor equation
  const bmr = gender === "male"
    ? 10 * weight + 6.25 * height - 5 * age + 5
    : 10 * weight + 6.25 * height - 5 * age - 161;

  const tdee = bmr * activityFactors[activity];
  const calorieDelta = goal === "lose" ? -350 : goal === "maintain" ? 0 : 250;
  const calories = Math.max(1200, Math.round((tdee + calorieDelta) / 50) * 50);
  const bmi = weight / Math.pow(height / 100, 2);

  // General fitness-planning estimates, not clinical prescriptions.
  const protein = Math.round(goal === "gain" ? weight * 1.8 : weight * 1.6);
  const fat = Math.round((calories * 0.27) / 9);
  const carbs = Math.max(0, Math.round((calories - protein * 4 - fat * 9) / 4));

  const bmiStatus = bmi < 18.5 ? "Underweight" : bmi < 25 ? "Normal range" : bmi < 30 ? "Overweight" : "Obesity range";
  const goalLabel = goal === "gain" ? "Healthy weight gain" : goal === "lose" ? "Fat loss" : "Weight maintenance";

  const plan = buildDietPlan({ calories, protein, carbs, diet, budget, goal });
  return {
    input: { ...input, weight, height, age, budget },
    bmr: Math.round(bmr),
    tdee: Math.round(tdee),
    bmi: Number(bmi.toFixed(1)),
    bmiStatus,
    calories,
    protein,
    carbs,
    fat,
    goalLabel,
    activityLabel: activityLabels[activity],
    plan
  };
}

function buildDietPlan({ calories, protein, carbs, diet, budget, goal }) {
  const isNonVeg = diet === "nonveg";
  const meals = isNonVeg ? [
    { time: "Breakfast", title: "Power breakfast", foods: ["Oats 40 g", "Milk 250 ml", "Banana 1 medium", "Boiled eggs 2"], kcal: 530, protein: 27, carbs: 62 },
    { time: "Mid-morning", title: "Affordable snack", foods: ["Roasted chana 30 g", "Peanuts 15 g"], kcal: 200, protein: 10, carbs: 22 },
    { time: "Lunch", title: "Rice, dal & chicken", foods: ["Rice 100 g (raw)", "Dal 30 g (raw)", "Chicken 70 g (raw, boneless)", "Seasonal vegetables 100 g"], kcal: 640, protein: 32, carbs: 103 },
    { time: "Pre-workout", title: "Workout fuel", foods: ["Banana 1 medium", "Bread 2 slices", "Peanut butter 10 g"], kcal: 260, protein: 8, carbs: 43 },
    { time: "Dinner / post-workout", title: "Eggs, roti & curd", foods: ["Eggs 2", "Roti from 60 g atta", "Sabzi 150 g", "Curd 100 g"], kcal: 440, protein: 22, carbs: 46 },
    { time: "Before sleep", title: "Milk", foods: ["Milk 200 ml"], kcal: 120, protein: 6, carbs: 10 }
  ] : [
    { time: "Breakfast", title: "Weight-gain shake", foods: ["Oats 50 g", "Milk 250 ml", "Banana 1 medium", "Peanut butter 15 g", "Dry fruits 10 g", "Honey 5 g"], kcal: 615, protein: 23, carbs: 81 },
    { time: "Mid-morning", title: "Sweet potato & curd", foods: ["Boiled sweet potato 150 g", "Curd 200 g"], kcal: 250, protein: 9, carbs: 39 },
    { time: "Lunch", title: "Dal, rice & vegetables", foods: ["Rice 60 g (raw)", "Dal 40 g (raw)", "Seasonal vegetables 150 g", "Curd 100 g", "Oil/ghee 5 g"], kcal: 465, protein: 19, carbs: 85 },
    { time: "Evening snack", title: "Chana & peanuts", foods: ["Roasted chana 30 g", "Peanuts 10 g"], kcal: 172, protein: 9, carbs: 20 },
    { time: "Pre-workout", title: "Quick energy", foods: ["Banana 1 medium"], kcal: 105, protein: 1, carbs: 27 },
    { time: "Dinner / post-workout", title: "Soya, roti & rice", foods: ["Soya chunks 30 g (dry)", "Roti from 60 g atta", "Rice 30 g (raw)", "Sabzi 150 g", "Cucumber 100 g", "Oil 5 g"], kcal: 536, protein: 29, carbs: 90 },
    { time: "Before sleep", title: "Milk", foods: ["Milk 200 ml"], kcal: 120, protein: 6, carbs: 10 }
  ];

  const baseKcal = meals.reduce((s, m) => s + m.kcal, 0);
  const baseProtein = meals.reduce((s, m) => s + m.protein, 0);
  const baseCarbs = meals.reduce((s, m) => s + m.carbs, 0);
  const extraKcal = Math.max(0, calories - baseKcal);
  const adjustedMeals = [...meals];
  if (extraKcal > 80) {
    adjustedMeals.push({
      time: "Extra portion",
      title: "Adjust to your calorie target",
      foods: ["Add 1 banana, or increase rice/roti/oats portions; adjust based on appetite and weight trend."],
      kcal: extraKcal,
      protein: 0,
      carbs: Math.round(extraKcal / 4)
    });
  }

  const monthly = isNonVeg ? [
    ["Eggs", "120 pieces", 660], ["Chicken (raw)", "2.1 kg", 600],
    ["Milk", "13.5 litres", 740], ["Oats", "1.2 kg", 200],
    ["Bananas", "60 pieces", 330], ["Roasted chana", "900 g", 115],
    ["Peanuts", "450 g", 95], ["Peanut butter", "300 g", 120],
    ["Bread", "8 packets approx.", 280], ["Rice", "3 kg", 200],
    ["Dal", "900 g", 140], ["Wheat atta", "1.8 kg", 105],
    ["Vegetables", "7.5 kg", 300], ["Curd", "3 kg", 210], ["Oil", "500 ml allowance", 90]
  ] : [
    ["Oats", "1.5 kg", 240], ["Milk", "13.5 litres", 675],
    ["Bananas", "60 pieces", 300], ["Peanut butter", "450 g", 175],
    ["Dry fruits", "300 g", 300], ["Honey", "150 g", 60],
    ["Sweet potato", "4.5 kg", 180], ["Curd", "9 kg", 540],
    ["Rice", "2.7 kg", 160], ["Dal", "1.2 kg", 180],
    ["Roasted chana", "900 g", 120], ["Peanuts", "300 g", 45],
    ["Soya chunks", "900 g", 120], ["Wheat atta", "1.8 kg", 90],
    ["Vegetables", "9 kg", 450], ["Cucumber", "3 kg", 120],
    ["Oil/ghee", "300–450 g allowance", 100], ["Pineapple", "Approx. 1 kg", 80]
  ];

  const listTotal = monthly.reduce((s, item) => s + item[2], 0);
  // Monthly budget estimate scales the list to the user's calorie target.
  const scale = Math.max(0.85, Math.min(1.3, calories / (isNonVeg ? 2190 : 2300)));
  const estimatedCost = Math.round((listTotal * scale) / 50) * 50;
  const budgetNote = estimatedCost <= budget
    ? "Estimated list is within your selected monthly budget."
    : "Estimated list is above your selected budget. Use shared staples, seasonal produce and local prices to reduce cost.";
  return {
    meals: adjustedMeals,
    baseKcal,
    baseProtein,
    baseCarbs,
    monthly,
    listTotal,
    estimatedCost,
    budget,
    budgetNote,
    dietLabel: isNonVeg ? "Non-vegetarian" : "Vegetarian"
  };
}

app.get("/", (req, res) => {
  res.render("index", { result: null, error: null, values: {} });
});

app.post("/calculate", (req, res) => {
  try {
    const result = calculateProfile(req.body);
    res.render("index", { result, error: null, values: req.body });
  } catch (err) {
    res.status(400).render("index", { result: null, error: err.message, values: req.body });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});