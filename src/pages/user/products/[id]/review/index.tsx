import { ITest } from "@/utils/types.ts";
import { Collapse, Flex, Typography, Image } from "antd";

import { forwardRef } from "react";

const Page = forwardRef<HTMLElement, Pick<ITest, "reviewDetailResponses">>(
  ({ reviewDetailResponses }, ref) => {
    return (
      <section ref={ref}>
        {reviewDetailResponses.length > 0 ? (
          <Collapse
            items={reviewDetailResponses.map(
              ({ reviewId, description, helpful, imageUrl1, imageUrl2, imageUrl3, createAt }) => ({
                key: reviewId,
                label: (
                  <Flex className="justify-between">
                    <Typography>{description}</Typography>
                    <Typography>👍{helpful}</Typography>
                  </Flex>
                ),
                children: (
                  <Flex className="flex-col gap-4">
                    <Flex className="justify-between">
                      <Typography>{description}</Typography>
                      <Typography>
                        {new Intl.DateTimeFormat("ko-KR").format(new Date(createAt))}
                      </Typography>
                    </Flex>
                    <Flex className="gap-4">
                      <Image src={imageUrl1} alt="imageUrl1" />
                      <Image src={imageUrl2} alt="imageUrl2" />
                      <Image src={imageUrl3} alt="imageUrl3" />
                    </Flex>
                  </Flex>
                ),
              }),
            )}
          />
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
