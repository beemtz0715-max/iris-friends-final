app.post("/api/auth/login", async (c) => {
  try {
    const { email, password } = await c.req.json();

    if (!email || !password) {
      return c.json({ error: "Email and password are required" }, 422);
    }

    // Get user from D1
    const user = await c.env.DB
      .prepare("SELECT * FROM users WHERE email = ?")
      .bind(email)
      .first();

    if (!user) {
      return c.json({ error: "Invalid email or password" }, 401);
    }

    // Compare password
    const valid = await verifyPassword(password, user.password_hash);
    if (!valid) {
      return c.json({ error: "Invalid email or password" }, 401);
    }

    // Create JWT
    const token = await createJWT({
      id: user.id,
      email: user.email,
      name: user.name
    }, c.env.JWT_SECRET);

    // Return token + user object
    return c.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    });

  } catch (err) {
    return c.json({ error: "Server error" }, 500);
  }
});
