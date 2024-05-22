"use client";
import styles from "./page.module.scss";

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.title}>${process.env.TOKEN_SYMBOL} Token</h1>
        <h2 className={styles.subtitle}>
          The first airdrop launching with Farcaster Frames on Degen Chain!
        </h2>
        <div className={styles.info}>
          <p>
            Click on{" "}
            <span
              onClick={() => {
                window.open("https://warpcast.com/maxbr/0xdce5499f", "_blank");
              }}
            >
              this cast
            </span>{" "}
            and interact with the Frame to claim!
          </p>
          <strong>
            Must have at least one verified wallet on your account!
          </strong>
        </div>
        <strong>First 2,000 claims graciously sponsored!</strong>
        <strong>
          To help sponsor the airdrop, donate Base ETH to:
          0x7dd39E3aC366D3c031ed84343377ceFbd5A9F47F
        </strong>
        <a
          href={`https://explorer.degen.tips/address/${process.env.NEXT_PUBLIC_CONTRACT_ADDRESS}`}
          target="_blank"
        >
          View Contract on explorer.degen.tips
        </a>
        <strong>
          Allocation is based on Farcaster ID and how long you have been on the
          protocol:
        </strong>
        <p>
          <strong>Total Supply:</strong> 1 Trillion $DEFRAME
          <br />
          <strong>LP/Team Supply:</strong> 200 Billion $DEFRAME
        </p>
        <p className={styles.supply}>
          <strong>0-9999:</strong> 0.02% (2 Billion $DEFRAME)
          <br />
          <strong>10,000-99,999:</strong> 0.01% (1 Billion $DEFRAME)
          <br />
          <strong>100,000-249,999:</strong> 0.005% (500 Million $DEFRAME)
          <br />
          <strong>250,000-349,999:</strong> 0.0025% (250 Million $DEFRAME)
          <br />
          <strong>350,000+:</strong> 0.001% (100 Million $DEFRAME)
        </p>
      </div>
    </main>
  );
}
