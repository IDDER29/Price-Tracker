export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/((?!singUp).*)", // Match all paths except /singUp
  ],
};
