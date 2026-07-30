import {
  safeAvatarUrl,
  safeExternalUrl,
  MAX_AVATAR_URL_LENGTH,
  sanitizeProfileLinks,
  buildFormDataFromUser,
  MAX_BIO_LENGTH,
  normalizeProfilePayload,
  validateProfileForm,
  isOnboardingStep1Valid,
  shouldShowProfileSetup,
} from "../src/lib/profileUtils.js";

describe("safeAvatarUrl", () => {
  test("returns a valid https URL unchanged", () => {
    expect(safeAvatarUrl("https://example.com/avatar.png"))
      .toBe("https://example.com/avatar.png");
  });

  test("rejects data URLs", () => {
    expect(safeAvatarUrl("data:image/png;base64,AAAA")).toBe("");
  });

  test("rejects non-string values", () => {
    expect(safeAvatarUrl(null)).toBe("");
    expect(safeAvatarUrl(undefined)).toBe("");
    expect(safeAvatarUrl(123)).toBe("");
    expect(safeAvatarUrl({})).toBe("");
  });

  test("rejects URLs longer than the maximum length", () => {
    const url =
      "https://example.com/" +
      "a".repeat(MAX_AVATAR_URL_LENGTH);

    expect(safeAvatarUrl(url)).toBe("");
  });
});

describe("safeExternalUrl", () => {
  test("accepts valid https URLs", () => {
    expect(safeExternalUrl("https://example.com")).toBe(
      "https://example.com/"
    );
  });

  test("accepts valid http URLs", () => {
    expect(safeExternalUrl("http://example.com")).toBe(
      "http://example.com/"
    );
  });

  test("rejects ftp URLs", () => {
    expect(safeExternalUrl("ftp://example.com")).toBe("");
  });

  test("rejects javascript URLs", () => {
    expect(safeExternalUrl("javascript:alert('xss')")).toBe("");
  });

  test("rejects malformed URLs", () => {
    expect(safeExternalUrl("not-a-url")).toBe("");
  });

  test("rejects non-string values", () => {
    expect(safeExternalUrl(null)).toBe("");
    expect(safeExternalUrl(undefined)).toBe("");
    expect(safeExternalUrl(123)).toBe("");
    expect(safeExternalUrl({})).toBe("");
  });
});

describe("sanitizeProfileLinks", () => {
  test("accepts valid profile URLs", () => {
    const result = sanitizeProfileLinks({
      github_profile: "https://github.com/user",
      linkedin_profile: "https://linkedin.com/in/user",
      resume_link: "https://example.com/resume.pdf",
    });

    expect(result.error).toBeUndefined();
    expect(result.data.github_profile).toBe("https://github.com/user");
    expect(result.data.linkedin_profile).toBe("https://linkedin.com/in/user");
    expect(result.data.resume_link).toBe("https://example.com/resume.pdf");
  });

  test("trims whitespace before validating", () => {
    const result = sanitizeProfileLinks({
      github_profile: "  https://github.com/user  ",
      linkedin_profile: "",
      resume_link: "",
    });

    expect(result.error).toBeUndefined();
    expect(result.data.github_profile).toBe("https://github.com/user");
  });

  test("converts empty values to empty strings", () => {
    const result = sanitizeProfileLinks({
      github_profile: "",
      linkedin_profile: undefined,
      resume_link: null,
    });

    expect(result.error).toBeUndefined();
    expect(result.data.github_profile).toBe("");
    expect(result.data.linkedin_profile).toBe("");
    expect(result.data.resume_link).toBe("");
  });

  test("returns an error for invalid URLs", () => {
    const result = sanitizeProfileLinks({
      github_profile: "not-a-url",
      linkedin_profile: "",
      resume_link: "",
    });

    expect(result).toEqual({
      error: "Please enter valid http or https URLs for profile links.",
    });
  });

  test("rejects javascript URLs", () => {
    const result = sanitizeProfileLinks({
      github_profile: "javascript:alert(1)",
      linkedin_profile: "",
      resume_link: "",
    });

    expect(result.error).toBeDefined();
  });

  test("does not mutate the original object", () => {
    const original = {
      github_profile: " https://github.com/user ",
      linkedin_profile: "",
      resume_link: "",
    };

    const copy = { ...original };

    sanitizeProfileLinks(original);

    expect(original).toEqual(copy);
  });
});

