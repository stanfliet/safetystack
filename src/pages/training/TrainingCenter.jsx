import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../contexts/AuthContext";
import { Modal } from "../../components/ui/DataTable";
import toast from "react-hot-toast";

const COURSES = [
  // === CONSTRUCTION TRAININGS ===
  { id: "scaffold-erection", category: "construction", title: "Scaffold Erection & Inspection", desc: "Comprehensive training on scaffold types, erection procedures, load ratings, and daily inspection requirements per SANS 10090.", duration: "2 Days", level: "Intermediate", image: "🏗️", price: 2500 },
  { id: "excavation-safety", category: "construction", title: "Excavation & Trenching Safety", desc: "Shoring, shielding, sloping, underground services detection, and emergency rescue for excavation works.", duration: "1 Day", level: "Intermediate", image: "⛰️", price: 1800 },
  { id: "crane-lifting", category: "construction", title: "Crane & Lifting Operations", desc: "Mobile crane setup, lift planning, hand signals, slinging techniques, and load chart interpretation.", duration: "3 Days", level: "Advanced", image: "🏋️", price: 3500 },
  { id: "concrete-placement", category: "construction", title: "Concrete Works & Quality Control", desc: "Concrete mix design, placement, curing, slump testing, cube sampling, and defect prevention.", duration: "2 Days", level: "Intermediate", image: "🏗️", price: 2200 },
  { id: "welding-safety", category: "construction", title: "Welding & Hot Work Safety", desc: "Welding processes, gas cutting, fire watches, PPE requirements, and confined space welding protocols.", duration: "2 Days", level: "Advanced", image: "🔥", price: 2800 },
  { id: "electrical-installation", category: "construction", title: "Electrical Installation Safety", desc: "SANS 10142 wiring regulations, isolation procedures, lockout/tagout, and electrical hazard identification.", duration: "3 Days", level: "Advanced", image: "⚡", price: 3200 },
  { id: "roof-work", category: "construction", title: "Roof Work & Fall Protection", desc: "Safe working at heights, roof edge protection, safety nets, personal fall arrest systems, and rescue planning.", duration: "2 Days", level: "Intermediate", image: "🏠", price: 2400 },
  { id: "demolition-safety", category: "construction", title: "Demolition Safety Management", desc: "Structural assessment, sequential demolition, dust control, asbestos identification, and emergency planning.", duration: "2 Days", level: "Advanced", image: "💥", price: 2600 },
  // === HEALTH & SAFETY TRAININGS ===
  { id: "ohs-induction", category: "health-safety", title: "OHS Induction & Site Awareness", desc: "Mandatory site induction covering emergency procedures, hazard identification, PPE requirements, and legal duties.", duration: "1 Day", level: "Basic", image: "🦺", price: 1200 },
  { id: "fall-protection", category: "health-safety", title: "Fall Protection Planning & Rescue", desc: "Hierarchy of fall protection, anchor systems, lifelines, rescue plans, and equipment inspection.", duration: "2 Days", level: "Intermediate", image: "🧗", price: 2800 },
  { id: "fire-safety", category: "health-safety", title: "Fire Safety & Emergency Response", desc: "Fire prevention, extinguisher types and use, evacuation procedures, and emergency team training.", duration: "1 Day", level: "Basic", image: "🔥", price: 1500 },
  { id: "first-aid-level-1", category: "health-safety", title: "First Aid Level 1 (SANS 10048)", desc: "Basic life support, wound management, fracture immobilisation, and emergency scene management.", duration: "2 Days", level: "Basic", image: "🚑", price: 1800 },
  { id: "first-aid-level-2", category: "health-safety", title: "First Aid Level 2 (Advanced)", desc: "Advanced life support, multiple casualty management, childbirth emergencies, and medical gasses.", duration: "3 Days", level: "Advanced", image: "🏥", price: 3200 },
  { id: "hazardous-chemicals", category: "health-safety", title: "Hazardous Chemical Handling (SANS 10228)", desc: "SDS interpretation, storage requirements, spill response, PPE selection, and COMAH compliance.", duration: "2 Days", level: "Intermediate", image: "☣️", price: 2400 },
  { id: "confined-space", category: "health-safety", title: "Confined Space Entry & Rescue", desc: "Atmospheric testing, ventilation, entry permits, standby man duties, and emergency rescue procedures.", duration: "2 Days", level: "Advanced", image: "🔒", price: 3000 },
  { id: "incident-investigation", category: "health-safety", title: "Incident Investigation (ICAM & 5-Why)", desc: "Root cause analysis, evidence gathering, interview techniques, report writing, and corrective actions.", duration: "2 Days", level: "Advanced", image: "🔍", price: 2800 },
  { id: "noise-monitoring", category: "health-safety", title: "Noise Monitoring & Hearing Conservation", desc: "Noise measurement, dosimetry, hearing protection selection, audiometric testing, and noise control.", duration: "1 Day", level: "Intermediate", image: "🔊", price: 1600 },
  // === CONTRACTOR TRAININGS ===
  { id: "cidb-grading", category: "contractor", title: "CIDB Grading & Tendering", desc: "CIDB registration process, grading categories, tender preparation, joint ventures, and procurement compliance.", duration: "2 Days", level: "Intermediate", image: "📋", price: 3500 },
  { id: "bbbee-compliance", category: "contractor", title: "B-BBEE Compliance & Scoring", desc: "Construction sector codes, ownership scoring, skills development, enterprise development, and verification.", duration: "2 Days", level: "Intermediate", image: "📊", price: 2800 },
  { id: "contract-management", category: "contractor", title: "Construction Contract Management", desc: "GCC, JBCC, FIDIC, NEC contract administration, payment certificates, variations, and claims management.", duration: "3 Days", level: "Advanced", image: "📝", price: 4500 },
  { id: "quality-management", category: "contractor", title: "ISO 9001 Quality Management System", desc: "Quality planning, ITPs, NCR management, internal audits, supplier evaluation, and continuous improvement.", duration: "3 Days", level: "Advanced", image: "✅", price: 4000 },
  { id: "project-planning", category: "contractor", title: "Construction Project Planning & Scheduling", desc: "CPM/PERT scheduling, resource levelling, progress tracking, earned value management, and reporting.", duration: "3 Days", level: "Advanced", image: "📈", price: 4200 },
  { id: "environmental-compliance", category: "contractor", title: "Environmental Compliance (NEMA/EMP)", desc: "EMP implementation, waste management, water use licences, dust control, and environmental incident reporting.", duration: "2 Days", level: "Intermediate", image: "🌿", price: 3000 },
];

