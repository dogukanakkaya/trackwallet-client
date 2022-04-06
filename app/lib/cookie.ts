import { createCookie } from "remix";

export const auth = createCookie("auth", {
    httpOnly: true,
    secure: true
});