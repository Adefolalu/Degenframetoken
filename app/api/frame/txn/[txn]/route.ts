import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: { txn: string } }
) {
  const txn = params.txn;

  const txnUrl = `https://explorer.degen.tips/txs/${txn}`;

<<<<<<< HEAD
    const txnUrl = `https://explorer.degen.tips/tx/${txn}`;
=======
  const response = NextResponse.redirect(txnUrl, 302);
  response.headers.set("location", txnUrl);
>>>>>>> 0d29e513c94ddb6f4e416acee68fa380794c7254

  return response;
}