const CERT_TEMPLATE = `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>
  @page { size: A4 landscape; margin: 15mm; }
  body { font-family: 'Georgia', serif; background: #f8f6f0; margin: 0; padding: 0; }
  .certificate { width: 100%; height: 100%; border: 8px solid #1e40af; box-sizing: border-box; padding: 30px; text-align: center; position: relative; }
  .certificate:before { content: ''; position: absolute; top: 10px; left: 10px; right: 10px; bottom: 10px; border: 2px solid #1e40af; pointer-events: none; }
  h1 { color: #1e40af; font-size: 28pt; margin-bottom: 5px; letter-spacing: 3px; text-transform: uppercase; }
  .subtitle { color: #666; font-size: 14pt; margin-bottom: 30px; }
  .awarded { font-size: 12pt; color: #333; margin-bottom: 10px; }
  .name { font-size: 28pt; color: #1e3a8a; font-weight: bold; margin: 15px 0; border-bottom: 2px solid #1e40af; padding-bottom: 10px; display: inline-block; }
  .course-name { font-size: 18pt; color: #1e40af; margin: 15px 0; font-style: italic; }
  .details { font-size: 11pt; color: #555; margin: 20px 0; }
  .footer { margin-top: 40px; display: flex; justify-content: space-between; }
  .footer div { text-align: center; }
  .footer .line { width: 200px; border-top: 1px solid #333; margin-bottom: 5px; }
  .footer-text { font-size: 10pt; color: #666; }
  .logo { font-size: 36pt; color: #1e40af; margin-bottom: 10px; }
</style></head><body>
<div class="certificate">
  <div class="logo">SS</div>
  <h1>Certificate of Completion</h1>
  <p class="subtitle">SafetyStack Training Academy</p>
  <div class="awarded">This is to certify that</div>
  <div class="name">[NAME]</div>
  <div class="course-name">[COURSE_NAME]</div>
  <p class="details">has successfully completed the above training programme<br>
  Duration: [DURATION] | Date: [DATE] | Certificate ID: [CERT_ID]</p>
  <p class="details" style="font-size:10pt;color:#888;">
    This certificate is issued by SafetyStack Training Academy<br>
    Accredited training provider for construction and occupational health and safety
  </p>
  <div class="footer">
    <div><div class="line"></div><p class="footer-text">Training Provider</p></div>
    <div><div class="line"></div><p class="footer-text">Quality Assurer</p></div>
    <div><div class="line"></div><p class="footer-text">Date Issued</p></div>
  </div>
</div>
</body></html>`;

