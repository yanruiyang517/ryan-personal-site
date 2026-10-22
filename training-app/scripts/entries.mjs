import { copyFile } from "node:fs/promises";
for (const name of ["app.html", "pro.html", "legacy-app.html"]) {
  await copyFile(
    new URL("../../rehab-training/index.html", import.meta.url),
    new URL(`../../rehab-training/${name}`, import.meta.url),
  );
}
