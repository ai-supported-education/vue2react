import { execFile } from "node:child_process";

export const SUPPORT_REF = "course-support";

export type SupportLoader = (root: string, relativePath: string) => Promise<string>;

export const readSupportFile: SupportLoader = async (root, relativePath) => {
  const normalizedPath = relativePath.replaceAll("\\", "/");
  if (
    normalizedPath.startsWith("/") ||
    normalizedPath.split("/").includes("..")
  ) {
    throw new Error(`Некорректный support path: ${relativePath}`);
  }

  return new Promise((resolve, reject) => {
    execFile(
      "git",
      ["-C", root, "show", `${SUPPORT_REF}:support/${normalizedPath}`],
      { encoding: "utf8", maxBuffer: 1024 * 1024 },
      (error, stdout, stderr) => {
        if (error) {
          reject(
            new Error(
              [
                `Не удалось прочитать support/${normalizedPath} из Git ref ${SUPPORT_REF}.`,
                "Проверьте, что repository и support branch установлены.",
                stderr.trim()
              ]
                .filter(Boolean)
                .join("\n")
            )
          );
          return;
        }
        resolve(stdout);
      }
    );
  });
};
