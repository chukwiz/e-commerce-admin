import { db } from "@/lib/prismadb";
import { StoreFormSchema } from "@/lib/validators/store";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { name } = StoreFormSchema.parse(body);

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if(!name) {
        return new NextResponse("Name is required", {status: 400})
    }

    const store = await db.store.create({
        data: {
            name,
            userId
        }
    })

    return NextResponse.json(store)

  } catch (error) {
    console.log("store op", error);
    return new NextResponse("internal server error", { status: 500 });
  }
}
