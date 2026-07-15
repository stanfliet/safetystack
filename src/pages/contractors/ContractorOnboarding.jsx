import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../contexts/AuthContext";
import toast from "react-hot-toast";

const STEPS = ["Company Information", "Insurance & Certifications", "Safety Documentation", "Personnel & Competency", "Review & Submit"];

export default function ContractorOnboarding() {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ company_name:"", registration_number:"", cidb_grade:"", bbeee_level:"", designated_safety_officer:"" });
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if(!form.company_name) { toast.error("Company name required"); return; }
    setSaving(true);
    const { error } = await supabase.from("contractor_onboardings").insert({...form, user_id:user.id, status:"submitted", step:5});
    if(error) { toast.error(error.message); } else { toast.success("Onboarding submitted for review!"); }
    setSaving(false);
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8"><h2 className="text-2xl font-bold">Contractor Onboarding</h2><p className="text-gray-500 mt-1">Complete the 5-step wizard to onboard as a contractor</p></div>

      {/* Steps indicator */}
      <div className="flex items-center justify-between mb-8">
        {STEPS.map((s, i) => (
          <div key={i} className="flex items-center">
            <div className={"w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold "+(step>i+1?"bg-green-500 text-white":step===i+1?"bg-safety-600 text-white":"bg-gray-200 text-gray-500")}>{step>i+1?"✓":i+1}</div>
            {i < STEPS.length-1 && <div className={"h-1 w-12 md:w-20 "+(step>i+1?"bg-green-500":"bg-gray-200")} />}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="card">
        <div className="card-header"><h3 className="text-lg font-semibold">{STEPS[step-1]}</h3></div>
        <div className="card-body space-y-4">
          {step === 1 && (
            <><div><label className="label">Company Name *</label><input type="text" className="input" value={form.company_name} onChange={e=>setForm({...form,company_name:e.target.value})} /></div>
            <div className="grid grid-cols-2 gap-4"><div><label className="label">Registration Number</label><input type="text" className="input" value={form.registration_number} onChange={e=>setForm({...form,registration_number:e.target.value})} /></div><div><label className="label">CIDB Grade</label><input type="text" className="input" value={form.cidb_grade} onChange={e=>setForm({...form,cidb_grade:e.target.value})} placeholder="e.g. 9CE" /></div></div>
            <div className="grid grid-cols-2 gap-4"><div><label className="label">B-BBEE Level</label><select className="input" value={form.bbeee_level} onChange={e=>setForm({...form,bbeee_level:e.target.value})}><option value="">Select...</option><option value="1">Level 1</option><option value="2">Level 2</option><option value="3">Level 3</option><option value="4">Level 4</option><option value="non_compliant">Non-Compliant</option></select></div><div><label className="label">Safety Officer</label><input type="text" className="input" value={form.designated_safety_officer} onChange={e=>setForm({...form,designated_safety_officer:e.target.value})} /></div></div></>
          )}
          {step === 2 && (
            <div className="text-center py-8 text-gray-500">
              <p className="mb-2">Upload insurance and certification documents</p>
              <p className="text-sm">COIDA Letter of Good Standing, Public Liability Insurance, Tax Clearance</p>
              <div className="mt-4 p-8 border-2 border-dashed border-gray-300 rounded-lg"><p className="text-sm">File upload area (coming soon)</p></div>
            </div>
          )}
          {step === 3 && (
            <div className="text-center py-8 text-gray-500">
              <p>Safety documentation upload area</p>
              <p className="text-sm mt-1">Upload your company safety file, H&S policy, and risk assessments</p>
            </div>
          )}
          {step === 4 && (
            <div className="text-center py-8 text-gray-500">
              <p>Personnel and competency records</p>
              <p className="text-sm mt-1">List your qualified staff and their certifications</p>
            </div>
          )}
          {step === 5 && (
            <div className="text-center py-8">
              <svg className="w-16 h-16 text-green-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              <h3 className="text-lg font-semibold mb-2">Ready to Submit</h3>
              <p className="text-gray-500 mb-6">Review your information before submitting</p>
              <div className="bg-gray-50 rounded-lg p-4 text-left space-y-2 max-w-md mx-auto">
                <p><span className="font-medium">Company:</span> {form.company_name}</p>
                <p><span className="font-medium">Reg No:</span> {form.registration_number||"-"}</p>
                <p><span className="font-medium">CIDB:</span> {form.cidb_grade||"-"}</p>
                <p><span className="font-medium">B-BBEE:</span> {form.bbeee_level||"-"}</p>
                <p><span className="font-medium">Safety Officer:</span> {form.designated_safety_officer||"-"}</p>
              </div>
            </div>
          )}

          <div className="flex justify-between pt-4">
            {step > 1 ? <button type="button" onClick={()=>setStep(step-1)} className="btn-secondary">Previous</button> : <div />}
            {step < 5 ? (
              <button type="button" onClick={()=>setStep(step+1)} className="btn-primary">Next</button>
            ) : (
              <button type="submit" disabled={saving} className="btn-success">{saving?"Submitting...":"Submit Onboarding"}</button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
