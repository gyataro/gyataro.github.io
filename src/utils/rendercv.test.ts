import { describe, expect, it } from "vitest";
import type { Publication } from "../content/schemas";
import { applyOverride, buildCv, cvAuthors, periodFields } from "./rendercv";

const paper = (overrides: Partial<Publication> = {}): Publication => ({
  title: "A Paper",
  venue: "ISSTA",
  venueFull: "International Symposium on Software Testing and Analysis",
  date: new Date("2025-06-01T00:00:00Z"),
  authors: ["Ruofan Liu", "Xiwen Teoh", "Yun Lin"],
  ...overrides,
});

const empty = {
  publications: [],
  awards: [],
  education: [],
  experience: [],
  talks: [],
  teaching: [],
  service: [],
};

describe("periodFields", () => {
  it("uses a single date when there is no range", () => {
    expect(periodFields({ start: 2026 })).toEqual({ date: 2026 });
    expect(periodFields({ start: 2025, end: 2025 })).toEqual({ date: 2025 });
  });

  it("uses start and end dates for ranges", () => {
    expect(periodFields({ start: 2024, end: "present" })).toEqual({
      start_date: 2024,
      end_date: "present",
    });
  });
});

describe("applyOverride", () => {
  it("returns the entry unchanged without overrides", () => {
    expect(applyOverride({ name: "A" }, undefined)).toEqual({ name: "A" });
  });

  it("replaces fields, removes nulls and drops directives", () => {
    expect(
      applyOverride(
        { name: "A", date: 2024, summary: "x" },
        { selected: true, date: null, start_date: 2024, end_date: 2025 },
      ),
    ).toEqual({ name: "A", summary: "x", start_date: 2024, end_date: 2025 });
  });

  it("hides entries", () => {
    expect(applyOverride({ name: "A" }, { hidden: true })).toBeUndefined();
  });
});

describe("cvAuthors", () => {
  it("underlines me", () => {
    expect(cvAuthors(paper())).toEqual([
      "Ruofan Liu",
      "#underline(offset: 2pt)[Xiwen Teoh]",
      "Yun Lin",
    ]);
  });

  it("marks co-first authors with a double dagger", () => {
    expect(cvAuthors(paper({ cofirst: true })).slice(0, 2)).toEqual([
      "Ruofan Liu#super[‡]",
      "#underline(offset: 2pt)[Xiwen Teoh]#super[‡]",
    ]);
  });

  it("escapes the corresponding-author marker for Typst", () => {
    expect(cvAuthors(paper({ corresponding: true }))[1]).toBe(
      "#underline(offset: 2pt)[Xiwen Teoh]#super[\\#]",
    );
  });
});

describe("buildCv", () => {
  it("splits selected publications and uses full venue names", () => {
    const { sections } = buildCv({
      ...empty,
      publications: [
        paper({ title: "Other" }),
        paper({ title: "Picked", cv: { selected: true } }),
      ],
    }).cv;
    expect(sections["Selected Publications"]).toEqual([
      expect.objectContaining({
        title: "Picked",
        journal: "International Symposium on Software Testing and Analysis",
        date: 2025,
      }),
    ]);
    expect(sections.Publications.map((p) => p.title)).toEqual(["Other"]);
  });

  it("omits empty sections and hidden entries", () => {
    const { sections } = buildCv({
      ...empty,
      awards: [
        {
          title: "Kept",
          source: "S",
          date: new Date("2025-01-01"),
        },
        {
          title: "Gone",
          source: "S",
          date: new Date("2024-01-01"),
          cv: { hidden: true },
        },
      ],
    }).cv;
    expect(Object.keys(sections)).toEqual(["Awards"]);
    expect(sections.Awards).toEqual([
      { name: "Kept", summary: "S", date: 2025 },
    ]);
  });

  it("drops undefined fields", () => {
    const { sections } = buildCv({
      ...empty,
      service: [
        { role: "ACM Professional Membership", start: 2026, end: 2027 },
      ],
    }).cv;
    expect(sections.Service).toEqual([
      { name: "ACM Professional Membership", start_date: 2026, end_date: 2027 },
    ]);
  });
});
