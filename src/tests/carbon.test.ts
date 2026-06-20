import { describe, it, expect } from "vitest";
import { calculateBudget } from "../lib/carbon-utils";

// ─────────────────────────────────────────────────────────────────────────────
// calculateBudget — Pure function unit tests
// ─────────────────────────────────────────────────────────────────────────────
describe("calculateBudget()", () => {
  describe("Transportation score", () => {
    it("returns 0 for bike commute", () => {
      const { transScore } = calculateBudget({ commute: "bike", distance: 50 });
      expect(transScore).toBe(0);
    });

    it("calculates car commute correctly", () => {
      const { transScore } = calculateBudget({ commute: "car", distance: 100 });
      // 100 * 0.2 * 4.33 = 86.6 → rounded to 87
      expect(transScore).toBe(87);
    });

    it("calculates transit commute correctly", () => {
      const { transScore } = calculateBudget({ commute: "transit", distance: 50 });
      // 50 * 0.04 * 4.33 = 8.66 → rounded to 9
      expect(transScore).toBe(9);
    });

    it("calculates rideshare commute correctly", () => {
      const { transScore } = calculateBudget({ commute: "rideshare", distance: 40 });
      // 40 * 0.25 * 4.33 = 43.3 → rounded to 43
      expect(transScore).toBe(43);
    });

    it("defaults to car at 60km when commute is missing", () => {
      const { transScore } = calculateBudget({});
      // 60 * 0.2 * 4.33 = 51.96 → rounded to 52
      expect(transScore).toBe(52);
    });
  });

  describe("Food (diet) score", () => {
    it("returns 200 for meat diet", () => {
      expect(calculateBudget({ diet: "meat" }).foodScore).toBe(200);
    });

    it("returns 140 for flexitarian diet", () => {
      expect(calculateBudget({ diet: "flexitarian" }).foodScore).toBe(140);
    });

    it("returns 90 for vegetarian diet", () => {
      expect(calculateBudget({ diet: "vegetarian" }).foodScore).toBe(90);
    });

    it("returns 60 for vegan diet", () => {
      expect(calculateBudget({ diet: "vegan" }).foodScore).toBe(60);
    });

    it("defaults to flexitarian (140) when diet is missing", () => {
      expect(calculateBudget({}).foodScore).toBe(140);
    });
  });

  describe("Energy score", () => {
    it("scales inversely with household size", () => {
      const solo = calculateBudget({ household: 1, wfh: 0 });
      const family = calculateBudget({ household: 4, wfh: 0 });
      expect(solo.energyScore).toBeGreaterThan(family.energyScore);
    });

    it("adds wfh bonus correctly", () => {
      const noWfh = calculateBudget({ household: 2, wfh: 0 });
      const fullWfh = calculateBudget({ household: 2, wfh: 5 });
      // Each WFH day adds 3 points
      expect(fullWfh.energyScore - noWfh.energyScore).toBe(15);
    });

    it("calculates correctly for household=4 wfh=5", () => {
      // 120/4 + 5*3 = 30 + 15 = 45
      expect(calculateBudget({ household: 4, wfh: 5 }).energyScore).toBe(45);
    });

    it("defaults to household=2 wfh=2 when missing", () => {
      // 120/2 + 2*3 = 60 + 6 = 66
      expect(calculateBudget({}).energyScore).toBe(66);
    });
  });

  describe("Shopping score", () => {
    it("returns 15 for rare shopping", () => {
      expect(calculateBudget({ shopping: "rare" }).shopScore).toBe(15);
    });

    it("returns 30 for monthly shopping", () => {
      expect(calculateBudget({ shopping: "monthly" }).shopScore).toBe(30);
    });

    it("returns 65 for weekly shopping", () => {
      expect(calculateBudget({ shopping: "weekly" }).shopScore).toBe(65);
    });

    it("returns 120 for often shopping", () => {
      expect(calculateBudget({ shopping: "often" }).shopScore).toBe(120);
    });

    it("defaults to monthly (30) when shopping is missing", () => {
      expect(calculateBudget({}).shopScore).toBe(30);
    });
  });

  describe("Monthly budget total", () => {
    it("sums all category scores", () => {
      const result = calculateBudget({
        commute: "bike",
        distance: 20,
        diet: "vegan",
        household: 4,
        shopping: "rare",
        wfh: 5,
      });
      // trans=0, food=60, energy=45, shop=15 → total=120
      expect(result.monthlyBudget).toBe(120);
    });

    it("calculates max emitter budget correctly", () => {
      const result = calculateBudget({
        commute: "car",
        distance: 100,
        diet: "meat",
        household: 1,
        shopping: "often",
        wfh: 0,
      });
      // trans=87, food=200, energy=120, shop=120 → total=527
      expect(result.monthlyBudget).toBe(527);
    });

    it("equals sum of all category scores", () => {
      const r = calculateBudget({
        commute: "transit",
        distance: 30,
        diet: "vegetarian",
        household: 3,
        shopping: "weekly",
        wfh: 3,
      });
      expect(r.monthlyBudget).toBe(r.transScore + r.foodScore + r.energyScore + r.shopScore);
    });
  });

  describe("Edge cases", () => {
    it("handles empty object input gracefully", () => {
      const result = calculateBudget({});
      expect(result.monthlyBudget).toBeGreaterThan(0);
      expect(typeof result.monthlyBudget).toBe("number");
    });

    it("handles very large distance without throwing", () => {
      expect(() => calculateBudget({ commute: "car", distance: 10000 })).not.toThrow();
    });

    it("handles zero distance", () => {
      const result = calculateBudget({ commute: "car", distance: 0 });
      expect(result.transScore).toBe(0);
    });

    it("handles unknown commute type by returning 0", () => {
      // Unknown commute → multiplier falls to 0 in switch
      const result = calculateBudget({ commute: "hoverboard", distance: 50 });
      expect(result.transScore).toBe(0);
    });

    it("handles household size of 10 without error", () => {
      const result = calculateBudget({ household: 10, wfh: 7 });
      // 120/10 + 7*3 = 12 + 21 = 33
      expect(result.energyScore).toBe(33);
    });

    it("returns only numeric values for all fields", () => {
      const result = calculateBudget({
        commute: "bike",
        diet: "vegan",
        household: 2,
        shopping: "monthly",
        wfh: 0,
      });
      expect(typeof result.transScore).toBe("number");
      expect(typeof result.foodScore).toBe("number");
      expect(typeof result.energyScore).toBe("number");
      expect(typeof result.shopScore).toBe("number");
      expect(typeof result.monthlyBudget).toBe("number");
    });

    it("monthlyBudget is never negative", () => {
      const result = calculateBudget({
        commute: "bike",
        distance: 0,
        diet: "vegan",
        household: 100,
        shopping: "rare",
        wfh: 0,
      });
      expect(result.monthlyBudget).toBeGreaterThanOrEqual(0);
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Recommendation logic validation tests
// ─────────────────────────────────────────────────────────────────────────────
describe("Carbon coaching logic", () => {
  it("high-car-user should have transScore > 80 (flagged High impact)", () => {
    const { transScore } = calculateBudget({ commute: "car", distance: 50 });
    // 50 * 0.2 * 4.33 = 43.3 — Medium. For > 80, need distance > 92
    const heavy = calculateBudget({ commute: "car", distance: 100 });
    expect(heavy.transScore).toBeGreaterThan(80);
  });

  it("meat diet always flags as High impact (>150)", () => {
    const { foodScore } = calculateBudget({ diet: "meat" });
    expect(foodScore).toBeGreaterThan(150);
  });

  it("vegan diet is always Low impact (<80)", () => {
    const { foodScore } = calculateBudget({ diet: "vegan" });
    expect(foodScore).toBeLessThan(80);
  });

  it("often shopping is High impact (>80)", () => {
    const { shopScore } = calculateBudget({ shopping: "often" });
    expect(shopScore).toBeGreaterThan(80);
  });

  it("rare shopping is Low impact (<40)", () => {
    const { shopScore } = calculateBudget({ shopping: "rare" });
    expect(shopScore).toBeLessThan(40);
  });

  it("large household (6) reduces energy score vs small household (1)", () => {
    const small = calculateBudget({ household: 1, wfh: 0 });
    const large = calculateBudget({ household: 6, wfh: 0 });
    expect(large.energyScore).toBeLessThan(small.energyScore);
  });
});
