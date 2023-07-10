import { db } from "@/lib/prismadb";
import { BillboardSchema } from "@/lib/validators/billboard";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

export async function GET(
  req: Request,
  { params: { billboardId } }: { params: { billboardId: string } }
) {
  try {
    if (!billboardId) {
      return new NextResponse("Billboard Id is required", { status: 400 });
    }

    const billboard = await db.billboard.findUnique({
      where: {
        id: billboardId,
      },
    });

    return NextResponse.json(billboard);
  } catch (error) {
    console.log("billboard get error", error);
    if (error instanceof ZodError) {
      return new NextResponse("Invalid Request data passed", { status: 422 });
    }
    return new NextResponse("internal server error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  {
    params: { storeId, billboardId },
  }: { params: { storeId: string; billboardId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    const body = await req.json();

    const { label, imageUrl } = BillboardSchema.parse(body);

    if (!label) {
      return new NextResponse("Label is required", { status: 400 });
    }

    if (!imageUrl) {
      return new NextResponse("Image URL is required", { status: 400 });
    }

    if (!billboardId) {
      return new NextResponse("Billboard Id is required", { status: 400 });
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

    const billboard = await db.billboard.updateMany({
      where: {
        id: billboardId,
      },

      data: {
        label,
        imageUrl,
      },
    });

    return NextResponse.json(billboard);
  } catch (error) {
    console.log("billboard patch", error);
    if (error instanceof ZodError) {
      return new NextResponse("Invalid Request data passed", { status: 422 });
    }
    return new NextResponse("internal server error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  {
    params: { storeId, billboardId },
  }: { params: { storeId: string; billboardId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!billboardId) {
      return new NextResponse("Billboard Id is required", { status: 400 });
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

    const billboard = await db.billboard.deleteMany({
      where: {
        id: billboardId,
      },
    });

    return NextResponse.json(billboard);
  } catch (error) {
    console.log("billboard error", error);
    if (error instanceof ZodError) {
      return new NextResponse("Invalid Request data passed", { status: 422 });
    }
    return new NextResponse("internal server error", { status: 500 });
  }
}
