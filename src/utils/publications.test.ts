import { describe, expect, it } from "vitest";
import {
  formatAuthors,
  groupByYear,
  sortByDateDesc,
  venueLabel,
} from "./publications";

const entry = (id: string, date: string) => ({
  id,
  data: { date: new Date(date) },
});

describe("sortByDateDesc", () => {
  it("orders newest first without mutating the input", () => {
    const input = [entry("a", "2024-08-01"), entry("b", "2026-01-01")];
    expect(sortByDateDesc(input).map((e) => e.id)).toEqual(["b", "a"]);
    expect(input.map((e) => e.id)).toEqual(["a", "b"]);
  });
});

describe("groupByYear", () => {
  it("groups by year, newest year first, keeping order within a year", () => {
    const groups = groupByYear([
      entry("a", "2024-11-01"),
      entry("b", "2026-08-29T00:00:00Z"),
      entry("c", "2024-08-01"),
    ]);
    expect(
      groups.map(([year, items]) => [year, items.map((e) => e.id)]),
    ).toEqual([
      [2026, ["b"]],
      [2024, ["a", "c"]],
    ]);
  });

  it("uses the UTC year so Jan 1 dates do not slip into the prior year", () => {
    const [[year]] = groupByYear([entry("a", "2026-01-01T00:00:00Z")]);
    expect(year).toBe(2026);
  });
});

describe("formatAuthors", () => {
  const authors = ["Ruofan Liu", "Xiwen Teoh", "Yun Lin"];

  it("highlights me case-insensitively", () => {
    const result = formatAuthors(authors, { me: "xiwen teoh" });
    expect(result.map((a) => a.isMe)).toEqual([false, true, false]);
    expect(result.every((a) => a.marker === "")).toBe(true);
  });

  it("marks the first two authors as co-first", () => {
    const result = formatAuthors(authors, { me: "Xiwen Teoh", cofirst: true });
    expect(result.map((a) => a.marker)).toEqual(["*", "*", ""]);
  });

  it("marks me as corresponding author", () => {
    const result = formatAuthors(authors, {
      me: "Xiwen Teoh",
      cofirst: true,
      corresponding: true,
    });
    expect(result[1].marker).toBe("*#");
  });
});

describe("venueLabel", () => {
  it("appends the year", () => {
    expect(venueLabel("USENIX Security", new Date("2025-08-01"))).toBe(
      "USENIX Security 2025",
    );
  });

  it("hides preprint venues", () => {
    expect(venueLabel("arXiv", new Date("2025-08-01"))).toBeUndefined();
    expect(venueLabel(" Preprint ", new Date("2025-08-01"))).toBeUndefined();
  });
});
