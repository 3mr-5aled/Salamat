import { useEffect } from "react";
import { createRoute, useNavigate } from "@tanstack/react-router";
import { rootRoute } from "./__root";
import { useAuth } from "../contexts/AuthContext";
import { useAnalytics } from "../hooks/useAnalytics";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import {
  Activity,
  Building2,
  Users,
  HeartPulse,
  Clock,
  FileText,
  ArrowRight,
  Trophy,
  Award,
  ShieldCheck,
  Star,
  PhoneCall,
  MapPin,
  Mail,
  CalendarRange,
} from "lucide-react";
import { motion } from "framer-motion";

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: LandingPageComponent,
});

function LandingPageComponent() {
  const { user, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const { data: analyticsData, isLoading: loadingAnalytics } = useAnalytics();



  // Redirect authenticated users to their app workspace automatically
  useEffect(() => {
    if (!loading && isAuthenticated) {
      if (user?.role === "admin") {
        navigate({ to: "/app/admin" });
      } else {
        navigate({ to: "/app" });
      }
    }
  }, [isAuthenticated, user, loading, navigate]);

  if (loading) {
    return null; // Let the root layout spinner handle the load
  }

  const clinicsCount = analyticsData?.clinicsCount ?? 0;
  const doctorsCount = analyticsData?.doctorsCount ?? 0;

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
      {/* Parallax Hero Section */}
      <section
        id="home"
        className="relative h-[85vh] min-h-[500px] flex items-center justify-center bg-cover bg-center bg-[#0F172A] overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(15, 23, 42, 0.75), rgba(37, 99, 235, 0.4)), url("https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1920&q=80")`,
          backgroundAttachment: "fixed",
        }}
      >
        {/* Subtle animated floating particle */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <motion.div
            className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-[#14B8A6]/10 blur-3xl"
            animate={{
              x: [0, 40, 0],
              y: [0, -40, 0],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-[#2563EB]/15 blur-3xl"
            animate={{
              x: [0, -30, 0],
              y: [0, 30, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>

        <div className="relative z-10 w-full max-w-4xl mx-auto px-6 text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#2563EB]/10 border border-[#2563EB]/25 backdrop-blur-md"
          >
            <Activity className="text-[#14B8A6] animate-pulse" size={16} />
            <span className="text-xs font-bold uppercase tracking-wider text-blue-100">
              Introducing Salamat v2.0
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
            className="text-4xl md:text-6xl font-black !text-white tracking-tight leading-[1.1]"
          >
            Salamatk is our <span className="text-[#14B8A6]">Responsibility</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25, ease: "easeOut" }}
            className="text-base md:text-lg text-slate-200 font-medium leading-relaxed max-w-2xl mx-auto"
          >
            Salamat connects you with top-tier healthcare clinics and verified medical specialists.
            Book consultation slots, track your prescriptions, and experience modern medical management.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <Button
              size="lg"
              onClick={() => navigate({ to: "/app/signup" })}
              className="w-full sm:w-auto h-12 px-8 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold rounded-xl shadow-[0_10px_25px_rgba(37,99,235,0.3)] hover:shadow-[0_12px_30px_rgba(37,99,235,0.45)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Book Appointment Now</span>
              <ArrowRight size={18} />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate({ to: "/app/login" })}
              className="w-full sm:w-auto h-12 px-8 border-white/30 bg-white/5 hover:bg-white/15 text-white font-bold rounded-xl backdrop-blur-md transition-all duration-200 cursor-pointer"
            >
              Doctor/Admin Portal
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Stats Section with elegant cards */}
      <section id="stats" className="py-16 md:py-24 bg-white border-b border-slate-100 relative z-10">
        <div className="w-full max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-3xl font-black text-[#0F172A] tracking-tight">
              Hospital Statistics at a Glance
            </h2>
            <p className="text-sm text-[#64748B] font-medium leading-relaxed">
              We take pride in our scaling infrastructure, providing patients across the region with verified, prompt, and dedicated medical services.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Clinics Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <Card className="border border-slate-100 hover:border-slate-200/80 bg-[#F8FAFC]/40 hover:bg-[#F8FAFC] shadow-[0_10px_30px_rgba(0,0,0,0.01)] hover:shadow-[0_15px_35px_rgba(0,0,0,0.03)] rounded-3xl transition-all duration-300 group">
                <CardContent className="p-8 flex items-center gap-6">
                  <div className="p-4 bg-[#2563EB]/5 text-[#2563EB] group-hover:bg-[#2563EB] group-hover:text-white rounded-2xl transition-all duration-300 shadow-inner">
                    <Building2 size={36} className="stroke-[1.5]" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold uppercase tracking-widest text-[#64748B]">
                      Active Departments
                    </span>
                    <h3 className="text-4xl md:text-5xl font-black text-[#0F172A] tracking-tight leading-none flex items-baseline">
                      {loadingAnalytics ? (
                        <div className="w-12 h-8 bg-slate-200 rounded animate-pulse" />
                      ) : (
                        clinicsCount
                      )}
                      <span className="text-lg font-bold text-[#14B8A6] ml-1">+</span>
                    </h3>
                    <p className="text-xs text-[#64748B] font-medium pt-1">
                      Fully-equipped specialized departments delivering top-tier therapy.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Doctors Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
            >
              <Card className="border border-slate-100 hover:border-slate-200/80 bg-[#F8FAFC]/40 hover:bg-[#F8FAFC] shadow-[0_10px_30px_rgba(0,0,0,0.01)] hover:shadow-[0_15px_35px_rgba(0,0,0,0.03)] rounded-3xl transition-all duration-300 group">
                <CardContent className="p-8 flex items-center gap-6">
                  <div className="p-4 bg-[#14B8A6]/5 text-[#14B8A6] group-hover:bg-[#14B8A6] group-hover:text-white rounded-2xl transition-all duration-300 shadow-inner">
                    <Users size={36} className="stroke-[1.5]" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold uppercase tracking-widest text-[#64748B]">
                      Consultant Specialists
                    </span>
                    <h3 className="text-4xl md:text-5xl font-black text-[#0F172A] tracking-tight leading-none flex items-baseline">
                      {loadingAnalytics ? (
                        <div className="w-12 h-8 bg-slate-200 rounded animate-pulse" />
                      ) : (
                        doctorsCount
                      )}
                      <span className="text-lg font-bold text-[#2563EB] ml-1">+</span>
                    </h3>
                    <p className="text-xs text-[#64748B] font-medium pt-1">
                      Board-certified specialists coordinating patient treatments.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Advantages section */}
      <section id="features" className="py-20 md:py-28 bg-[#F8FAFC]">
        <div className="w-full max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-3xl font-black text-[#0F172A] tracking-tight">
              A Complete Medical Ecosystem
            </h2>
            <p className="text-sm text-[#64748B] font-medium leading-relaxed">
              Salamat takes care of the scheduling overhead so you and your doctor can focus on what matters most: your health.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-white border border-slate-100 rounded-3xl p-8 space-y-4 shadow-[0_10px_35px_rgba(0,0,0,0.015)] hover:shadow-[0_15px_45px_rgba(0,0,0,0.035)] transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#2563EB]/10 text-[#2563EB] flex items-center justify-center shadow-inner">
                <Clock size={24} className="stroke-[2]" />
              </div>
              <h3 className="text-lg font-bold text-[#0F172A]">Real-Time Scheduling</h3>
              <p className="text-xs text-[#64748B] font-medium leading-relaxed">
                Browse available clinics, select preferred consultation hours, and reserve your medical appointment slot instantly without any waiting queue.
              </p>
            </motion.div>

            {/* Feature 2 */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white border border-slate-100 rounded-3xl p-8 space-y-4 shadow-[0_10px_35px_rgba(0,0,0,0.015)] hover:shadow-[0_15px_45px_rgba(0,0,0,0.035)] transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#14B8A6]/10 text-[#14B8A6] flex items-center justify-center shadow-inner">
                <HeartPulse size={24} className="stroke-[2]" />
              </div>
              <h3 className="text-lg font-bold text-[#0F172A]">Personal Patient Profiles</h3>
              <p className="text-xs text-[#64748B] font-medium leading-relaxed">
                Maintain a centralized, secure medical record including blood groups, chronic conditions, emergency contacts, and complete diagnostic history.
              </p>
            </motion.div>

            {/* Feature 3 */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white border border-slate-100 rounded-3xl p-8 space-y-4 shadow-[0_10px_35px_rgba(0,0,0,0.015)] hover:shadow-[0_15px_45px_rgba(0,0,0,0.035)] transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#E0F2FE] text-[#0284C7] flex items-center justify-center shadow-inner">
                <FileText size={24} className="stroke-[2]" />
              </div>
              <h3 className="text-lg font-bold text-[#0F172A]">Digital Medical Notes</h3>
              <p className="text-xs text-[#64748B] font-medium leading-relaxed">
                Access your consultation summary and doctor-approved prescriptions dynamically on any device. Safe, paperless, and instantly readable.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section id="achievements" className="py-20 md:py-28 bg-white border-t border-slate-100 relative z-10">
        <div className="w-full max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2563EB]/5 text-[#2563EB] text-xs font-bold uppercase tracking-wider">
              <Trophy size={14} />
              <span>Salamat Laurels</span>
            </div>
            <h2 className="text-3xl font-black text-[#0F172A] tracking-tight">
              Hospital Achievements & Milestones
            </h2>
            <p className="text-sm text-[#64748B] font-medium leading-relaxed">
              Our continuous pursuit of clinical excellence, modern infrastructure, and community service has earned us recognition and trust.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Card 1 */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-[#F8FAFC]/50 hover:bg-white border border-slate-100 hover:border-[#2563EB]/20 rounded-3xl p-6 text-center space-y-3 transition-all duration-300 hover:shadow-[0_15px_40px_rgba(37,99,235,0.04)] group"
            >
              <div className="w-14 h-14 mx-auto rounded-2xl bg-[#2563EB]/10 text-[#2563EB] flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-300">
                <Trophy size={28} className="stroke-[1.5]" />
              </div>
              <div className="text-3xl font-black text-[#0F172A] tracking-tight">15k+</div>
              <h4 className="text-sm font-bold text-slate-800">Happy Patients Saved</h4>
              <p className="text-xs text-[#64748B] font-medium leading-relaxed">
                Providing standard healthcare and medical assistance across regions.
              </p>
            </motion.div>

            {/* Card 2 */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-[#F8FAFC]/50 hover:bg-white border border-slate-100 hover:border-[#14B8A6]/20 rounded-3xl p-6 text-center space-y-3 transition-all duration-300 hover:shadow-[0_15px_40px_rgba(20,184,166,0.04)] group"
            >
              <div className="w-14 h-14 mx-auto rounded-2xl bg-[#14B8A6]/10 text-[#14B8A6] flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-300">
                <Award size={28} className="stroke-[1.5]" />
              </div>
              <div className="text-3xl font-black text-[#0F172A] tracking-tight">99.2%</div>
              <h4 className="text-sm font-bold text-slate-800">Booking Success Rate</h4>
              <p className="text-xs text-[#64748B] font-medium leading-relaxed">
                Smooth reservation workflows with dynamic real-time slot checking.
              </p>
            </motion.div>

            {/* Card 3 */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-[#F8FAFC]/50 hover:bg-white border border-slate-100 hover:border-[#2563EB]/20 rounded-3xl p-6 text-center space-y-3 transition-all duration-300 hover:shadow-[0_15px_40px_rgba(37,99,235,0.04)] group"
            >
              <div className="w-14 h-14 mx-auto rounded-2xl bg-[#2563EB]/10 text-[#2563EB] flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-300">
                <Users size={28} className="stroke-[1.5]" />
              </div>
              <div className="text-3xl font-black text-[#0F172A] tracking-tight">25+</div>
              <h4 className="text-sm font-bold text-slate-800">Elite Specialists</h4>
              <p className="text-xs text-[#64748B] font-medium leading-relaxed">
                Board-certified specialists coordinating complex patient diagnostics.
              </p>
            </motion.div>

            {/* Card 4 */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-[#F8FAFC]/50 hover:bg-white border border-slate-100 hover:border-[#14B8A6]/20 rounded-3xl p-6 text-center space-y-3 transition-all duration-300 hover:shadow-[0_15px_40px_rgba(20,184,166,0.04)] group"
            >
              <div className="w-14 h-14 mx-auto rounded-2xl bg-[#14B8A6]/10 text-[#14B8A6] flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-300">
                <ShieldCheck size={28} className="stroke-[1.5]" />
              </div>
              <div className="text-3xl font-black text-[#0F172A] tracking-tight">10+</div>
              <h4 className="text-sm font-bold text-slate-800">Care Departments</h4>
              <p className="text-xs text-[#64748B] font-medium leading-relaxed">
                State-of-the-art facilities offering specialized clinical care.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 md:py-28 bg-[#F8FAFC] border-t border-slate-100 relative z-10">
        <div className="w-full max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#14B8A6]/10 text-[#14B8A6] text-xs font-bold uppercase tracking-wider">
              <Star size={14} fill="currentColor" />
              <span>Reviews</span>
            </div>
            <h2 className="text-3xl font-black text-[#0F172A] tracking-tight">
              What Our Patients Say
            </h2>
            <p className="text-sm text-[#64748B] font-medium leading-relaxed">
              We are committed to providing premium services. Read experiences from members of the Salamat healthcare system.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-white border border-slate-100 rounded-3xl p-8 space-y-5 shadow-[0_10px_35px_rgba(0,0,0,0.01)] hover:shadow-[0_15px_45px_rgba(37,99,235,0.03)] hover:scale-[1.01] transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-1 text-[#F59E0B]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} fill="currentColor" />
                  ))}
                </div>
                <p className="text-xs text-slate-700 font-medium italic leading-relaxed">
                  "Booking slots through Salamat is extremely convenient. I searched for cardiology, picked a morning slot, and got verified instantly. Highly recommended."
                </p>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-slate-50">
                <div className="w-10 h-10 rounded-full bg-[#2563EB]/10 flex items-center justify-center font-bold text-[#2563EB] text-sm">
                  AH
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#0F172A]">Ahmed Hosny</h4>
                  <span className="text-[10px] text-[#64748B] font-semibold bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-md mt-0.5 inline-block">
                    Cardiology Patient
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Testimonial 2 */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white border border-slate-100 rounded-3xl p-8 space-y-5 shadow-[0_10px_35px_rgba(0,0,0,0.01)] hover:shadow-[0_15px_45px_rgba(20,184,166,0.03)] hover:scale-[1.01] transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-1 text-[#F59E0B]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} fill="currentColor" />
                  ))}
                </div>
                <p className="text-xs text-slate-700 font-medium italic leading-relaxed">
                  "As a doctor, Salamat simplifies managing my schedule. I can set custom slot durations, view patient notes in advance, and upload diagnostics directly."
                </p>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-slate-50">
                <div className="w-10 h-10 rounded-full bg-[#14B8A6]/10 flex items-center justify-center font-bold text-[#14B8A6] text-sm">
                  HM
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#0F172A]">Dr. Hoda Mansour</h4>
                  <span className="text-[10px] text-[#64748B] font-semibold bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-md mt-0.5 inline-block">
                    Consultant Pediatrics
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Testimonial 3 */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white border border-slate-100 rounded-3xl p-8 space-y-5 shadow-[0_10px_35px_rgba(0,0,0,0.01)] hover:shadow-[0_15px_45px_rgba(37,99,235,0.03)] hover:scale-[1.01] transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-1 text-[#F59E0B]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} fill="currentColor" />
                  ))}
                </div>
                <p className="text-xs text-slate-700 font-medium italic leading-relaxed">
                  "Having access to my prescription files and digital consulting reports from anywhere is amazing. Salamat eliminates paper records entirely."
                </p>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-slate-50">
                <div className="w-10 h-10 rounded-full bg-[#2563EB]/10 flex items-center justify-center font-bold text-[#2563EB] text-sm">
                  MK
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#0F172A]">Mona Khalil</h4>
                  <span className="text-[10px] text-[#64748B] font-semibold bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-md mt-0.5 inline-block">
                    General Patient
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Emergency Hotline Section */}
      <section id="emergency" className="py-16 bg-[#DC2626] text-white relative overflow-hidden z-10 border-t border-red-700">
        {/* Decorative background shape */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_120%,rgba(255,255,255,0.1),transparent_50%)] pointer-events-none" />
        <div className="w-full max-w-5xl mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-4 text-center md:text-left max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-bold uppercase tracking-wider">
                <HeartPulse size={14} className="animate-pulse" />
                <span>24/7 Critical Emergency</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-black tracking-tight !text-white leading-tight">
                Need Urgent Medical Care?
              </h2>
              <p className="text-sm text-red-100 font-medium leading-relaxed">
                Our emergency response coordinators and fully-equipped ambulances are on standby. Reach out to our hotline for instantaneous emergency assistance.
              </p>
            </div>
            <div className="shrink-0 flex flex-col items-center gap-2">
              <a
                href="tel:19999"
                className="inline-flex items-center gap-3 px-8 py-4 bg-white text-[#DC2626] hover:bg-red-50 font-black text-xl rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.15)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.25)] hover:scale-[1.03] active:scale-[0.97] transition-all duration-200"
              >
                <PhoneCall size={24} className="animate-bounce" />
                <span>Call Hotline: 19999</span>
              </a>
              <span className="text-[10px] text-red-200 font-bold uppercase tracking-widest pt-1">
                Toll Free Emergency Line
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 md:py-28 bg-white relative z-10 border-t border-slate-100">
        <div className="w-full max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2563EB]/5 text-[#2563EB] text-xs font-bold uppercase tracking-wider">
              <Mail size={14} />
              <span>Get In Touch</span>
            </div>
            <h2 className="text-3xl font-black text-[#0F172A] tracking-tight">
              Contact Hospital Support
            </h2>
            <p className="text-sm text-[#64748B] font-medium leading-relaxed">
              Reach our support team instantly via WhatsApp, Facebook, or our direct hotline. We're available to help.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start max-w-5xl mx-auto">
            {/* Contact coordinates */}
            <div className="lg:col-span-5 space-y-8">
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-[#0F172A]">Hospital Coordinates</h3>
                
                {/* Coordinates list */}
                <div className="space-y-5">
                  <div className="flex gap-4">
                    <div className="p-3 bg-[#2563EB]/5 text-[#2563EB] rounded-2xl shrink-0 h-fit">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#0f172a] uppercase tracking-wider">Location</h4>
                      <p className="text-xs text-[#64748B] font-medium mt-1 leading-relaxed">
                        123 El-Nasr St, Maadi,<br />Cairo Governorate, Egypt
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="p-3 bg-[#14B8A6]/5 text-[#14B8A6] rounded-2xl shrink-0 h-fit">
                      <PhoneCall size={20} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#0f172a] uppercase tracking-wider">Phone Support</h4>
                      <p className="text-xs text-[#64748B] font-medium mt-1">
                        +20 (2) 2345 6789 (Support)<br />
                        +20 100 234 5678 (Mobile)
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="p-3 bg-[#2563EB]/5 text-[#2563EB] rounded-2xl shrink-0 h-fit">
                      <Mail size={20} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#0f172a] uppercase tracking-wider">Email Address</h4>
                      <p className="text-xs text-[#64748B] font-medium mt-1">
                        support@salamat.com<br />
                        info@salamat-hospital.org
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="p-3 bg-[#14B8A6]/5 text-[#14B8A6] rounded-2xl shrink-0 h-fit">
                      <CalendarRange size={20} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#0f172a] uppercase tracking-wider">Working Hours</h4>
                      <p className="text-xs text-[#64748B] font-medium mt-1 leading-relaxed">
                        Outpatient Clinics: 8:00 AM - 10:00 PM<br />
                        Emergency Ward & Inpatients: 24/7 Daily
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map placeholder */}
              <div className="border border-slate-100 rounded-3xl p-5 bg-[#F8FAFC] space-y-4">
                <h4 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">Directions</h4>
                <p className="text-xs text-[#64748B] font-medium leading-relaxed">
                  Located near the Maadi Grand Mall. Click below for directions.
                </p>
                <a
                  href="https://maps.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2563EB] hover:underline"
                >
                  <span>Open in Google Maps</span>
                  <ArrowRight size={12} />
                </a>
              </div>
            </div>

            {/* Quick Contact Channels */}
            <div className="lg:col-span-7 space-y-4">
              <div className="mb-6">
                <h3 className="text-lg font-bold text-[#0F172A]">Reach Us Directly</h3>
                <p className="text-xs text-[#64748B] font-medium mt-1">Choose your preferred channel — our team responds promptly.</p>
              </div>

              {/* WhatsApp */}
              <motion.a
                href="https://wa.me/201234567890"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.01 }}
                className="flex items-center gap-5 p-6 bg-[#F8FAFC]/50 border border-slate-100 hover:border-[#25D366]/30 hover:bg-[#25D366]/5 rounded-3xl shadow-sm hover:shadow-[0_10px_30px_rgba(37,211,102,0.08)] transition-all duration-300 group cursor-pointer"
              >
                <div className="w-14 h-14 rounded-2xl bg-[#25D366]/10 text-[#25D366] flex items-center justify-center shrink-0 group-hover:bg-[#25D366] group-hover:text-white transition-all duration-300 shadow-inner">
                  <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-[#0F172A]">WhatsApp</h4>
                  <p className="text-xs text-[#64748B] font-medium mt-0.5">+20 123 456 7890</p>
                  <span className="text-[10px] text-[#25D366] font-bold uppercase tracking-wider">Message us →</span>
                </div>
                <ArrowRight size={16} className="text-slate-300 group-hover:text-[#25D366] transition-colors duration-200 shrink-0" />
              </motion.a>

              {/* Facebook */}
              <motion.a
                href="https://facebook.com/salamathospital"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.01 }}
                className="flex items-center gap-5 p-6 bg-[#F8FAFC]/50 border border-slate-100 hover:border-[#1877F2]/30 hover:bg-[#1877F2]/5 rounded-3xl shadow-sm hover:shadow-[0_10px_30px_rgba(24,119,242,0.08)] transition-all duration-300 group cursor-pointer"
              >
                <div className="w-14 h-14 rounded-2xl bg-[#1877F2]/10 text-[#1877F2] flex items-center justify-center shrink-0 group-hover:bg-[#1877F2] group-hover:text-white transition-all duration-300 shadow-inner">
                  <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-[#0F172A]">Facebook Page</h4>
                  <p className="text-xs text-[#64748B] font-medium mt-0.5">facebook.com/salamathospital</p>
                  <span className="text-[10px] text-[#1877F2] font-bold uppercase tracking-wider">Visit our page →</span>
                </div>
                <ArrowRight size={16} className="text-slate-300 group-hover:text-[#1877F2] transition-colors duration-200 shrink-0" />
              </motion.a>

              {/* Hotline */}
              <motion.a
                href="tel:19999"
                whileHover={{ scale: 1.01 }}
                className="flex items-center gap-5 p-6 bg-[#F8FAFC]/50 border border-slate-100 hover:border-[#14B8A6]/30 hover:bg-[#14B8A6]/5 rounded-3xl shadow-sm hover:shadow-[0_10px_30px_rgba(20,184,166,0.08)] transition-all duration-300 group cursor-pointer"
              >
                <div className="w-14 h-14 rounded-2xl bg-[#14B8A6]/10 text-[#14B8A6] flex items-center justify-center shrink-0 group-hover:bg-[#14B8A6] group-hover:text-white transition-all duration-300 shadow-inner">
                  <PhoneCall size={26} className="stroke-[1.8]" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-[#0F172A]">Direct Hotline</h4>
                  <p className="text-xs text-[#64748B] font-medium mt-0.5">19999 — Toll Free</p>
                  <span className="text-[10px] text-[#14B8A6] font-bold uppercase tracking-wider">Call now →</span>
                </div>
                <ArrowRight size={16} className="text-slate-300 group-hover:text-[#14B8A6] transition-colors duration-200 shrink-0" />
              </motion.a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 bg-slate-900 border-t border-slate-800 text-slate-400 text-center text-xs relative z-10">
        <div className="max-w-4xl mx-auto px-6 space-y-4">
          <p className="font-bold text-slate-200">Salamat Medical Appointment & Consultation Portal</p>

          <div className="inline-flex items-center justify-center gap-3 px-4.5 py-2.5 bg-slate-800/80 border border-slate-700/60 rounded-2xl shadow-sm mt-4">
            <img src="/dev-logo.png" alt="Developer Logo" className="w-8 h-8 rounded-xl object-cover shadow-sm border border-slate-700/50" />
            <div className="text-left">
              <div className="text-slate-200 font-bold text-xs">Developed by Amr Morcy</div>
              <a
                href="https://github.com/3mr-5aled/Salamat"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[#60A5FA] hover:text-blue-300 transition-colors font-mono text-[11px]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                  <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
                  <path d="M9 18c-4.51 2-5-2-7-2"></path>
                </svg>
                <span>github.com/3mr-5aled/Salamat</span>
              </a>
            </div>
          </div>

          <p className="font-medium text-slate-500 text-[11px]">
            &copy; {new Date().getFullYear()} Salamat. All rights reserved. Your health is our responsibility.
          </p>
        </div>
      </footer>
    </div>
  );
}
