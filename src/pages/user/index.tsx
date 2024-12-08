import user from "@/queryKeys/user.ts";
import axiosInstance from "@/utils/axiosInstance.ts";
import { ACCESS_TOKEN } from "@/utils/constants.ts";
import { getCookie } from "@/utils/cookie.ts";
import { IAuth, type TError } from "@/utils/types.ts";
import {
  BellOutlined,
  BellTwoTone,
  DeleteOutlined,
  HeartFilled,
  HeartOutlined,
  HomeFilled,
  HomeOutlined,
  ProductFilled,
  ProductOutlined,
  SearchOutlined,
  SettingFilled,
  SettingOutlined,
  ShoppingCartOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import { CompatClient, Stomp } from "@stomp/stompjs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Flex, Layout, Tour, TourProps, Typography } from "antd";
import { FC, useEffect, useRef, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Link, Outlet, ScrollRestoration, useLocation, useNavigate } from "react-router-dom";
import SockJS from "sockjs-client";

interface IProps {
  data?: IAuth;
}

const User: FC<IProps> = ({ data }) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const refNotificationBell = useRef<HTMLSpanElement>(null);
  const [client, setClient] = useState<CompatClient | null>(null);
  const [isOpenNotificationTour, setOpenNotificationTour] = useState<boolean>(false);

  const { data: notifications } = useQuery({
    ...user.notification.all(),
    enabled: Boolean(data),
  });

  const readNotificationMutation = useMutation<unknown, TError, number>({
    mutationFn: (id) => axiosInstance.post(`/notification/read?notificationId=${id}`),
    onSuccess: () => queryClient.invalidateQueries(user.notification.all()),
    onError: ({ responseMessage }) => alert(responseMessage),
  });

  const deleteNotificationMutation = useMutation<unknown, TError, number>({
    mutationFn: (id) => axiosInstance.delete(`/admin/notification/delete?notificationId=${id}`),
    onSuccess: () => queryClient.invalidateQueries(user.notification.all()),
    onError: ({ responseMessage }) => alert(responseMessage),
  });

  const onClickReadNotification = (id: number) => {
    readNotificationMutation.mutateAsync(id).then(() => {
      navigate("/my/coupons");
      setOpenNotificationTour(false);
    });
  };

  const onClickDeleteNotification = (id: number) => {
    if (!window.confirm("알림을 삭제하시겠습니까?")) return;
    deleteNotificationMutation.mutate(id);
  };

  useEffect(() => {
    const accessToken = getCookie(ACCESS_TOKEN);
    if (!accessToken || !data) return;
    const sockJs = new SockJS(
      import.meta.env.MODE === "development" ? "/ws" : "https://www.projectkkk.com/ws/",
    );
    const stompClient = Stomp.over(sockJs);

    stompClient.connect(
      { Authorization: `Bearer ${accessToken}` },
      () => {
        stompClient.subscribe("/user/queue/notifications", (_message) =>
          queryClient.invalidateQueries(user.notification.all()),
        );
      },
      console.error,
    );
    setClient(stompClient);

    // 컴포넌트 언마운트 시 연결 해제
    return () => client?.disconnect();
  }, []);

  const steps: TourProps["steps"] = [
    {
      title: "",
      cover: notifications?.content.length ? (
        <ul className="flex flex-col gap-4 overflow-y-auto  h-80">
          {notifications?.content.map(({ id, description, isRead }) => (
            <li
              key={id}
              className={`flex items-center text-xs cursor-pointer bg-white px-4 py-2 rounded `}
            >
              <p
                onClick={() => onClickReadNotification(id)}
                className={`${isRead ? "text-gray-300 line-through" : "text-black"}`}
              >
                {description}
              </p>
              <Button
                onClick={() => onClickDeleteNotification(id)}
                type="text"
                icon={<DeleteOutlined />}
              />
            </li>
          ))}
        </ul>
      ) : (
        <div>알림이 없습니다</div>
      ),
      target: refNotificationBell.current || null,
      closeIcon: false,
      nextButtonProps: {
        children: "닫기",
      },
      style: {
        maxWidth: "300px",
      },
    },
  ];

  return (
    <Layout className="bg-white relative my-0 mx-auto max-w-[600px] pb-[78px]">
      <Flex className="justify-between p-4">
        <Link to="/">
          <Typography className="text-2xl font-bold flex-shrink-0">KKK</Typography>
        </Link>
        <Flex className="gap-4">
          {notifications && (
            <>
              {notifications.content.length > 0 ? (
                <BellTwoTone
                  onClick={() => setOpenNotificationTour(true)}
                  className="text-2xl"
                  ref={refNotificationBell}
                />
              ) : (
                <BellOutlined
                  ref={refNotificationBell}
                  className="text-2xl"
                  onClick={() => setOpenNotificationTour(true)}
                  // onClick={() => client?.send("/app/log", {}, "Test log messagdasdasdase")}
                />
              )}
              <Tour
                open={isOpenNotificationTour}
                onClose={() => setOpenNotificationTour(false)}
                mask={false}
                type="primary"
                steps={steps}
                animated={true}
              />
            </>
          )}

          <Link to="/search" className="flex items-center">
            <SearchOutlined className="text-2xl" />
          </Link>
          <Link to="/carts" className="flex items-center">
            <ShoppingCartOutlined className="text-2xl" />
          </Link>
        </Flex>
      </Flex>
      <Flex className="p-2 flex-col flex-grow overflow-y-auto">
        <ErrorBoundary
          fallback={
            <Flex className="h-[calc(100vh-142px)] justify-center items-center flex-col gap-4">
              <Typography className="text-5xl">😥</Typography>
              <Typography className="text-2xl">오류가 발생하였습니다</Typography>
              <Button type="primary" onClick={window.location.reload}>
                새로고침하기
              </Button>
            </Flex>
          }
        >
          <Outlet />
        </ErrorBoundary>
      </Flex>
      {!pathname.includes("/products") && (
        <Flex className="border rounded-t-2xl justify-around p-4 fixed bottom-0 max-w-[584px] w-full z-10 bg-white">
          <Link to="/" className="flex-1 flex flex-col items-center">
            {pathname === "/" ? (
              <HomeFilled className="text-lg" />
            ) : (
              <HomeOutlined className="text-lg" />
            )}
            <Typography className="font-bold mt-2 text-xs">홈</Typography>
          </Link>
          <Link to="/search" className="flex-1 flex flex-col items-center">
            {pathname === "/search" ? (
              <ProductFilled className="text-lg" />
            ) : (
              <ProductOutlined className="text-lg" />
            )}
            <Typography className="font-bold mt-2 text-xs">상품</Typography>
          </Link>
          <Link to="/categories" className="flex-1 flex flex-col items-center">
            <UnorderedListOutlined className="text-xl" />
            <Typography className="font-bold mt-2 text-xs">카테고리</Typography>
          </Link>
          <Link to="/picks" className="flex-1 flex flex-col items-center">
            {pathname === "/picks" ? (
              <HeartFilled className="text-lg" />
            ) : (
              <HeartOutlined className="text-lg" />
            )}
            <Typography className="font-bold mt-2 text-xs">찜</Typography>
          </Link>
          <Link to="/my" className="flex-1 flex flex-col items-center">
            {pathname === "/setting" ? (
              <SettingFilled className="text-lg" />
            ) : (
              <SettingOutlined className="text-lg" />
            )}
            <Typography className="font-bold mt-2 text-xs">마이페이지</Typography>
          </Link>
        </Flex>
      )}
      <ScrollRestoration />
    </Layout>
  );
};

export default User;
