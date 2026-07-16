import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../contexts/AuthContext";
import toast from "react-hot-toast";

const AGENT_DATA = [
  { id: "safety-officer", name: "AI Safety Officer", title: "OHS and Compliance Expert", gradient: "from-blue-600 to-blue-800", icon: "S", suggestions: ["What are the CR 2014 requirements for fall protection?", "How do I compile a compliant safety file?", "Explain Section 24 of OHS Act", "What PPE is required for excavation?"] },
  { id: "quantity-surveyor", name: "AI Quantity Surveyor", title: "Cost and Estimation Expert", gradient: "from-emerald-600 to-emerald-800", icon: "Q", suggestions: ["Check these BOQ rates", "Help build a rate for concrete works", "Current market rate for 25MPa concrete?", "Analyse this cost estimate"] },
  { id: "tender-manager", name: "AI Tender Manager", title: "Procurement Expert", gradient: "from-purple-600 to-purple-800", icon: "T", suggestions: ["What CIDB grade do I need?", "Help draft a methodology", "B-BBEE scoring requirements", "Review tender compliance"] },
  { id: "contract-administrator", name: "AI Contract Administrator", title: "Contracts Expert", gradient: "from-amber-600 to-amber-800", icon: "C", suggestions: ["EOT claim under GCC procedure", "FIDIC variation process", "NEC compensation event", "JBCC certificate requirements"] },
  { id: "environmental-officer", name: "AI Environmental Officer", title: "Environmental Expert", gradient: "from-green-600 to-green-800", icon: "E", suggestions: ["NEMA compliance requirements", "Draft an EMP", "Water use licence application", "Waste management on site"] },
  { id: "quality-manager", name: "AI Quality Manager", title: "Quality Expert", gradient: "from-cyan-600 to-cyan-800", icon: "Q", suggestions: ["ISO 9001 requirements", "Create an ITP", "Concrete quality control", "NCR process"] },
  { id: "project-manager", name: "AI Project Manager", title: "Programme Expert", gradient: "from-rose-600 to-rose-800", icon: "P", suggestions: ["Progress reporting", "Resource scheduling", "Delay analysis", "SACPCMP requirements"] }
];

export default function AgentChat() {
  const { agentId } = useParams();
  const { user } = useAuth();
  const agent = AGENT_DATA.find(a => a.id === agentId);
  const [conversations, setConversations] = useState([]);
  const [activeConv, setActiveConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => { if (agent) fetchConversations(); }, [agentId]);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  async function fetchConversations() {
    const { data } = await supabase.from("agent_conversations").select("*").eq("user_id", user.id).eq("agent_id", agentId).order("updated_at", { ascending: false });
    setConversations(data || []);
  }

  async function newConversation() {
    const { data } = await supabase.from("agent_conversations").insert({ user_id: user.id, agent_id: agentId, title: "Chat with " + (agent?.name || "Agent"), messages: [] }).select().single();
    if (data) { setActiveConv(data.id); setMessages([]); fetchConversations(); }
  }

  async function loadConversation(id) {
    const { data } = await supabase.from("agent_conversations").select("*").eq("id", id).single();
    if (data) { setActiveConv(data.id); setMessages(data.messages || []); }
  }

  async function sendMessage(e) {
    e.preventDefault();
    if (!input.trim() || sending) return;
    if (!activeConv) { await newConversation(); setTimeout(() => sendMessage(e), 500); return; }

    const userMsg = { role: "user", content: input, timestamp: new Date().toISOString() };
    const updated = [...messages, userMsg];
    setMessages(updated); setInput(""); setSending(true);

    try {
      await supabase.from("agent_conversations").update({ messages: updated }).eq("id", activeConv);
      const response = await fetch("/api/agent-chat", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agent_id: agentId, message: input, conversation_id: activeConv, user_id: user.id })
      });
      if (!response.ok) throw new Error("AI response failed");
      const data = await response.json();
      const aiMsg = { role: "assistant", content: data.content || "I'm not sure how to respond to that.", timestamp: new Date().toISOString() };
      const final = [...updated, aiMsg];
      setMessages(final);
      await supabase.from("agent_conversations").update({ messages: final, title: final[0]?.content?.slice(0, 50) || ("Chat with " + agent?.name) }).eq("id", activeConv);
      fetchConversations();
    } catch (err) {
      toast.error(err.message);
      setMessages([...updated, { role: "assistant", content: "Sorry, I encountered an error. Please try again.", timestamp: new Date().toISOString() }]);
    } finally { setSending(false); }
  }

  if (!agent) return <div className="text-center py-12 text-gray-500">Agent not found</div>;

  return (
    <div className="flex h-[calc(100vh-12rem)] gap-6">
      <div className="w-72 flex-shrink-0 hidden md:block">
        <div className="card h-full flex flex-col">
          <div className="card-header flex items-center justify-between"><h3 className="font-semibold text-sm">Conversations</h3><button onClick={newConversation} className="p-1 rounded hover:bg-gray-100"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg></button></div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {conversations.map(c => (
              <button key={c.id} onClick={() => loadConversation(c.id)} className={"w-full text-left p-3 rounded-lg text-sm transition-colors " + (activeConv === c.id ? "bg-safety-50 text-safety-700" : "hover:bg-gray-50")}>
                <p className="font-medium truncate">{c.title || "New chat"}</p>
                <p className="text-xs text-gray-400">{new Date(c.updated_at).toLocaleDateString()}</p>
              </button>
            ))}
            {conversations.length === 0 && <p className="text-xs text-gray-400 text-center py-8">No conversations</p>}
          </div>
        </div>
      </div>
      <div className="flex-1 flex flex-col card">
        <div className={"card-header bg-gradient-to-r " + agent.gradient}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center"><span className="text-lg text-white font-bold">{agent.icon}</span></div>
            <div><h3 className="font-semibold text-white">{agent.name}</h3><p className="text-xs text-white/80">{agent.title}</p></div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400 text-sm">Ask me anything about {agent.title.toLowerCase()}</p>
              <div className="flex flex-wrap gap-2 justify-center mt-4">
                {agent.suggestions.map((s, i) => <button key={i} onClick={() => setInput(s)} className="px-3 py-2 text-sm bg-gray-50 rounded-lg border border-gray-200 hover:border-safety-300 hover:bg-safety-50">{s}</button>)}
              </div>
            </div>
          )}
          {messages.map((msg, i) => (
            <div key={i} className={"flex " + (msg.role === "user" ? "justify-end" : "justify-start")}>
              <div className={"max-w-[80%] rounded-xl px-4 py-3 " + (msg.role === "user" ? "bg-safety-600 text-white" : "bg-gray-100 text-gray-900")}>
                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                <p className={"text-xs mt-1 " + (msg.role === "user" ? "text-safety-200" : "text-gray-400")}>{new Date(msg.timestamp).toLocaleTimeString()}</p>
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
        <div className="card-body border-t border-gray-200">
          <form onSubmit={sendMessage} className="flex gap-2">
            <input type="text" value={input} onChange={e => setInput(e.target.value)} className="input flex-1" placeholder={"Ask " + agent.name + " anything..."} disabled={sending} />
            <button type="submit" disabled={!input.trim() || sending} className="btn-primary">
              {sending ? <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                : <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