export default function TrainingCenter() {
  const { user, profile } = useAuth();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showBooking, setShowBooking] = useState(false);
  const [showStudy, setShowStudy] = useState(false);
  const [bookingForm, setBookingForm] = useState({ name: "", company: "", phone: "", notes: "" });
  const [submitting, setSubmitting] = useState(false);
  const [studying, setStudying] = useState(false);
  const [studyContent, setStudyContent] = useState("");
  const [showCertificate, setShowCertificate] = useState(false);
  const [certificateHtml, setCertificateHtml] = useState("");
  const [userBookings, setUserBookings] = useState([]);

  const isFreeAdmin = user?.email === "hambaniks@gmail.com";

  useEffect(() => {
    if (user) fetchBookings();
  }, [user]);

  async function fetchBookings() {
    const { data } = await supabase
      .from("training_bookings")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    if (data) setUserBookings(data);
  }

  const filtered = COURSES.filter(c => {
    const matchCategory = category === "all" || c.category === category;
    const matchSearch = !search || c.title.toLowerCase().includes(search.toLowerCase()) || c.desc.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  async function handleBookingRequest(e) {
    e.preventDefault();
    if (!selectedCourse) return;
    setSubmitting(true);
    try {
      const { error } = await supabase.from("training_bookings").insert({
        user_id: user.id,
        course_id: selectedCourse.id,
        course_title: selectedCourse.title,
        course_price: selectedCourse.price,
        name: bookingForm.name || profile?.full_name || user?.email,
        company: bookingForm.company || profile?.company_name || "",
        phone: bookingForm.phone || profile?.phone || "",
        notes: bookingForm.notes,
        status: isFreeAdmin ? "approved" : "pending"
      });
      if (error) throw error;
      toast.success(isFreeAdmin ? "Enrolled! You can start studying immediately." : "Booking submitted! We'll contact you with payment details.");
      setShowBooking(false);
      setSelectedCourse(null);
      setBookingForm({ name: "", company: "", phone: "", notes: "" });
      fetchBookings();
      if (isFreeAdmin) startStudy(selectedCourse);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function startStudy(course) {
    setStudying(true);
    setShowStudy(true);
    setStudyContent(generateLocalTrainingContent(course));
    setStudying(false);
  }

  function generateLocalTrainingContent(course) {
    return `<div class="training-content">
      <h1 style="color:#1e40af;font-size:24pt;margin-bottom:20px;">${course.title}</h1>
      <div style="background:#f0f9ff;padding:20px;border-radius:12px;margin-bottom:24px;">
        <p><strong>Duration:</strong> ${course.duration} | <strong>Level:</strong> ${course.level}</p>
        <p style="margin-top:8px;color:#555;">${course.desc}</p>
      </div>
      <h2 style="color:#1e3a8a;margin-top:24px;">Learning Objectives</h2>
      <ul style="line-height:2;">
        <li>Understand the fundamental principles and legal requirements applicable to this discipline</li>
        <li>Identify hazards and implement appropriate control measures as per SANS standards</li>
        <li>Apply safe work procedures in practical construction scenarios</li>
        <li>Demonstrate competency through theoretical and practical assessment activities</li>
        <li>Maintain accurate records and documentation as required by the OHSA and relevant regulations</li>
      </ul>
      <h2 style="color:#1e3a8a;margin-top:24px;">Course Content</h2>
      <div style="background:#f9fafb;padding:20px;border-radius:12px;">
        <p>This comprehensive training module covers all aspects of <strong>${course.title}</strong> as required by South African legislation and industry best practices.</p>
        <p style="margin-top:12px;">The course includes practical scenarios, case studies, and assessment questions to ensure competency development. Upon completion of the study material, you will be required to complete an online assessment. A minimum of 70% is required to pass and receive your accredited certificate.</p>
      </div>
      <div style="background:#fef3c7;padding:15px;border-radius:8px;margin-top:20px;">
        <p style="color:#92400e;font-weight:500;">Click "Complete & Get Certificate" below when you have finished studying.</p>
      </div>
    </div>`;
  }

  function generateCertificate(course) {
    if (!course) return;
    const certId = "SS-" + Date.now().toString(36).toUpperCase() + "-" + Math.random().toString(36).substring(2, 6).toUpperCase();
    const date = new Date().toLocaleDateString("en-ZA", { day: "numeric", month: "long", year: "numeric" });
    const html = CERT_TEMPLATE
      .replace(/\[NAME\]/g, profile?.full_name || user?.email?.split("@")[0] || "Student")
      .replace(/\[COURSE_NAME\]/g, course.title)
      .replace(/\[DURATION\]/g, course.duration)
      .replace(/\[DATE\]/g, date)
      .replace(/\[CERT_ID\]/g, certId);
    setCertificateHtml(html);
    setShowCertificate(true);
  }

  function downloadCertificate() {
    const blob = new Blob([certificateHtml], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Certificate_${selectedCourse?.title?.replace(/\s+/g, "_") || "Training"}.html`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Certificate downloaded. Open in browser and print as PDF.");
  }

  const cats = [
    { value: "all", label: "All Courses" },
    { value: "construction", label: "Construction Trades" },
    { value: "health-safety", label: "Health & Safety" },
    { value: "contractor", label: "Contractor Development" },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-safety-800 via-safety-700 to-blue-800 p-8 md:p-12">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-4xl">🎓</span>
            <h2 className="text-3xl font-bold text-white">Training Academy</h2>
            {isFreeAdmin && (
              <span className="bg-amber-400 text-amber-900 px-3 py-1 rounded-full text-sm font-bold">
                FREE ACCESS
              </span>
            )}
          </div>
          <p className="text-blue-200 max-w-2xl text-lg">
            Professional construction, health & safety, and contractor development training courses.
          </p>
        </div>
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10"
          style={{ background: "repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(255,255,255,0.1) 20px, rgba(255,255,255,0.1) 40px)" }} />
      </div>

      {/* Category Tabs + Search */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex gap-2 flex-wrap">
          {cats.map(c => (
            <button key={c.value} onClick={() => setCategory(c.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${category === c.value ? "bg-safety-600 text-white shadow-sm" : "bg-white text-gray-600 border border-gray-200 hover:border-safety-300"}`}>
              {c.label}
            </button>
          ))}
        </div>
        <input type="text" value={search} onChange={e => setSearch(e.target.value)}
          className="input max-w-xs" placeholder="Search courses..." />
      </div>

      {/* Course Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map(course => {
          const enrolled = userBookings.find(b => b.course_id === course.id && b.status === "approved");
          return (
            <div key={course.id} className="card overflow-hidden hover:shadow-lg transition-all group">
              <div className="h-36 bg-gradient-to-br from-safety-50 to-blue-50 flex items-center justify-center">
                <span className="text-6xl group-hover:scale-110 transition-transform">{course.image}</span>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs uppercase tracking-wider bg-safety-100 text-safety-700 px-2 py-0.5 rounded-full font-medium">
                    {course.category === "construction" ? "Construction" : course.category === "health-safety" ? "H&S" : "Contractor"}
                  </span>
                  <span className="text-xs text-gray-400">{course.duration}</span>
                  <span className="text-xs text-gray-400 px-1">|</span>
                  <span className="text-xs text-gray-400">{course.level}</span>
                </div>
                <h3 className="font-semibold text-gray-900">{course.title}</h3>
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">{course.desc}</p>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-lg font-bold text-safety-600">
                    {isFreeAdmin ? <span className="text-emerald-600">FREE</span> : `R ${course.price.toLocaleString()}`}
                  </span>
                  {enrolled ? (
                    <button onClick={() => { setSelectedCourse(course); startStudy(course); }}
                      className="btn-primary text-sm">Continue Study</button>
                  ) : (
                    <button onClick={() => { setSelectedCourse(course); setShowBooking(true); }}
                      className={`text-sm ${isFreeAdmin ? "bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium" : "btn-primary"}`}>
                      {isFreeAdmin ? "Enroll Free" : "Book Course"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {filtered.length === 0 && (
        <div className="text-center py-16">
          <p className="text-5xl mb-4">📚</p>
          <p className="text-gray-500 text-lg">No courses found matching your search.</p>
        </div>
      )}

      {/* My Enrollments */}
      {userBookings.filter(b => b.status === "approved").length > 0 && (
        <div className="card">
          <div className="card-header">
            <h3 className="font-semibold">My Enrollments</h3>
          </div>
          <div className="card-body p-0">
            {userBookings.filter(b => b.status === "approved").map((b, i) => {
              const course = COURSES.find(c => c.id === b.course_id);
              return (
                <div key={b.id || i} className="flex items-center justify-between px-6 py-4 border-b border-gray-100 last:border-0">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{course?.image || "📖"}</span>
                    <div>
                      <p className="font-medium">{course?.title || b.course_title}</p>
                      <p className="text-xs text-gray-400">Enrolled {new Date(b.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => { setSelectedCourse(course); startStudy(course); }} className="btn-primary text-xs">Study</button>
                    <button onClick={() => { setSelectedCourse(course); generateCertificate(course); }} className="btn-outline text-xs">Certificate</button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Booking Modal */}
      <Modal isOpen={showBooking} onClose={() => setShowBooking(false)} title={isFreeAdmin ? "Enroll in Course" : "Request Booking"}>
        {selectedCourse && (
          <form onSubmit={handleBookingRequest} className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <span className="text-4xl">{selectedCourse.image}</span>
              <div>
                <h4 className="font-semibold">{selectedCourse.title}</h4>
                <p className="text-sm text-gray-500">{selectedCourse.duration} | {selectedCourse.level}</p>
                <p className="text-sm font-bold text-safety-600 mt-1">
                  {isFreeAdmin ? "FREE (Admin Access)" : `R ${selectedCourse.price.toLocaleString()}`}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="label">Full Name</label>
                <input type="text" className="input" value={bookingForm.name} onChange={e => setBookingForm({...bookingForm, name: e.target.value})}
                  placeholder={profile?.full_name || "Your name"} />
              </div>
              <div><label className="label">Company</label>
                <input type="text" className="input" value={bookingForm.company} onChange={e => setBookingForm({...bookingForm, company: e.target.value})}
                  placeholder={profile?.company_name || "Your company"} />
              </div>
            </div>
            <div><label className="label">Phone Number</label>
              <input type="tel" className="input" value={bookingForm.phone} onChange={e => setBookingForm({...bookingForm, phone: e.target.value})}
                placeholder={profile?.phone || "Cell number"} />
            </div>
            <div><label className="label">Additional Notes</label>
              <textarea className="input" rows={2} value={bookingForm.notes} onChange={e => setBookingForm({...bookingForm, notes: e.target.value})}
                placeholder="Any special requirements or questions..." />
            </div>
            <button type="submit" disabled={submitting} className="btn-primary w-full">
              {submitting ? "Processing..." : isFreeAdmin ? "Enroll Now - Free Access" : "Submit Booking Request"}
            </button>
            {!isFreeAdmin && <p className="text-xs text-gray-400 text-center">You will be contacted with payment details to confirm your booking.</p>}
          </form>
        )}
      </Modal>

      {/* Study Modal */}
      <Modal isOpen={showStudy} onClose={() => setShowStudy(false)} title={selectedCourse?.title || "Training Module"} size="xl">
        {studying ? (
          <div className="text-center py-12">
            <div className="animate-spin w-10 h-10 border-4 border-safety-500 border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-gray-500">Loading training content...</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="max-h-[60vh] overflow-y-auto pr-2" dangerouslySetInnerHTML={{ __html: studyContent }} />
            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <button onClick={() => { setShowStudy(false); generateCertificate(selectedCourse); }}
                className="btn-primary text-sm ml-auto">Complete & Get Certificate</button>
            </div>
          </div>
        )}
      </Modal>

      {/* Certificate Modal */}
      <Modal isOpen={showCertificate} onClose={() => setShowCertificate(false)} title="Your Certificate" size="xl">
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-xl overflow-hidden border border-gray-200 max-h-[60vh] overflow-y-auto"
            dangerouslySetInnerHTML={{ __html: certificateHtml }} />
          <div className="flex gap-3 justify-end">
            <button onClick={downloadCertificate} className="btn-primary">Download Certificate (HTML)</button>
            <button onClick={() => {
              if (certificateHtml) {
                const w = window.open("", "_blank");
                if (w) {
                  w.document.write(certificateHtml);
                  w.document.close();
                  setTimeout(() => w.print(), 500);
                  toast.success("Opening print dialog to save as PDF");
                }
              }
            }} className="btn-secondary">Print as PDF</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
