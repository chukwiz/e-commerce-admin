import { db } from "@/lib/prismadb";
import { CategoryFormSchema } from "@/lib/validators/category";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(req: Request, {params: {storeId}}: {params: {storeId: string}}) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { name, billboardId } = CategoryFormSchema.parse(body);

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if(!name) {
        return new NextResponse("Name is required", {status: 400})
    }

    if(!billboardId) {
        return new NextResponse("Billboard is required", {status: 400})
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

    const category = await db.category.create({
        data: {
            name,
            billboardId,
            storeId
        }
    })

    return NextResponse.json(category)

  } catch (error) {
    console.log("categories post", error);
    return new NextResponse("internal server error", { status: 500 });
  }
}


export async function GET(req: Request, {params: {storeId}}: {params: {storeId: string}}) {
    try {
      
  
      if(!storeId) {
          return new NextResponse("Store Id is required", {status: 400})
      }
  
      const categories = await db.category.findMany({
          where: {
              storeId
          }
      })
  
      return NextResponse.json(categories)
  
    } catch (error) {
      console.log("categories get", error);
      return new NextResponse("internal server error", { status: 500 });
    }
  }
  