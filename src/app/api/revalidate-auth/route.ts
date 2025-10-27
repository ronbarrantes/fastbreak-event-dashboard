import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({} as { paths?: string[] }));
    const paths = Array.isArray(body?.paths) && body.paths.length > 0 ? body.paths : ["/", "/dashboard"];

    for (const p of paths) revalidatePath(p);

    return NextResponse.json({ ok: true, revalidated: paths });
  } catch (error) {
    return NextResponse.json({ ok: false, error: (error as Error).message }, { status: 500 });
  }
}
