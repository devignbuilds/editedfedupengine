import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role === "client") {
      navigate("/client-dashboard");
    } else if (user?.role === "employee") {
      navigate("/team-dashboard");
    } else if (user?.role === "admin") {
      navigate("/admin-dashboard");
    }
  }, [user, navigate]);

  return (
    <div className="p-10 text-white">
      <h1 className="text-3xl font-bold mb-5">Redirecting...</h1>
    </div>
  );
}
