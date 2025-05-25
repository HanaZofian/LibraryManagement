import { Outlet, useNavigate } from "react-router-dom";

const Management = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full p-6">
      <header className="bg-green-900 text-white px-6 py-4 shadow-md flex justify-between items-center rounded mb-6">
        <h1 className="text-xl font-semibold">Book Management</h1>
      </header>

      <Outlet />
    </div>
  );
};

export default Management;
