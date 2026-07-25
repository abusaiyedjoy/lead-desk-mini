import { createSession } from "../src/lib/session";

async function test() {
  try {
    console.log("Testing createSession...");
    await createSession("test-id", "admin@leaddesk.com");
    console.log("createSession succeeded!");
  } catch (err) {
    console.error("createSession failed:", err);
  }
}

test();
