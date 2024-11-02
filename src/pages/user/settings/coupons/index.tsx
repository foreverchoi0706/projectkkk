import user from "@/queryKeys/user";
import { useQuery } from "@tanstack/react-query";
import { Spin } from "antd";
import { FC } from "react";

const Page: FC = () => {
  const { data: coupons, isLoading } = useQuery(user.coupons.all(1));

  if (isLoading || !coupons?.content) return <Spin fullscreen />;
  return (
    <main>
      <ul className="flex gap-4 flex-col">
        {coupons.content.map(({ id, name }) => (
          <li key={id} className="flex-grow border border-gray-50">
            {id} {name}
          </li>
        ))}
      </ul>
    </main>
  );
};

export default Page;
