import { createRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { rootRoute } from "./__root";
import { useAuth } from "../contexts/AuthContext";
import { useDoctorDashboard } from "../hooks/useDoctorDashboard";
import { usePatientDashboard } from "../hooks/usePatientDashboard";
import { LoadingSpinner } from "../components/shared/LoadingSpinner";
import { DoctorSidebar } from "../components/doctor/DoctorSidebar";
import { DoctorTabs } from "../components/doctor/DoctorTabs";
import { ConsultationPanel } from "../components/doctor/ConsultationPanel";
import { ContactAdminModal } from "../components/doctor/ContactAdminModal";
import { PatientSidebar } from "../components/patient/PatientSidebar";
import { PatientTabs } from "../components/patient/PatientTabs";
import { BookingConfirmModal } from "../components/patient/BookingConfirmModal";
import { PrescriptionModal } from "../components/patient/PrescriptionModal";

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: "/app",
  component: DashboardPortalComponent,
});

function DashboardPortalComponent() {
  const { user, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate({ to: "/app/login" });
    } else if (isAuthenticated && user?.role === "admin") {
      navigate({ to: "/app/admin" });
    }
  }, [loading, isAuthenticated, user, navigate]);
  const doctor = useDoctorDashboard();
  const patient = usePatientDashboard();

  if (loading || (user?.role === "patient" && patient.checkingProfile)) {
    return <LoadingSpinner label="Authenticating portal..." fullScreen />;
  }

  if (user?.role === "doctor") {
    return (
      <div className="flex flex-1 h-screen relative bg-[#F8FAFC]">
        <DoctorSidebar
          activeTab={doctor.activeTab}
          setActiveTab={doctor.setActiveTab}
          onContactAdminClick={() => doctor.setContactAdminOpen(true)}
        />

        <main className="flex-1 p-6 md:p-8 overflow-y-auto pb-24 md:pb-8">
          <DoctorTabs doctor={doctor} user={user} />
        </main>

        <ConsultationPanel
          consultingSlot={doctor.consultingSlot}
          consultingPatient={doctor.consultingPatient}
          diagnosis={doctor.diagnosis}
          setDiagnosis={doctor.setDiagnosis}
          prescriptions={doctor.prescriptions}
          handleAddPrescriptionLine={doctor.handleAddPrescriptionLine}
          handleRemovePrescriptionLine={doctor.handleRemovePrescriptionLine}
          handlePrescriptionChange={doctor.handlePrescriptionChange}
          handleSubmitConsultation={doctor.handleSubmitConsultation}
          submittingConsultation={doctor.submittingConsultation}
          onClose={() => {
            doctor.setConsultingSlot(null);
            doctor.setConsultingPatient(null);
          }}
        />

        <ContactAdminModal
          isOpen={doctor.contactAdminOpen}
          onClose={() => doctor.setContactAdminOpen(false)}
          message={doctor.contactAdminMessage}
          setMessage={doctor.setContactAdminMessage}
          onSubmit={doctor.handleContactAdminSubmit}
          submitting={doctor.contactSubmitting}
          error={doctor.contactError}
          success={doctor.contactSuccess}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-1 h-screen relative bg-[#F8FAFC]">
      <PatientSidebar
        activeTab={patient.activeTab}
        setActiveTab={patient.setActiveTab}
      />

      <main className="flex-1 p-6 md:p-8 overflow-y-auto pb-24 md:pb-8">
        <PatientTabs patient={patient} user={user} />
      </main>

      <BookingConfirmModal
        bookingSlot={patient.bookingSlot}
        onClose={() => patient.setBookingSlot(null)}
        selectedDoc={patient.selectedDoc}
        symptoms={patient.symptoms}
        setSymptoms={patient.setSymptoms}
        handleBook={patient.handleBook}
      />

      <PrescriptionModal
        viewingPrescription={patient.viewingPrescription}
        onClose={() => patient.setViewingPrescription(null)}
        patientName={user?.fullName || user?.name}
      />
    </div>
  );
}
