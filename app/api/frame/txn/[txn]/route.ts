import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: { txn: string } }
) {
  const txn = params.txn;

  const txnUrl = `https://explorer.degen.tips/txs/${txn}`;

  const response = NextResponse.redirect(txnUrl, 302);
  response.headers.set("location", txnUrl);

  return response;
}
