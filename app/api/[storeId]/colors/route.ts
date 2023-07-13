import { db } from "@/lib/prismadb";
import { ColorsFormSchema } from "@/lib/validators/color";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(req: Request, {params: {storeId}}: {params: {storeId: string}}) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { name, value } = ColorsFormSchema.parse(body);

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if(!name) {
        return new NextResponse("Name is required", {status: 400})
    }

    if(!value) {
        return new NextResponse("Value is required", {status: 400})
    }

    if(!storeId) {
        return new NextResponse("Store Id is required", {status: 400})
    }

    const storeByUserId = await db.store.findFirst({
        where: {
            id: storeId,
            userId
        }
    })

    if(!storeByUserId) {
        return new NextResponse("Unauthorized", {status: 403})
    }

    const color = await db.color.create({
        data: {
            name,
            value,
            storeId
        }
    })

    return NextResponse.json(color)

  } catch (error) {
    console.log("colors post", error);
    return new NextResponse("internal server error", { status: 500 });
  }
}


export async function GET(req: Request, {params: {storeId}}: {params: {storeId: string}}) {
    try {
      
  
      if(!storeId) {
          return new NextResponse("Store Id is required", {status: 400})
      }
      
  
      const colors = await db.color.findMany({
          where: {
              storeId
          }
      })
  
      return NextResponse.json(colors)
  
    } catch (error) {
      console.log("colors get", error);
      return new NextResponse("internal server error", { status: 500 });
    }
  }
  