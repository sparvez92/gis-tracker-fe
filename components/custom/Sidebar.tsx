import { Separator } from "../ui/separator";

function Sidebar() {
  return (
    <nav className="flex flex-col gap-4">
      <div className="text-xl font-semibold">MyApp</div>
      <Separator />
      <a href="/dashboard" className="hover:text-primary">🏠 Dashboard</a>
      <a href="/dashboard/users" className="hover:text-primary">👤 Users</a>
      <a href="/dashboard/settings" className="hover:text-primary">⚙️ Settings</a>
    </nav>
  );
}

export default Sidebar