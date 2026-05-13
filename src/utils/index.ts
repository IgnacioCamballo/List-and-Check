import trans from "../lenguages/lenguages.json"

export function translate({text, lenguage}:{text: string, lenguage: string}) {
  const words: {[key: string]: {lenguage: string; text: string}[]} = trans
  const object: {lenguage: string; text: string}[] = words[text]
  return object.find((i: { lenguage: string; }) => i.lenguage === lenguage)?.text
}