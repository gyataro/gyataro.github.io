import { describe, expect, it } from "vitest";
import { formatPeriod, groupBy, sortByStartDesc } from "./period";

describe("formatPeriod", () => {
  it("shows a single year when there is no end", () => {
    expect(formatPeriod({ start: 2026 })).toBe("2026");
  });

  it("collapses ranges that start and end in the same year", () => {
    expect(formatPeriod({ start: 2025, end: 2025 })).toBe("2025");
  });

  it("formats closed and open-ended ranges", () => {
    expect(formatPeriod({ start: 2019, end: 2023 })).toBe("2019 – 2023");
    expect(formatPeriod({ start: 2024, end: "present" })).toBe(
      "2024 – present",
    );
  });
});

describe("sortByStartDesc", () => {
  it("orders newest first and keeps ties stable", () => {
    const entries = [
      { id: "be", data: { start: 2019 } },
      { id: "phd", data: { start: 2024 } },
      { id: "ra", data: { start: 2024 } },
    ];
    expect(sortByStartDesc(entries).map((e) => e.id)).toEqual([
      "phd",
      "ra",
      "be",
    ]);
  });
});

describe("groupBy", () => {
  it("keeps groups and items in order of first appearance", () => {
    const items = [
      { role: "Reviewer", id: 1 },
      { role: "Member", id: 2 },
      { role: "Reviewer", id: 3 },
    ];
    expect(groupBy(items, (i) => i.role)).toEqual([
      ["Reviewer", [items[0], items[2]]],
      ["Member", [items[1]]],
    ]);
  });
});
