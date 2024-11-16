import { ITest } from "@/utils/types.ts";
import { Flex, Typography } from "antd";

import { forwardRef } from "react";

const Page = forwardRef<HTMLElement, Pick<ITest, "reviewDetailResponses">>(
  ({ reviewDetailResponses }, ref) => {
    return (
      <section ref={ref}>
        {reviewDetailResponses.length > 0 ? (
          reviewDetailResponses.map(() => <Flex>dsadd</Flex>)
        ) : (
          <Flex className="flex-col gap-4 flex-grow justify-center items-center my-4">
            <Typography className="text-5xl">😥</Typography>
            <Typography className="text-2xl">아직 작성된 리뷰가 없습니다</Typography>
          </Flex>
        )}
      </section>
    );
  },
);

export default Page;
