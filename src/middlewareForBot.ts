// import { NextRequest, NextResponse } from "next/server";

// // 悪質なスクレイピングボットをブロック
// const blockedBots = ["AhrefsBot", "MJ12Bot", "SemrushBot", "DotBot"];

// export async function middleware(req: NextRequest) {
//   const userAgent = req.headers.get("user-agent") || "";

//   // 悪質なボットはブロック
//   if (blockedBots.some((bot) => userAgent.includes(bot))) {
//     return NextResponse.json(
//       { error: "Bots are not allowed" },
//       { status: 403 }
//     );
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: "/:path*", // APIエンドポイントのみに適用
// };
