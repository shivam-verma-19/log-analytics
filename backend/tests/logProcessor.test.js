import { parseLogEntry } from "../worker/logProcessor";

test("parses a valid log entry", () => {
    const log = '[2025-02-20T10:00:00Z] ERROR Database timeout {"userId": 123}';
    const result = parseLogEntry(log);
    expect(result.level).toBe("ERROR");
    expect(result.timestamp).toBe("2025-02-20T10:00:00Z");
});
