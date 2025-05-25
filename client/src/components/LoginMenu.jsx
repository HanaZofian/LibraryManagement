import { useNavigate } from "react-router-dom";

export default function LoginMenu() {
  const navigate = useNavigate();

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg shadow-md text-center">
      <h2 className="text-xl font-semibold mb-6">Select Your Role</h2>

      <div className="flex flex-col gap-4">
        <button
          onClick={() => navigate("/AdminLogin")}
          className="w-full bg-red-600 text-white p-3 rounded hover:bg-red-700"
        >
          Admin 
        </button>
        <button
          onClick={() => navigate("/Member/Library")}
          className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700"
        >
          Member 
        </button>
      </div>
    </div>
  );
}
