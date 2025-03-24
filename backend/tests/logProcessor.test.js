import { processLogData } from "../workers/logProcessor";

test("processLogData should parse log entries correctly", () => {
    const input = "[2025-02-20T10:00:00Z] ERROR Some error occurred";
    const result = processLogData(input);
    expect(result.level).toBe("ERROR");
});
