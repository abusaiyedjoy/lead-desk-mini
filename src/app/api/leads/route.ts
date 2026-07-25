import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { leadFormSchema } from "@/lib/validations/lead";
import { getSession } from "@/lib/session";

// POST /api/leads — public endpoint for lead capture form
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Server-side validation with Zod
    const validationResult = leadFormSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation Error",
          details: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { name, email, budgetRange, message } = validationResult.data;

    const lead = await prisma.lead.create({
      data: {
        name,
        email,
        budgetRange,
        message,
        status: "NEW",
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Lead submitted successfully",
        data: lead,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating lead:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal Server Error",
        message: "Failed to submit lead. Please try again later.",
      },
      { status: 500 }
    );
  }
}

// GET /api/leads — admin-only: list/search leads
export async function GET(request: NextRequest) {
  // Auth guard: only authenticated admins may list leads
  const session = await getSession();
  if (!session) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("q")?.trim() || "";

    const leads = await prisma.lead.findMany({
      where: query
        ? {
            OR: [
              { name: { contains: query, mode: "insensitive" } },
              { email: { contains: query, mode: "insensitive" } },
              { message: { contains: query, mode: "insensitive" } },
              { budgetRange: { contains: query, mode: "insensitive" } },
            ],
          }
        : undefined,
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      data: leads,
    });
  } catch (error) {
    console.error("Error fetching leads:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal Server Error",
        message: "Failed to fetch leads.",
      },
      { status: 500 }
    );
  }
}
