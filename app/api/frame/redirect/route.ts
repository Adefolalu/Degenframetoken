import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    return NextResponse.redirect(process.env.DEGEN_URL as string, 302);
}