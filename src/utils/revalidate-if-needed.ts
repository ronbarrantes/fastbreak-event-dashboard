import { revalidatePath } from "next/cache";

export const revalidateIfNeeded = (paths?: string | string[]) => {
  if (!paths) return;
  const list = Array.isArray(paths) ? paths : [paths];
  for (const path of list) revalidatePath(path);
};
