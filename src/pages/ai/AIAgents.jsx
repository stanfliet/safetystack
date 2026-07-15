import { Link } from "react-router-dom";
const AGENTS = [
  {id:"safety-officer",name:"AI Safety Officer",title:"OHS & Compliance Expert",desc:"Expert in OHS Act 85 of 1993, Construction Regulations 2014, COIDA, risk assessments, and safety file compliance.",gradient:"from-blue-600 to-blue-800",icon:"S"},
  {id:"quantity-surveyor",name:"AI Quantity Surveyor",title:"Cost & Estimation Expert",desc:"Expert in BOQ analysis, rate buildups, cost estimation, cashflow forecasting, and ASAQS standards.",gradient:"from-emerald-600 to-emerald-800",icon:"Q"},
  {id:"tender-manager",name:"AI Tender Manager",title:"Procurement & Tender Expert",desc:"Expert in SA public procurement, CIDB grading, B-BBEE scoring, and tender preparation.",gradient:"from-purple-600 to-purple-800",icon:"T"},
  {id:"contract-administrator",name:"AI Contract Administrator",title:"Contracts & Claims Expert",desc:"Expert in GCC, FIDIC, NEC3/NEC4, and JBCC contract forms, EOT claims, and dispute resolution.",gradient:"from-amber-600 to-amber-800",icon:"C"},
  {id:"environmental-officer",name:"AI Environmental Officer",title:"NEMA & Environmental Expert",desc:"Expert in NEMA compliance, EMP/EMPr, water use licences, waste management, and ISO 14001.",gradient:"from-green-600 to-green-800",icon:"E"},
  {id:"quality-manager",name:"AI Quality Manager",title:"ISO 9001 & Quality Expert",desc:"Expert in ISO 9001, ITPs, NCRs, QA plans, concrete quality control, and compaction testing.",gradient:"from-cyan-600 to-cyan-800",icon:"Q"},
  {id:"project-manager",name:"AI Project Manager",title:"Programme & Progress Expert",desc:"Expert in construction programme planning, progress reporting, resource scheduling, delay analysis, and SACPCMP.",gradient:"from-rose-600 to-rose-800",icon:"P"}
];

export default function AIAgents() {
  return (
    <div>
      <div className="mb-6"><h2 className="text-2xl font-bold">AI Expert Agents</h2><p className="text-gray-500 mt-1">Seven specialised advisors for every construction discipline</p></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {AGENTS.map(a => (
          <Link key={a.id} to={`/ai-agents/${a.id}`} className="card overflow-hidden hover:shadow-lg transition-all group">
            <div className={"h-24 bg-gradient-to-r "+a.gradient+" p-5 flex items-center"}>
              <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center"><span className="text-2xl text-white font-bold">{a.icon}</span></div>
            </div>
            <div className="p-5">
              <h3 className="font-semibold text-gray-900 group-hover:text-safety-600">{a.name}</h3>
              <p className="text-sm text-safety-600 font-medium mt-0.5">{a.title}</p>
              <p className="text-sm text-gray-500 mt-2">{a.desc}</p>
              <div className="mt-4 flex items-center text-sm text-safety-600 font-medium">Start chat <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg></div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
