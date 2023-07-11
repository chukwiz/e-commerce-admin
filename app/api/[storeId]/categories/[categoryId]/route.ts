import { db } from "@/lib/prismadb";
import { CategoryFormSchema } from "@/lib/validators/category";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

export async function GET(
  req: Request,
  { params: { categoryId } }: { params: { categoryId: string } }
) {
  try {
    if (!categoryId) {
      return new NextResponse("Category Id is required", { status: 400 });
    }

    const category = await db.category.findUnique({
      where: {
        id: categoryId,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.log("category get error", error);
    if (error instanceof ZodError) {
      return new NextResponse("Invalid Request data passed", { status: 422 });
    }
    return new NextResponse("internal server error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  {
    params: { storeId, categoryId },
  }: { params: { storeId: string; categoryId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    const body = await req.json();

    const { name, billboardId } = CategoryFormSchema.parse(body);

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!billboardId) {
      return new NextResponse("Billboard is required", { status: 400 });
    }

    if (!categoryId) {
      return new NextResponse("Category Id is required", { status: 400 });
    }

    const storeByUserId = await db.store.findFirst({
      where: {
        id: storeId,
        userId,
      },
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const category = await db.category.updateMany({
      where: {
        id: categoryId,
      },

      data: {
        name,
        billboardId
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.log("category patch", error);
    if (error instanceof ZodError) {
      return new NextResponse("Invalid Request data passed", { status: 422 });
    }
    return new NextResponse("internal server error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  {
    params: { storeId, categoryId },
  }: { params: { storeId: string; categoryId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!categoryId) {
      return new NextResponse("category is required", { status: 400 });
    }

    const storeByUserId = await db.store.findFirst({
      where: {
        id: storeId,
        userId,
      },
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const category = await db.category.deleteMany({
      where: {
        id: categoryId,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.log("category delete", error);
    if (error instanceof ZodError) {
      return new NextResponse("Invalid Request data passed", { status: 422 });
    }
    return new NextResponse("internal server error", { status: 500 });
  }
}
