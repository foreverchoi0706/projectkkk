import useAuth from "@/hooks/useAuth";
import Admin from "@/pages/admin";
import SignIn from "@/pages/admin/signIn";
import SignUp from "@/pages/admin/signUp";
import User from "@/pages/user";
import { ADMIN_SIGN_IN_ROUTES, USER_SIGN_IN_ROUTES } from "@/utils/constants";
import { IAuth } from "@/utils/types";
import { FC } from "react";
import {
  Navigate,
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";

const getRoute = (data?: IAuth) =>
  createBrowserRouter(
    createRoutesFromElements(
      <>
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
          <Route path="*" element={<Navigate replace to="/" />} />
        </Route>
        <Route path="/admin/*" element={<Admin />}>
          {data ? (
            <>
              {ADMIN_SIGN_IN_ROUTES.map(({ Page, path }, index) => (
                <Route key={index} element={<Page />} path={path} />
              ))}
              <Route path="/admin/*" element={<Navigate replace to="/products" />} />
            </>
          ) : (
            <>
              <Route path="signin" element={<SignIn />} />
              <Route path="signup" element={<SignUp />} />
              <Route path="*" element={<Navigate replace to="signin" />} />
            </>
          )}
        </Route>
      </>,
    ),
  );

const App: FC = () => {
  const { data, isLoading } = useAuth();
  const userRoute = getRoute(data);

  if (isLoading) return null;
  return <RouterProvider router={userRoute} />;
};

export default App;
