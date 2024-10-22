import { useQuery } from "@tanstack/react-query";
import user from "@/queryKeys/user.ts";

import { FC, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Spin } from "antd";

const Page: FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: product, isLoading, isError } = useQuery(user.products.detail(id));

  useEffect(() => {
    if (isError) {
      alert("해당 상품을 찾을 수 없습니다");
      navigate(-1);
    }
  }, [isError]);

  if (isLoading) return <Spin fullscreen />;

  return <main>{JSON.stringify(product)}</main>;
};

export default Page;
