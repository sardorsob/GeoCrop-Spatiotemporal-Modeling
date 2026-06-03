import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

import { metadata } from "../site-metadata";

describe("site metadata", () => {
  it("uses the sprout favicon as the site icon", () => {
    expect(metadata.icons).toEqual({
      icon: "/favicon.svg",
      shortcut: "/favicon.svg",
      apple: "/favicon.svg"
    });

    const favicon = readFileSync("public/favicon.svg", "utf-8");

    expect(favicon).toContain("<title>GeoCrop sprout favicon</title>");
    expect(favicon).toContain("M14 9.536V7");
  });
});
