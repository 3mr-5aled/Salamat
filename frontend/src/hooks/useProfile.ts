import React, { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "../contexts/AuthContext";
import { getPatientProfile, updatePatientProfile } from "../services/patient";
import { getDoctorProfile, updateDoctorProfile } from "../services/doctor";

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface PatientData {
  fullName: string;
  dateOfBirth: string;
  gender: string;
  bloodType: string;
  chronicDiseases: string;
  emergencyContact: EmergencyContact;
  address: Address;
}

export interface DoctorData {
  fullName: string;
  gender: string;
  dateOfBirth: string;
  specialization: string;
  yearsOfExperience: number;
  qualifications: string[];
  qualificationsText: string;
}

export function useProfile() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Common state
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [profileId, setProfileId] = useState<string | null>(null);

  // Patient-specific state
  const [patientData, setPatientData] = useState<PatientData>({
    fullName: "",
    dateOfBirth: "",
    gender: "male",
    bloodType: "",
    chronicDiseases: "",
    emergencyContact: {
      name: "",
      relationship: "",
      phone: "",
    },
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
    },
  });

  // Doctor-specific state
  const [doctorData, setDoctorData] = useState<DoctorData>({
    fullName: "",
    gender: "male",
    dateOfBirth: "",
    specialization: "",
    yearsOfExperience: 0,
    qualifications: [],
    qualificationsText: "",
  });

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate({ to: "/app/login" });
      return;
    }

    const fetchProfile = async () => {
      if (!user) return;
      try {
        setLoading(true);
        setError(null);

        if (user.role === "patient") {
          const profile = await getPatientProfile(user._id);
          if (profile) {
            setProfileId(profile._id);

            // Format DOB for date input (YYYY-MM-DD)
            let formattedDob = "";
            if (profile.dateOfBirth) {
              formattedDob = new Date(profile.dateOfBirth).toISOString().split("T")[0];
            }

            // Map address object from database
            const addrDb = profile.addresses || {};

            // Map emergency contact relation from database
            const ecDb = profile.emergencyContact || {};

            setPatientData({
              fullName: profile.fullName || user.name || "",
              dateOfBirth: formattedDob,
              gender: profile.gender || "male",
              bloodType: profile.bloodType === "Unknown" ? "" : profile.bloodType || "",
              chronicDiseases: (profile.chronicDiseases || []).join(", "),
              emergencyContact: {
                name: ecDb.name || "",
                relationship: ecDb.relation || "",
                phone: ecDb.phone || "",
              },
              address: {
                street: addrDb.details || "",
                city: addrDb.city || "",
                state: "",
                zipCode: addrDb.postalCode || "",
                country: "",
              },
            });
          }
        } else if (user.role === "doctor") {
          const profile = await getDoctorProfile(user._id);
          if (profile) {
            setProfileId(profile._id);

            let formattedDob = "";
            if (profile.dateOfBirth) {
              formattedDob = new Date(profile.dateOfBirth).toISOString().split("T")[0];
            }

            setDoctorData({
              fullName: profile.fullName || user.name || "",
              gender: profile.gender || "male",
              dateOfBirth: formattedDob,
              specialization: profile.specialization || "",
              yearsOfExperience: profile.yearsOfExperience || 0,
              qualifications: profile.qualifications || [],
              qualificationsText: (profile.qualifications || []).join(", "),
            });
          }
        }
      } catch (err: any) {
        console.error("Failed to load profile:", err);
        setError("Failed to load profile details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user, isAuthenticated, authLoading, navigate]);

  // Handle patient input changes
  const handlePatientChange = (field: string, value: any) => {
    setPatientData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePatientNestedChange = (
    parent: "emergencyContact" | "address",
    field: string,
    value: string
  ) => {
    setPatientData((prev) => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value,
      },
    }));
  };

  // Handle doctor input changes
  const handleDoctorChange = (field: string, value: any) => {
    setDoctorData((prev) => ({ ...prev, [field]: value }));
  };

  const handleDoctorQualificationsChange = (value: string) => {
    const list = value
      .split(",")
      .map((q) => q.trim())
      .filter((q) => q.length > 0);
    setDoctorData((prev) => ({
      ...prev,
      qualificationsText: value,
      qualifications: list,
    }));
  };

  // Submit handlers
  const handlePatientSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileId) return;

    try {
      setSubmitting(true);
      setError(null);
      setSuccess(null);

      if (!patientData.fullName.trim()) {
        throw new Error("Full name is required");
      }
      if (!patientData.dateOfBirth) {
        throw new Error("Date of birth is required");
      }

      const payload: any = {
        fullName: patientData.fullName.trim(),
        dateOfBirth: patientData.dateOfBirth,
        gender: patientData.gender,
      };

      // Optional blood type mapping
      if (patientData.bloodType && patientData.bloodType !== "") {
        payload.bloodType = patientData.bloodType;
      } else {
        payload.bloodType = "Unknown";
      }

      const cdList = patientData.chronicDiseases
        .split(",")
        .map((d) => d.trim())
        .filter((d) => d.length > 0);
      payload.chronicDiseases = cdList;

      // Optional emergency contact details
      const ec = patientData.emergencyContact;
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
      } else {
        payload.emergencyContact = undefined;
      }

      // Optional address details
      const addr = patientData.address;
      if (
        addr &&
        ((addr.street && addr.street.trim() !== "") ||
          (addr.city && addr.city.trim() !== "") ||
          (addr.state && addr.state.trim() !== "") ||
          (addr.zipCode && addr.zipCode.trim() !== ""))
      ) {
        const parts = [addr.street, addr.city, addr.state, addr.zipCode].filter(
          (p) => p && p.trim() !== ""
        );
        payload.address = parts.join(", ").slice(0, 200);

        payload.addresses = {
          alias: "Home",
          details: addr.street || "",
          city: addr.city || "",
          postalCode: addr.zipCode || "",
        };
      } else {
        payload.address = undefined;
        payload.addresses = undefined;
      }

      await updatePatientProfile(profileId, payload);
      setSuccess("Profile details updated successfully.");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: any) {
      console.error("Patient submit error:", err);
      const backendError =
        err?.response?.data?.errors?.[0]?.msg ||
        err?.response?.data?.message ||
        err.message;
      setError(backendError || "Failed to update profile");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDoctorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileId) return;

    try {
      setSubmitting(true);
      setError(null);
      setSuccess(null);

      if (!doctorData.fullName.trim()) {
        throw new Error("Doctor full name is required");
      }
      if (!doctorData.specialization.trim()) {
        throw new Error("Specialization is required");
      }

      const payload: any = {
        fullName: doctorData.fullName.trim(),
        specialization: doctorData.specialization.trim(),
        gender: doctorData.gender,
      };

      if (doctorData.dateOfBirth) {
        payload.dateOfBirth = doctorData.dateOfBirth;
      }

      if (doctorData.yearsOfExperience >= 0) {
        payload.yearsOfExperience = Number(doctorData.yearsOfExperience);
      }

      if (doctorData.qualifications && doctorData.qualifications.length > 0) {
        payload.qualifications = doctorData.qualifications;
      } else {
        payload.qualifications = [];
      }

      await updateDoctorProfile(profileId, payload);
      setSuccess("Professional profile updated successfully.");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: any) {
      console.error("Doctor submit error:", err);
      const backendError =
        err?.response?.data?.errors?.[0]?.msg ||
        err?.response?.data?.message ||
        err.message;
      setError(backendError || "Failed to update profile");
    } finally {
      setSubmitting(false);
    }
  };

  return {
    user,
    authLoading,
    loading,
    submitting,
    error,
    success,
    profileId,
    patientData,
    doctorData,
    handlePatientChange,
    handlePatientNestedChange,
    handleDoctorChange,
    handleDoctorQualificationsChange,
    handlePatientSubmit,
    handleDoctorSubmit,
  };
}
