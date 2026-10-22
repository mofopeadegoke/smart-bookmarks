import { beforeEach, describe, expect, it, vi } from "vitest";
import { lookup } from "node:dns/promises";
import { assertPublicUrl } from "@/lib/safe-fetch";

// Real DNS would make these tests slow, flaky and dependent on the internet.
vi.mock("node:dns/promises", () => ({ lookup: vi.fn() }));
const mockLookup = vi.mocked(lookup) as unknown as ReturnType<typeof vi.fn>;

function resolvesTo(...addresses: string[]) {
  mockLookup.mockResolvedValue(
    addresses.map((address) => ({ address, family: address.includes(":") ? 6 : 4 })),
  );
}

beforeEach(() => {
  mockLookup.mockReset();
});

describe("assertPublicUrl", () => {
  it("allows a host that resolves to a public address", async () => {
    resolvesTo("93.184.215.14");
    const url = await assertPublicUrl("https://example.com/page");
    expect(url.href).toBe("https://example.com/page");
  });

  it.each([
    ["loopback", "127.0.0.1"],
    ["private 10.x", "10.0.0.1"],
    ["private 192.168.x", "192.168.1.1"],
    ["private 172.16.x", "172.16.0.1"],
    ["cloud metadata", "169.254.169.254"],
    ["IPv6 loopback", "::1"],
    ["unspecified", "0.0.0.0"],
    ["IPv4-mapped IPv6 loopback", "::ffff:127.0.0.1"],
  ])("blocks a %s address (%s)", async (_label, address) => {
    resolvesTo(address);
    await expect(assertPublicUrl("https://sneaky.example")).rejects.toThrow(
      "This address is not allowed",
    );
  });

  it("blocks when any one of several addresses is private", async () => {
    resolvesTo("93.184.215.14", "10.0.0.1");
    await expect(assertPublicUrl("https://mixed.example")).rejects.toThrow(
      "This address is not allowed",
    );
  });

  it("blocks raw IP links too", async () => {
    resolvesTo("127.0.0.1");
    await expect(assertPublicUrl("http://127.0.0.1:3000/admin")).rejects.toThrow(
      "This address is not allowed",
    );
  });

  it.each(["file:///etc/passwd", "ftp://example.com/", "gopher://example.com/"])(
    "rejects the non-http link %s without looking it up",
    async (link) => {
      await expect(assertPublicUrl(link)).rejects.toThrow("Only http and https links are allowed");
      expect(mockLookup).not.toHaveBeenCalled();
    },
  );

  it("reports a host that doesn't exist", async () => {
    mockLookup.mockRejectedValue(Object.assign(new Error("getaddrinfo ENOTFOUND"), { code: "ENOTFOUND" }));
    await expect(assertPublicUrl("https://does-not-exist.example")).rejects.toThrow(
      "This website doesn't exist",
    );
  });
});
