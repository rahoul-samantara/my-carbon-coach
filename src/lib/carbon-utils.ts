export type OnboardingAnswers = {
  commute?: string;
  distance?: number;
  diet?: string;
  household?: number;
  shopping?: string;
  wfh?: number;
};

// Helper formulas for carbon calculations
export const calculateBudget = (a: OnboardingAnswers) => {
  const commute = a.commute || "car";
  const dist = a.distance ?? 60;
  const commuteMult =
    commute === "car" ? 0.2 : commute === "rideshare" ? 0.25 : commute === "transit" ? 0.04 : 0;
  const transScore = Math.round(dist * commuteMult * 4.33);

  const diet = a.diet || "flexitarian";
  const foodScore =
    diet === "meat" ? 200 : diet === "flexitarian" ? 140 : diet === "vegetarian" ? 90 : 60;

  const hh = a.household ?? 2;
  const wfh = a.wfh ?? 2;
  const energyScore = Math.round(120 / hh + wfh * 3);

  const shop = a.shopping || "monthly";
  const shopScore = shop === "rare" ? 15 : shop === "monthly" ? 30 : shop === "weekly" ? 65 : 120;

  const monthlyBudget = transScore + foodScore + energyScore + shopScore;

  return {
    transScore,
    foodScore,
    energyScore,
    shopScore,
    monthlyBudget,
  };
};
