import { phaseClause } from "./queries";

describe("phaseClause", () => {
  it("returns null for 'all' or undefined (no filter, backward compatible)", () => {
    expect(phaseClause("b.game_stage", "all")).toBeNull();
    expect(phaseClause("b.game_stage", undefined)).toBeNull();
  });

  it("filters regular season as league + group stages", () => {
    expect(phaseClause("b.game_stage", "regular")).toBe(
      "b.game_stage IN ('league', 'group')",
    );
  });

  it("filters playoff as the playoff stage only", () => {
    expect(phaseClause("tb.stage", "playoff")).toBe("tb.stage = 'playoff'");
  });

  it("uses the supplied column name verbatim", () => {
    expect(phaseClause("s.stage", "regular")).toBe(
      "s.stage IN ('league', 'group')",
    );
  });
});
