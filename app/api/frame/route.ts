import {
  FrameRequest,
  getFrameAccountAddress,
  getFrameHtmlResponse,
  getFrameMessage,
} from "@coinbase/onchainkit";
import { NextRequest, NextResponse } from "next/server";
import {
  createPublicClient,
  createWalletClient,
  fallback,
  formatEther,
  getAddress,
  http,
} from "viem";
import { degen } from "viem/chains";
import ERC20 from "../../abi/erc20.json";
import { privateKeyToAccount } from "viem/accounts";

const client = createPublicClient({
  chain: degen,
  transport: fallback([http(process.env.DEGEN_RPC_URL as string), http()]),
});

const walletClient = createWalletClient({
  chain: degen,
  transport: fallback([http(process.env.DEGEN_RPC_URL as string), http()]),
});

const account = privateKeyToAccount(process.env.PRIVATE_KEY as `0x${string}`);

function getImageUrl(fid: number) {
  const degen = process.env.DEGEN_URL + "/images/";

  console.info(`FID REQUEST: ${fid}`);
  if (0 <= fid && fid <= 9_999) {
    return degen + "2Billion.png";
  } else if (10_000 >= fid && fid <= 99_999) {
    return degen + "1Billion.png";
  } else if (100_000 >= fid && fid <= 249_999) {
    return degen + "500Million.png";
  } else if (250_000 >= fid && fid <= 349_999) {
    return degen + "250Million.png";
  } else {
    return degen + "100Million.png";
  }
}

async function getResponse(req: NextRequest): Promise<NextResponse> {
  let accountAddress: string | undefined = "";

  const body: FrameRequest = await req.json();
  const { isValid, message } = await getFrameMessage(body);

  if (isValid && message.fid) {
    if (message.buttonIndex == 2) {
      return NextResponse.redirect(process.env.DEGEN_URL as string, 302);
    }

    try {
      accountAddress = await getFrameAccountAddress(message, {
        AIRSTACK_API_KEY: process.env.AIRSTACK_API_KEY,
      });
    } catch (err) {
      console.error(err);
      return new NextResponse(
        getFrameHtmlResponse({
          buttons: [
            {
              label: `Something Went Wrong! Try Again Later`,
              action: "post",
            },
          ],
          image: process.env.DEGEN_URL + "/images/UhOh.png",
          post_url: process.env.DEGEN_URL + "/api/frame",
        }),
        { status: 200 }
      );
    }

    const claimed = await client.readContract({
      address: process.env
        .NEXT_PUBLIC_CONTRACT_ADDRESS_ADDRESS as `0x${string}`,
      functionName: "airdropClaimed",
      args: [message.fid],
      abi: ERC20,
    });

    if (claimed) {
      const balance = await client.readContract({
        address: process.env
          .NEXT_PUBLIC_CONTRACT_ADDRESS_ADDRESS as `0x${string}`,
        functionName: "balanceOf",
        args: [accountAddress],
        abi: ERC20,
      });
      return new NextResponse(
        getFrameHtmlResponse({
          buttons: [
            {
              label: `Claimed ${parseInt(
                formatEther(balance as bigint)
              ).toLocaleString()} $${process.env.TOKEN_SYMBOL}!`,
              action: "post",
            },
            {
              label: "Donate to help fund the airdrop!",
              action: "post_redirect",
            },
          ],
          image: getImageUrl(message.fid),
          post_url: process.env.DEGEN_URL + "/api/frame/redirect",
        })
      );
    }

    const totalSupply = await client.readContract({
      address: process.env
        .NEXT_PUBLIC_CONTRACT_ADDRESS_ADDRESS as `0x${string}`,
      functionName: "totalSupply",
      abi: ERC20,
    });

    if (parseInt((totalSupply as bigint).toString()) >= 1_000_000_000_000) {
      return new NextResponse(
        getFrameHtmlResponse({
          buttons: [
            {
              label: `Airdrop is Sold Out!`,
              action: "post",
            },
            {
              label: "Donate towards LP!",
              action: "post_redirect",
            },
          ],
          image: process.env.DEGEN_URL + "/images/UhOh.png",
          post_url: process.env.DEGEN_URL + "/api/frame/redirect",
        })
      );
    }

    try {
      const txnHash = await walletClient.writeContract({
        address: process.env
          .NEXT_PUBLIC_CONTRACT_ADDRESS_ADDRESS as `0x${string}`,
        functionName: "claimAirdrop",
        args: [message.fid, getAddress(accountAddress as `0x${string}`)],
        abi: ERC20,
        account,
      });

      if (txnHash) {
        return new NextResponse(
          getFrameHtmlResponse({
            buttons: [
              {
                label: `Claimed! Check Your Wallet on degen`,
                action: "post",
              },
              {
                label: "Donate to help fund the airdrop!",
                action: "post_redirect",
              },
            ],
            image: getImageUrl(message.fid),
            post_url: process.env.DEGEN_URL + "/api/frame",
          })
        );
      }
    } catch (err) {
      console.error(err);
      return new NextResponse(
        getFrameHtmlResponse({
          buttons: [
            {
              label: `Something Went Wrong! Try Again Later`,
              action: "post",
            },
          ],
          image: process.env.DEGEN_URL + "/images/UhOh.png",
          post_url: process.env.DEGEN_URL + "/api/frame",
        }),
        { status: 200 }
      );
    }
  }
  return new NextResponse(
    getFrameHtmlResponse({
      buttons: [
        {
          label: `Claim has ended!`,
          action: "post",
        },
        {
          label: "Donate to help fund LP",
          action: "post_redirect",
        },
      ],
      image: process.env.DEGEN_URL + "/images/DefaultFrame.png",
      post_url: process.env.DEGEN_URL + "/api/frame",
    }),
    { status: 200 }
  );
}

export async function POST(req: NextRequest) {
  return await getResponse(req);
}
