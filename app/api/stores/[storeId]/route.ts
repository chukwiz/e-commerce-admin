import { db } from "@/lib/prismadb";
import { StoreFormSchema } from "@/lib/validators/store";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    const body = await req.json();

    const { name } = StoreFormSchema.parse(body);

    if(!name) {
        return new NextResponse("Name is required", {status: 400})
    }

    if(!params.storeId) {
        return new NextResponse("Store Id is required", {status: 400})
    }

    const store =  await db.store.updateMany({
        where: {
            id: params.storeId,
            userId
        },

        data: {
            name
        }
    })

    return NextResponse.json(store)
  } catch (error) {
    console.log("store op", error);
    if (error instanceof ZodError) {
      return new NextResponse("Invalid Request data passed", { status: 422 });
    }
    return new NextResponse("internal server error", { status: 500 });
  }
}


export async function DELETE(
    req: Request,
    { params }: { params: { storeId: string } }
  ) {
    try {
      const { userId } = auth();
      if (!userId) {
        return new NextResponse("Unauthenticated", { status: 401 });
      }
  
      if(!params.storeId) {
          return new NextResponse("Store Id is required", {status: 400})
      }
  
      const store =  await db.store.deleteMany({
          where: {
              id: params.storeId,
              userId
          },
      })
  
      return NextResponse.json(store)
    } catch (error) {
      console.log("store op", error);
      if (error instanceof ZodError) {
        return new NextResponse("Invalid Request data passed", { status: 422 });
      }
      return new NextResponse("internal server error", { status: 500 });
    }
  }