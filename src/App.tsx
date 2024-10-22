import Admin from "@/pages/admin";
import User from "@/pages/user";
import { FC } from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Route,
  RouterProvider,
} from "react-router-dom";
import useAuth from "@/hooks/useAuth";
import { ADMIN_SIGN_IN_ROUTES, USER_SIGN_IN_ROUTES } from "@/utils/constants";
import { IUserInfo } from "@/utils/types";
import SignIn from "@/pages/admin/signIn";
import SignUp from "@/pages/admin/signUp";

const getUserRoute = (data?: IUserInfo) =>
  createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<User />}>
        {data
          ? USER_SIGN_IN_ROUTES.filter(({ accessAbleAuth }) => accessAbleAuth).map(
              ({ Page, path }, index) => <Route key={index} path={path} element={<Page />} />,
            )
          : USER_SIGN_IN_ROUTES.map(({ Page, path, requiredAuth }, index) => (
              <Route
                key={index}
                path={path}
                element={requiredAuth ? <Navigate to="/signin" replace /> : <Page />}
              />
            ))}
      </Route>,
    ),
  );

const getAdminRoute = (data?: IUserInfo) =>
  createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Admin />}>
        {data ? (
          <>
            {ADMIN_SIGN_IN_ROUTES.map(({ Page, path }, index) => (
              <Route key={index} element={<Page />} path={path} />
            ))}
            <Route path="*" element={<Navigate replace to="/admin/products" />} />
          </>
        ) : (
          <>
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/*" element={<Navigate replace to="/signin" />} />
          </>
        )}
      </Route>,
    ),
  );

const App: FC = () => {
  const { data, isLoading } = useAuth();
  const userRoute = getUserRoute(data);
  const adminRoute = getAdminRoute(data);

  if (isLoading) return null;
  return (
    <>
      <RouterProvider router={userRoute} />
      <RouterProvider router={adminRoute} />
    </>
  );
};

export default App;
