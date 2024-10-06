import Admin from "@/pages/admin";
import User from "@/pages/user";
import { FC } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

const App: FC = () => {
  return (
    <Routes>
      <Route path="/" element={<User />} />
      <Route path="/admin/*" element={<Admin />} />
      <Route path="*" element={<Navigate replace to="/" />} />
    </Routes>
  );
};

export default App;
