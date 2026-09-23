// Phone formats the privacy guards reject: mobile runs, landlines with an area
// code in brackets, and dashed local numbers. Years and ranges pass.
const PHONE = [/\+?\d[\d\s-]{8,}\d/, /\(\d{2,4}\)\s*\d{3}[\s-]?\d{4}/, /\b\d{3}-\d{4}\b/]

export function hasPhone(text: string): boolean {
  return PHONE.some((re) => re.test(text))
}
