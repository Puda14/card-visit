import { access, copyFile, mkdir } from "node:fs/promises";
await mkdir("public/avatar", { recursive: true });
try {
  await access("avatar/avatar.png");
  await copyFile("avatar/avatar.png", "public/avatar/avatar.png");
  console.log("Synced avatar/avatar.png");
} catch (error) { if (error.code !== "ENOENT") throw error; }
