import user from "@/queryKeys/user";
import { useQuery } from "@tanstack/react-query";
import { Spin } from "antd";
import { FC } from "react";

const Page: FC = () => {
  const { data: coupons, isLoading } = useQuery(user.coupons.all(1));

  if (isLoading) return <Spin fullscreen />;
  return <main>{JSON.stringify(coupons)}</main>;
};

export default Page;
