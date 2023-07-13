import { db } from "@/lib/prismadb";
import { ColorsFormSchema } from "@/lib/validators/color";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

export async function GET(
  req: Request,
  { params: { colorId } }: { params: { colorId: string } }
) {
  try {
    if (!colorId) {
      return new NextResponse("Color is required", { status: 400 });
    }

    const color = await db.color.findUnique({
      where: {
        id: colorId,
      },
    });

    return NextResponse.json(color);
  } catch (error) {
    console.log("color get error", error);
    if (error instanceof ZodError) {
      return new NextResponse("Invalid Request data passed", { status: 422 });
    }
    return new NextResponse("internal server error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  {
    params: { storeId, colorId },
  }: { params: { storeId: string; colorId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    const body = await req.json();

    const { name, value } = ColorsFormSchema.parse(body);

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!value) {
      return new NextResponse("Value is required", { status: 400 });
    }

    if (!colorId) {
      return new NextResponse("Color is required", { status: 400 });
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

    const color = await db.color.updateMany({
      where: {
        id: colorId,
      },

      data: {
        name,
        value
      },
    });

    return NextResponse.json(color);
  } catch (error) {
    console.log("color patch", error);
    if (error instanceof ZodError) {
      return new NextResponse("Invalid Request data passed", { status: 422 });
    }
    return new NextResponse("internal server error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  {
    params: { storeId, colorId },
  }: { params: { storeId: string; colorId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!colorId) {
      return new NextResponse("Color is required", { status: 400 });
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

    const color = await db.color.deleteMany({
      where: {
        id: colorId,
      },
    });

    return NextResponse.json(color);
  } catch (error) {
    console.log("Color Error", error);
    if (error instanceof ZodError) {
      return new NextResponse("Invalid Request data passed", { status: 422 });
    }
    return new NextResponse("internal server error", { status: 500 });
  }
}
