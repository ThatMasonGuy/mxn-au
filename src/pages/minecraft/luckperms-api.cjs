import express from "express";
import Redis from "ioredis";
import cors from "cors";

const app = express();
const redis = new Redis({
  host: "66.94.98.250", // ✅ Correct US Redis server
  port: 6379,
  password: "Keyboard28Ground65",
});

app.use(cors({ origin: "*" }));
app.use(express.json());

// ✅ Get all online players
app.get("/api/players", async (req, res) => {
  try {
    const keys = await redis.keys("luckperms:player:*");
    const players = await Promise.all(
      keys.map(async (key) => {
        const data = await redis.hgetall(key);
        return { uuid: key.split(":")[2], name: data.username || "Unknown" };
      })
    );
    res.json(players);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch players", details: err });
  }
});

// ✅ Get permissions for a specific player
app.get("/api/permissions/:uuid", async (req, res) => {
  const { uuid } = req.params;
  try {
    const permissions = await redis.smembers(`luckperms:player:${uuid}:permissions`);
    res.json(permissions);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch permissions", details: err });
  }
});

// ✅ Add or remove a permission
app.post("/api/permissions", async (req, res) => {
  const { uuid, permission, action } = req.body;
  try {
    if (action === "add") {
      await redis.sadd(`luckperms:player:${uuid}:permissions`, permission);
    } else if (action === "remove") {
      await redis.srem(`luckperms:player:${uuid}:permissions`, permission);
    } else {
      return res.status(400).json({ error: "Invalid action" });
    }
    res.json({ success: true, message: `Permission ${action}ed successfully` });
  } catch (err) {
    res.status(500).json({ error: "Failed to update permissions", details: err });
  }
});

// ✅ Sync LuckPerms
app.get("/api/sync", (req, res) => {
  import("child_process").then(({ exec }) => {
    exec("lp sync", (error, stdout, stderr) => {
      if (error) {
        return res.status(500).json({ error: "Failed to sync LuckPerms", details: stderr });
      }
      res.json({ success: true, message: "LuckPerms synced!" });
    });
  });
});

// Start API server
app.listen(3001, () => console.log("LuckPerms API running on port 3001"));
