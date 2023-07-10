import { db } from "@/lib/prismadb";
import { BillboardSchema } from "@/lib/validators/billboard";
import { StoreFormSchema } from "@/lib/validators/store";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(req: Request, {params: {storeId}}: {params: {storeId: string}}) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { label, imageUrl } = BillboardSchema.parse(body);

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if(!label) {
        return new NextResponse("Label is required", {status: 400})
    }

    if(!imageUrl) {
        return new NextResponse("Image URL is required", {status: 400})
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

    const billboard = await db.billboard.create({
        data: {
            label,
            imageUrl,
            storeId
        }
    })

    return NextResponse.json(billboard)

  } catch (error) {
    console.log("billboards post", error);
    return new NextResponse("internal server error", { status: 500 });
  }
}


export async function GET(req: Request, {params: {storeId}}: {params: {storeId: string}}) {
    try {
      
  
      if(!storeId) {
          return new NextResponse("Store Id is required", {status: 400})
      }
      
  
      const billboards = await db.billboard.findMany({
          where: {
              storeId
          }
      })
  
      return NextResponse.json(billboards)
  
    } catch (error) {
      console.log("billboards get", error);
      return new NextResponse("internal server error", { status: 500 });
    }
  }
  