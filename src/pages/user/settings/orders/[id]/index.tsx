import user from "@/queryKeys/user.ts";
import { useQueries } from "@tanstack/react-query";
import { FC, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const Page: FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const queries = useQueries({
    queries: [user.order.detail(id), user.shipping.detail(id)],
  });

  useEffect(() => {
    if (queries.some(({ isError }) => isError)) {
      alert("해당 상품을 찾을 수 없습니다");
      navigate(-1);
    }
  }, [queries]);

  if (queries.every(({ isLoading }) => isLoading)) return null;

  const [{ data: order }, { data: detail }] = queries;

  return (
    <main>
      {JSON.stringify(order)}
      <br />
      {JSON.stringify(detail)}
    </main>
  );
};

export default Page;
