"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { supabase } from "@/lib/supabase";
import {
  AVATAR_BUCKET,
  MAX_AVATAR_FILE_SIZE,
  MAX_BIO_LENGTH,
  buildFormDataFromUser,
  normalizeProfilePayload,
  sanitizeProfileLinks,
  safeAvatarUrl,
  validateProfileForm,
} from "@/lib/profileUtils";

export function useProfileForm(user, setUser) {
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState(buildFormDataFromUser(user));
  const [saving, setSaving] = useState(false);
  const [savingAvatar, setSavingAvatar] = useState(false);
  const activeUserIdRef = useRef(user?.id || null);

  useEffect(() => {
    const nextUserId = user?.id || null;

    if (nextUserId === activeUserIdRef.current) return;

    activeUserIdRef.current = nextUserId;
    setFormData(buildFormDataFromUser(user));
  }, [user]);

  const handleChange = useCallback((event) => {
    const { name, type, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]:
        name === "skills" ? value.slice(0, MAX_BIO_LENGTH) : type === "number" ? Number(value) : value,
    }));
  }, []);

  const handleAvatarChange = useCallback(
    async (event, { persistImmediately = true } = {}) => {
      const file = event.target.files?.[0];
      if (!file || !user) return;

      if (!file.type.startsWith("image/")) {
        event.target.value = "";
        toast.error("Please choose an image file");
        return;
      }

      if (file.size > MAX_AVATAR_FILE_SIZE) {
        event.target.value = "";
        toast.error("Image size should be less than 2MB");
        return;
      }

      setSavingAvatar(true);

      try {
        const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
        const filePath = `${user.id}/avatar-${Date.now()}.${extension}`;
        const { error: uploadError } = await supabase.storage
          .from(AVATAR_BUCKET)
          .upload(filePath, file, {
            cacheControl: "3600",
            contentType: file.type,
            upsert: true,
          });

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage.from(AVATAR_BUCKET).getPublicUrl(filePath);

        const avatarUrl = safeAvatarUrl(publicUrlData?.publicUrl);
        if (!avatarUrl) throw new Error("Could not create a compact avatar URL");

        const nextProfileData = { ...formData, avatar_url: avatarUrl };
        setFormData(nextProfileData);

        if (persistImmediately) {
          const { data, error } = await supabase.auth.updateUser({
            data: nextProfileData,
          });

          if (error) throw error;
          setUser(data.user);
          toast.success("Profile photo updated");
        }
      } catch (error) {
        console.error(error);
        toast.error(
          error?.message?.includes("Bucket")
            ? "Create a public Supabase Storage bucket named avatars"
            : "Failed to update profile photo"
        );
      } finally {
        setSavingAvatar(false);
        event.target.value = "";
      }
    },
    [formData, setUser, user]
  );

  const markProfileSetupSeen = useCallback(async () => {
    const { data, error } = await supabase.auth.updateUser({
      data: { hasSeenProfileSetup: true },
    });

    if (error) throw error;
    setUser(data.user);
    return data.user;
  }, [setUser]);

  const saveProfile = useCallback(
    async ({ mode = "edit", markSetupSeen = false, onSuccess } = {}) => {
      const validationError = validateProfileForm(formData, mode);
      if (validationError) {
        toast.error(validationError);
        return { ok: false };
      }

      const sanitized = sanitizeProfileLinks(formData);
      if (sanitized.error) {
        toast.error(sanitized.error);
        return { ok: false };
      }

      setSaving(true);

      try {
        const nextProfileData = normalizeProfilePayload({
          ...sanitized.data,
          ...(markSetupSeen ? { hasSeenProfileSetup: true } : {}),
        });

        const { data, error } = await supabase.auth.updateUser({ data: nextProfileData });

        if (error) throw error;

        setUser(data.user);
        setFormData(nextProfileData);
        onSuccess?.(nextProfileData);
        return { ok: true, data: nextProfileData };
      } catch (error) {
        console.error(error);
        toast.error("Failed to update profile");
        return { ok: false };
      } finally {
        setSaving(false);
      }
    },
    [formData, setUser]
  );

  return {
    formData,
    setFormData,
    saving,
    savingAvatar,
    fileInputRef,
    handleChange,
    handleAvatarChange,
    saveProfile,
    markProfileSetupSeen,
  };
}
