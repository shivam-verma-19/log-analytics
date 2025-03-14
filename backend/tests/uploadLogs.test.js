import request from "supertest";
import app from "../server";
import { logQueue } from "../queues/logQueue";
jest.mock("../queues/logQueue");

test("POST /api/upload should enqueue a job", async () => {
    logQueue.add.mockResolvedValue({ id: "12345" });

    const res = await request(app).post("/api/upload").attach("file", "test.log");

    expect(res.status).toBe(200);
    expect(res.body.jobId).toBe("12345");
});
