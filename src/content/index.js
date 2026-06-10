import { ar } from "./ar.js";
import { en } from "./en.js";

export function getContent(lang) {
  return lang === "en" ? en : ar;
}
