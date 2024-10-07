import useAuth from "@/hooks/useAuth.ts";
import Setting from "@/pages/admin/setting";
import SignIn from "@/pages/user/signIn";
import Dinner from "@/pages/user/dinner";
import { Flex, Layout, Space, Typography } from "antd";
import { FC } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

const User: FC = () => {
  const { auth } = useAuth();
  return (
    <Layout
      style={{
        background: "#212121",
        maxWidth: "600px",
        margin: "0 auto",
        height: "100vh",
        padding: "16px",
      }}
    >
      <Flex
        style={{
          flexDirection: "column",
          flexGrow: "1",
          overflowY: "auto",
        }}
      >
        <Routes>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/dinner" element={<Dinner />} />
          <Route path="/setting" element={auth ? <Setting /> : <Navigate to="/signin" replace />} />
          <Route path="/*" element={<Navigate to="/" replace />} />
        </Routes>
      </Flex>
      {/* <Flex justify="space-around">
        <Link to="/">
          <Button>1</Button>
        </Link>
        <Link to="/">
          <Button>1</Button>
        </Link>
        <Link to="/setting">
          <Button>setting</Button>
        </Link>
      </Flex> */}
    </Layout>
  );
};

export default User;
