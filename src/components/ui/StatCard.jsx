import { Link } from "react-router-dom";
const colors = { blue: { bg: "bg-blue-50", icon: "text-blue-600", text: "text-blue-700" }, red: { bg: "bg-red-50", icon: "text-red-600", text: "text-red-700" }, amber: { bg: "bg-amber-50", icon: "text-amber-600", text: "text-amber-700" }, green: { bg: "bg-green-50", icon: "text-green-600", text: "text-green-700" } };
export default function StatCard({ title, value, icon, color = "blue", link }) {
  const c = colors[color] || colors.blue;
  return (
    <Link to={link || "#"} className="card p-5 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-4">
        <div className={"w-12 h-12 rounded-lg flex items-center justify-center " + c.bg + " " + c.icon}>{icon}</div>
        <div className="min-w-0"><p className="text-sm font-medium text-gray-500 truncate">{title}</p><p className={"text-2xl font-bold " + c.text}>{value}</p></div>
      </div>
    </Link>
  );
}
