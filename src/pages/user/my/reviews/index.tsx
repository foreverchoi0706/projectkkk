import user from "@/queryKeys/user";
import axiosInstance from "@/utils/axiosInstance.ts";
import { IResponse, IReview, type TError } from "@/utils/types.ts";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Collapse, Flex, Image, Typography } from "antd";
import { type FC, MouseEvent, useState } from "react";

const Page: FC = () => {
  const queryClient = useQueryClient();
  const [reviewMap, setReviewMap] = useState<Map<number, IReview>>(new Map());
  const { data: reviews } = useQuery(user.reviews.all());

  const deleteReviewMutation = useMutation<unknown, TError, number>({
    mutationFn: (reviewId) => axiosInstance.delete(`/review/delete?reviewId=${reviewId}`),
    onSuccess: () =>
      queryClient
        .invalidateQueries({
          queryKey: user.reviews.all().queryKey,
        })
        .then(() => alert("리뷰가 삭제되었습니다.")),
    onError: ({ responseMessage }) => alert(responseMessage),
  });

  const onClickReviewLabel = async (reviewId: number) => {
    if (reviewMap.has(reviewId)) return;
    const { data } = await axiosInstance.get<IResponse<IReview>>(
      `/review/review?reviewId=${reviewId}`,
    );
    setReviewMap((prevState) => {
      return new Map(prevState.set(reviewId, data.result));
    });
  };

  const onClickDeleteReview = (
    e: MouseEvent<HTMLElement, globalThis.MouseEvent>,
    reviewId: number,
  ) => {
    e.stopPropagation();
    if (!window.confirm("해당 리뷰를 삭제하시겠습니까?")) return;
    deleteReviewMutation.mutate(reviewId);
  };

  if (!reviews) return null;

  return (
    <main className="h-full">
      <Flex className="h-full flex-col gap-4">
        <Flex className="gap-4 flex-col flex-grow">
          {reviews.content.length > 0 ? (
            <Collapse
              items={reviews.content.map(({ reviewId, createAt, productName }) => ({
                key: reviewId,
                label: (
                  <Flex className="justify-between" onClick={() => onClickReviewLabel(reviewId)}>
                    <Typography>{productName}</Typography>
                    <Button onClick={(e) => onClickDeleteReview(e, reviewId)}>삭제</Button>
                  </Flex>
                ),
                children: (
                  <Flex className="flex-col gap-4">
                    <Flex className="justify-between">
                      <Typography>{reviewMap.get(reviewId)?.description}</Typography>
                      <Typography>
                        {new Intl.DateTimeFormat("ko-KR").format(
                          new Date(reviewMap.get(reviewId)?.createAt || createAt),
                        )}
                      </Typography>
                    </Flex>
                    <Flex className="justify-between items-center">
                      <Flex className="gap-4">
                        <Image src={reviewMap.get(reviewId)?.imageUrl1 || ""} alt="imageUrl1" />
                        <Image src={reviewMap.get(reviewId)?.imageUrl2 || ""} alt="imageUrl2" />
                        <Image src={reviewMap.get(reviewId)?.imageUrl3 || ""} alt="imageUrl3" />
                      </Flex>
                      <Typography>👍{reviewMap.get(reviewId)?.helpful || 0}</Typography>
                    </Flex>
                  </Flex>
                ),
              }))}
            />
          ) : (
            <Flex className="flex-col gap-4 flex-grow justify-center items-center">
              <Typography className="text-5xl">😥</Typography>
              <Typography className="text-2xl">리뷰가 없습니다</Typography>
            </Flex>
          )}
        </Flex>
      </Flex>
    </main>
  );
};

export default Page;
