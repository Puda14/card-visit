import { mkdir, copyFile, access, rm } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = fileURLToPath(new URL("../", import.meta.url));
for (const relative of ["avatar/avatar.png", "card_visit_image/logo.png"]) {
  const source = path.join(root, relative);
  const target = path.join(root, "public", relative);
  await mkdir(path.dirname(target), { recursive: true });
  try {
    await access(source);
    await copyFile(source, target);
    console.log(`Synced ${relative}`);
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
    await rm(target, { force: true });
    console.warn(`Missing optional asset: ${relative}`);
  }
}
