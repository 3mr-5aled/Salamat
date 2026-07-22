import React from "react";
import { useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "../contexts/AuthContext";
import { createPatientProfile } from "../services/patient";

export const CHRONIC_DISEASES = [
  "Diabetes",
  "Hypertension",
  "Asthma",
  "Heart Disease",
  "Chronic Kidney Disease",
  "Arthritis",
  "COPD",
  "Thyroid Disorder",
  "Migraine",
];

export const profileSchema = z.object({
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  gender: z.enum(["male", "female"]),
  bloodType: z.enum(["", "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]).optional(),
  chronicDiseases: z.string().optional(),
  address: z
    .object({
      street: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      zipCode: z.string().optional(),
      country: z.string().optional(),
    })
    .optional(),
  emergencyContact: z
    .object({
      name: z.string().optional(),
      relationship: z.string().optional(),
      phone: z.string().optional(),
    })
    .optional(),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;

export function useProfileSetup() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [error, setError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { gender: "male", bloodType: "", chronicDiseases: "" },
  });

  const watchChronicDiseases = watch("chronicDiseases") || "";

  const onSubmit = async (data: ProfileFormValues) => {
    try {
      setError(null);

      const payload: any = {
        user: user?._id,
        dateOfBirth: data.dateOfBirth,
        gender: data.gender,
      };

      if (data.bloodType && (data.bloodType as string) !== "") {
        payload.bloodType = data.bloodType;
      }

      const cdText = data.chronicDiseases || "";
      const cdList = cdText
        .split(",")
        .map((d) => d.trim())
        .filter((d) => d.length > 0);
      if (cdList.length > 0) {
        payload.chronicDiseases = cdList;
      }

      // Emergency Contact Details
      const ec = data.emergencyContact;
      if (
        ec &&
        ((ec.name && ec.name.trim() !== "") ||
          (ec.relationship && ec.relationship.trim() !== "") ||
          (ec.phone && ec.phone.trim() !== ""))
      ) {
        payload.emergencyContact = {};
        if (ec.name && ec.name.trim() !== "") {
          payload.emergencyContact.name = ec.name.trim();
        }
        if (ec.relationship && ec.relationship.trim() !== "") {
          payload.emergencyContact.relation = ec.relationship.trim();
        }
        if (ec.phone && ec.phone.trim() !== "") {
          payload.emergencyContact.phone = ec.phone.trim();
        }
      }

      // Address Details
      const addr = data.address;
      if (
        addr &&
        ((addr.street && addr.street.trim() !== "") ||
          (addr.city && addr.city.trim() !== "") ||
          (addr.state && addr.state.trim() !== "") ||
          (addr.zipCode && addr.zipCode.trim() !== "") ||
          (addr.country && addr.country.trim() !== ""))
      ) {
        const parts = [
          addr.street,
          addr.city,
          addr.state,
          addr.zipCode,
          addr.country,
        ].filter((p) => p && p.trim() !== "");
        payload.address = parts.join(", ").slice(0, 200);

        payload.addresses = {
          alias: "Home",
          details: addr.street || "",
          city: addr.city || "",
          postalCode: addr.zipCode || "",
        };
      }

      await createPatientProfile(payload);
      navigate({ to: "/app" });
    } catch (err: any) {
      // Extract backend validation error if available
      const backendError =
        err?.response?.data?.errors?.[0]?.msg || err?.response?.data?.message;
      setError(backendError || "Failed to create patient profile");
    }
  };

  return {
    register,
    handleSubmit,
    errors,
    isSubmitting,
    setValue,
    watchChronicDiseases,
    error,
    onSubmit,
  };
}
