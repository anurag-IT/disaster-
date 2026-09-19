import { describe,expect,it } from "vitest";
import { normalizeNepalPhone } from "./phone";
describe("Nepal phone normalization",()=>{it("normalizes local mobile",()=>expect(normalizeNepalPhone("9812345678")).toBe("+9779812345678"));it("accepts E.164",()=>expect(normalizeNepalPhone("+9779812345678")).toBe("+9779812345678"));it("rejects invalid values",()=>expect(normalizeNepalPhone("1234")).toBeNull())});
