import user from "@/queryKeys/user";
import { useQuery } from "@tanstack/react-query";
import { FC, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

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

  if (isLoading) return null;

  return <main>{JSON.stringify(product)}</main>;
};

export default Page;
