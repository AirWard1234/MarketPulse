import Dashboard from "../components/dashboard/dashboard";
import Sidebar from "../components/sidebar/sidebar";

export default function Home() {
  return (
    <main className="grid gap-4 p-4 grid-cols-[220px_1fr]">
      <Sidebar />
      <Dashboard />
    </main>
  );
}