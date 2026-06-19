import { describe, it, expect } from "vitest";
import { calculateBudget } from "../hooks/use-carbon-data";

describe("Carbon Compass Calculations", () => {
  it("calculates budget correctly for low emitters", () => {
    const answers = {
      commute: "bike",
      distance: 20,
      diet: "vegan",
      household: 4,
      shopping: "rare",
      wfh: 5,
    };

    const result = calculateBudget(answers);

    // Bike commute = 0 transportation score
    expect(result.transScore).toBe(0);
    // Vegan diet = 60 food score
    expect(result.foodScore).toBe(60);
    // Household size 4, WFH 5 = 120/4 + 15 = 45 energy score
    expect(result.energyScore).toBe(45);
    // Shopping rare = 15 shopping score
    expect(result.shopScore).toBe(15);
    // Total monthly budget = 0 + 60 + 45 + 15 = 120
    expect(result.monthlyBudget).toBe(120);
  });

  it("calculates budget correctly for high emitters", () => {
    const answers = {
      commute: "car",
      distance: 100,
      diet: "meat",
      household: 1,
      shopping: "often",
      wfh: 0,
    };

    const result = calculateBudget(answers);

    // Car commute: 100 * 0.2 * 4.33 = 87
    expect(result.transScore).toBe(87);
    // Meat diet = 200 food score
    expect(result.foodScore).toBe(200);
    // Household size 1, WFH 0 = 120/1 + 0 = 120 energy score
    expect(result.energyScore).toBe(120);
    // Shopping often = 120 shopping score
    expect(result.shopScore).toBe(120);
    // Total monthly budget = 87 + 200 + 120 + 120 = 527
    expect(result.monthlyBudget).toBe(527);
  });

  it("handles edge cases and empty answers gracefully", () => {
    const answers = {};
    const result = calculateBudget(answers);
    
    // commute defaults to 'car' -> 60 * 0.2 * 4.33 = 52
    expect(result.transScore).toBe(52);
    // diet defaults to 'flexitarian' -> 140
    expect(result.foodScore).toBe(140);
    // household defaults to 2, wfh defaults to 2 -> 120/2 + 6 = 66
    expect(result.energyScore).toBe(66);
    // shopping defaults to 'monthly' -> 30
    expect(result.shopScore).toBe(30);
    
    expect(result.monthlyBudget).toBe(288); // 52 + 140 + 66 + 30
  });

  it("handles extreme values safely", () => {
    const answers = {
      commute: "transit",
      distance: 1000, 
      diet: "vegetarian",
      household: 10, 
      shopping: "weekly",
      wfh: 7, 
    };
    
    const result = calculateBudget(answers);
    // 1000 * 0.04 * 4.33 = 173
    expect(result.transScore).toBe(173);
    expect(result.foodScore).toBe(90);
    // 120/10 + 21 = 33
    expect(result.energyScore).toBe(33);
    expect(result.shopScore).toBe(65);
    expect(result.monthlyBudget).toBe(361);
  });
});
