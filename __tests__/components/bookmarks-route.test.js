jest.mock("next/headers", () => ({
  cookies: jest.fn(),
}));

jest.mock("@/lib/auth", () => ({
  getAuthenticatedUser: jest.fn(),
}));

jest.mock("@/lib/serverApi", () => ({
  getSupabaseServerClient: jest.fn(),
  jsonResponse: (data, status = 200) => ({
    status,
    json: jest.fn().mockResolvedValue(data),
  }),
  errorResponse: (error) => ({
    status: 500,
    json: jest
      .fn()
      .mockResolvedValue({ error: error.message || "Internal server error" }),
  }),
}));

jest.mock("@/lib/csrfConstants", () => ({
  validateCsrfOrigin: jest.fn(() => true),
}));

import { cookies } from "next/headers";
import { getAuthenticatedUser } from "@/lib/auth";
import { getSupabaseServerClient } from "@/lib/serverApi";
import { DELETE } from "@/app/api/bookmarks/route";

function createDeleteBuilder(result) {
  const builder = {
    delete: jest.fn(() => builder),
    eq: jest.fn(() => builder),
    then: (resolve) => Promise.resolve(result).then(resolve),
  };

  return builder;
}

describe("bookmarks DELETE route", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    cookies.mockResolvedValue({
      getAll: jest.fn(() => []),
      set: jest.fn(),
    });

    getAuthenticatedUser.mockResolvedValue({
      success: true,
      user: { id: "student-123" },
    });
  });

  it("scopes bookmark deletes by problem and topic", async () => {
    const builder = createDeleteBuilder({ error: null });
    getSupabaseServerClient.mockReturnValue({
      from: jest.fn(() => builder),
    });

    const response = await DELETE({
      url: "http://localhost/api/bookmarks?problemId=two-sum&topicSlug=arrays",
    });
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual({ bookmarked: false });
    expect(builder.delete).toHaveBeenCalled();
    expect(builder.eq).toHaveBeenCalledWith("user_id", "student-123");
    expect(builder.eq).toHaveBeenCalledWith("problem_id", "two-sum");
    expect(builder.eq).toHaveBeenCalledWith("topic_slug", "arrays");
  });
});
