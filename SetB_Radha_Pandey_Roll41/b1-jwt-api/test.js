// Quick self-test (Radha Pandey, B.Tech CSE, Roll 41). Run: npm test
const test = require("node:test");
const assert = require("node:assert");
const jwt = require("jsonwebtoken");
const app = require("./app");

let server, base;
test.before(async () => {
  await new Promise((r) => (server = app.listen(0, r)));
  base = `http://localhost:${server.address().port}`;
});
test.after(() => server.close());

const post = (p, body) =>
  fetch(base + p, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });

test("full flow", async () => {
  let r = await post("/register", { username: "radha", password: "secret1" });
  assert.equal(r.status, 201);
  assert.deepEqual(await r.json(), { message: "User registered" });

  r = await post("/register", { username: "radha", password: "secret1" });
  assert.equal(r.status, 409);
  assert.deepEqual(await r.json(), { error: "Username already exists" });

  for (const b of [{}, { username: "", password: "secret1" }, { username: "x", password: "123" }, { username: "x" }]) {
    r = await post("/register", b);
    assert.equal(r.status, 400);
    assert.deepEqual(await r.json(), { error: "Invalid input" });
  }

  r = await post("/login", { username: "radha", password: "wrong!!" });
  assert.equal(r.status, 401);
  r = await post("/login", { username: "nobody", password: "secret1" });
  assert.equal(r.status, 401);
  assert.deepEqual(await r.json(), { error: "Invalid credentials" });

  r = await post("/login", { username: "radha", password: "secret1" });
  assert.equal(r.status, 200);
  const { token } = await r.json();
  const p = jwt.decode(token);
  assert.equal(p.username, "radha");
  assert.equal(p.exp - p.iat, 3600);

  r = await fetch(base + "/profile", { headers: { Authorization: "Bearer " + token } });
  assert.equal(r.status, 200);
  assert.deepEqual(await r.json(), { username: "radha" });

  const bad = [undefined, "Bearer", "Bearer abc.def.ghi", "Bearer " + token + "x", "Token " + token];
  for (const h of bad) {
    r = await fetch(base + "/profile", { headers: h ? { Authorization: h } : {} });
    assert.equal(r.status, 401);
    assert.deepEqual(await r.json(), { error: "Unauthorized" });
  }

  const expired = jwt.sign({ username: "radha" }, "radha-pandey-roll41-secret", { expiresIn: -10 });
  r = await fetch(base + "/profile", { headers: { Authorization: "Bearer " + expired } });
  assert.equal(r.status, 401);
});
