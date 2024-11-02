import Product from "@/components/Product";
import user from "@/queryKeys/user";
import { useQuery } from "@tanstack/react-query";
import { Typography } from "antd";
import { FC } from "react";

const Page: FC = () => {
  const { data: wish } = useQuery({
    ...user.products.wish(),
    initialData: () => ({ content: [], page: 0, totalCount: 0 }),
  });

  return (
    <main>
      <Typography className="text-sm">찜한 아이템 0</Typography>
      {wish.content.map((product) => (
        <Product {...product} />
      ))}
    </main>
  );
};

export default Page;
