import { describe, it, expect } from "vitest";
import { analyzeSentiment } from "@/lib/sentiment";

describe("analyzeSentiment", () => {
  it("should return positive for good words", () => {
    expect(analyzeSentiment("I am so happy and excited about this great app!")).toBe("positive");
  });

  it("should return negative for bad words", () => {
    expect(analyzeSentiment("This is a terrible and frustrating experience.")).toBe("negative");
  });

  it("should return neutral when there are no sentiment words", () => {
    expect(analyzeSentiment("I went to the store today.")).toBe("neutral");
  });

  it("should handle mixed sentiment correctly", () => {
    // 2 positive (good, great), 1 negative (bad) -> positive overall
    expect(analyzeSentiment("This is good and great, but also a bit bad.")).toBe("positive");
  });
});