describe("buildFormDataFromUser", () => {
  test("builds form data from complete user metadata", () => {
    const user = {
      user_metadata: {
        name: "John Doe",
        branch: "CSE",
        college: "ABC College",
        location: "New York",
        skills: "JavaScript, React",
        github_profile: "https://github.com/john",
        linkedin_profile: "https://linkedin.com/in/john",
        resume_link: "https://example.com/resume.pdf",
        avatar_url: "https://example.com/avatar.png",
        leetcode_username: "john123",
        leetcode_solved: 200,
        codeforces_username: "john_cf",
        codeforces_rating: 1500,
        codechef_username: "john_cc",
        codechef_stars: 4,
        github_username: "john",
        github_contributions: 100,
        projects: [{ title: "AlgoBuddy" }],
      },
    };

    const result = buildFormDataFromUser(user);

    expect(result.name).toBe("John Doe");
    expect(result.branch).toBe("CSE");
    expect(result.projects).toEqual([{ title: "AlgoBuddy" }]);
    expect(result.avatar_url).toBe("https://example.com/avatar.png");
  });

  test("returns default values when metadata is missing", () => {
    const result = buildFormDataFromUser({});

    expect(result.name).toBe("");
    expect(result.skills).toBe("");
    expect(result.projects).toEqual([]);
    expect(result.email_notifications).toBe(true);
  });

  test("falls back to address when location is missing", () => {
    const result = buildFormDataFromUser({
      user_metadata: {
        address: "Mumbai",
      },
    });

    expect(result.location).toBe("Mumbai");
  });

  test("falls back to picture when avatar_url is missing", () => {
    const result = buildFormDataFromUser({
      user_metadata: {
        picture: "https://example.com/picture.png",
      },
    });

    expect(result.avatar_url).toBe("https://example.com/picture.png");
  });

  test("truncates skills to MAX_BIO_LENGTH", () => {
    const skills = "a".repeat(MAX_BIO_LENGTH + 50);

    const result = buildFormDataFromUser({
      user_metadata: { skills },
    });

    expect(result.skills.length).toBe(MAX_BIO_LENGTH);
  });

  test("defaults projects to an empty array when not an array", () => {
    const result = buildFormDataFromUser({
      user_metadata: {
        projects: "invalid",
      },
    });

    expect(result.projects).toEqual([]);
  });
});

describe("normalizeProfilePayload", () => {
  test("converts numeric strings into numbers", () => {
    const result = normalizeProfilePayload({
      leetcode_solved: "120",
      codeforces_rating: "1500",
      codechef_stars: "3",
      github_contributions: "55",
      projects: [],
    });

    expect(result.leetcode_solved).toBe(120);
    expect(result.codeforces_rating).toBe(1500);
    expect(result.codechef_stars).toBe(3);
    expect(result.github_contributions).toBe(55);
  });

  test("defaults invalid numeric values to zero", () => {
    const result = normalizeProfilePayload({
      leetcode_solved: "abc",
      codeforces_rating: null,
      codechef_stars: undefined,
      github_contributions: "",
      projects: [],
    });

    expect(result.leetcode_solved).toBe(0);
    expect(result.codeforces_rating).toBe(0);
    expect(result.codechef_stars).toBe(0);
    expect(result.github_contributions).toBe(0);
  });

  test("defaults projects to an empty array", () => {
    const result = normalizeProfilePayload({
      projects: "invalid",
    });

    expect(result.projects).toEqual([]);
  });
});

describe("validateProfileForm", () => {
  test("returns null in edit mode", () => {
    expect(validateProfileForm({}, "edit")).toBeNull();
  });

  test("requires full name during onboarding", () => {
    expect(
      validateProfileForm(
        {
          name: "",
          skills: "React",
        },
        "onboarding"
      )
    ).toBe("Full name is required.");
  });

  test("requires bio during onboarding", () => {
    expect(
      validateProfileForm(
        {
          name: "John",
          skills: "",
        },
        "onboarding"
      )
    ).toBe("Bio is required.");
  });

  test("accepts valid onboarding data", () => {
    expect(
      validateProfileForm(
        {
          name: "John",
          skills: "React",
        },
        "onboarding"
      )
    ).toBeNull();
  });

  test("treats whitespace-only values as empty", () => {
    expect(
      validateProfileForm(
        {
          name: "   ",
          skills: "React",
        },
        "onboarding"
      )
    ).toBe("Full name is required.");
  });
});

describe("isOnboardingStep1Valid", () => {
  test("returns true when required fields are present", () => {
    expect(
      isOnboardingStep1Valid({
        name: "John",
        skills: "React",
      })
    ).toBe(true);
  });

  test("returns false when name is missing", () => {
    expect(
      isOnboardingStep1Valid({
        name: "",
        skills: "React",
      })
    ).toBe(false);
  });

  test("returns false when skills are missing", () => {
    expect(
      isOnboardingStep1Valid({
        name: "John",
        skills: "",
      })
    ).toBe(false);
  });

  test("returns false for whitespace-only values", () => {
    expect(
      isOnboardingStep1Valid({
        name: "   ",
        skills: "React",
      })
    ).toBe(false);
  });
});

describe("shouldShowProfileSetup", () => {
  test("returns false when user is null", () => {
    expect(shouldShowProfileSetup(null)).toBe(false);
  });

  test("returns true when onboarding has not been completed", () => {
    expect(
      shouldShowProfileSetup({
        user_metadata: {},
      })
    ).toBe(true);
  });

  test("returns false when onboarding has been completed", () => {
    expect(
      shouldShowProfileSetup({
        user_metadata: {
          hasSeenProfileSetup: true,
        },
      })
    ).toBe(false);
  });

  test("returns true when hasSeenProfileSetup is false", () => {
    expect(
      shouldShowProfileSetup({
        user_metadata: {
          hasSeenProfileSetup: false,
        },
      })
    ).toBe(true);
  });
});

