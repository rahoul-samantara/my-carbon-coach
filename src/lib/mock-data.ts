export const carbonProfile = {
  name: "Alex Rivera",
  city: "Brooklyn, NY",
  joined: "March 2026",
  monthlyBudgetKg: 580,
  usedKg: 412,
  get remainingKg() {
    return this.monthlyBudgetKg - this.usedKg;
  },
};

export const categories = [
  { key: "transport", label: "Transportation", usedKg: 198, budgetKg: 240, impact: "High", color: "var(--chart-1)" },
  { key: "food", label: "Food", usedKg: 124, budgetKg: 160, impact: "Medium", color: "var(--chart-2)" },
  { key: "energy", label: "Energy", usedKg: 56, budgetKg: 110, impact: "Low", color: "var(--chart-3)" },
  { key: "shopping", label: "Shopping", usedKg: 34, budgetKg: 70, impact: "Low", color: "var(--chart-4)" },
] as const;

export const monthlyTrend = [
  { month: "Oct", kg: 612 },
  { month: "Nov", kg: 588 },
  { month: "Dec", kg: 640 },
  { month: "Jan", kg: 555 },
  { month: "Feb", kg: 498 },
  { month: "Mar", kg: 412 },
];

export const weeklyGoals = [
  { title: "Bike to work 2× this week", progress: 50, reward: "−8 kg CO₂e" },
  { title: "Skip one food delivery", progress: 100, reward: "−3 kg CO₂e" },
  { title: "Plant-based dinners ×4", progress: 75, reward: "−6 kg CO₂e" },
];

export const recentActivity = [
  { id: 1, label: "Subway commute", category: "transport", kg: 1.2, when: "Today, 8:14 AM" },
  { id: 2, label: "Vegetarian lunch", category: "food", kg: 0.9, when: "Today, 12:40 PM" },
  { id: 3, label: "Online order — 2 items", category: "shopping", kg: 4.6, when: "Yesterday" },
  { id: 4, label: "Worked from home", category: "energy", kg: 2.1, when: "Yesterday" },
];

export const suggestedQuestions = [
  "What's my biggest carbon contributor?",
  "How can I reduce my commuting emissions?",
  "Give me 3 actions this week.",
  "What does my next month look like?",
];

export const achievements = [
  { title: "First Week Logged", earned: true, icon: "Sparkles" },
  { title: "Under Budget — March", earned: true, icon: "Target" },
  { title: "10 Plant-based Meals", earned: true, icon: "Leaf" },
  { title: "30-day Streak", earned: false, icon: "Flame" },
];

export type Category = (typeof categories)[number];
