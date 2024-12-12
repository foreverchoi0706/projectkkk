import user from "@/queryKeys/user.ts";
import axiosInstance from "@/utils/axiosInstance.ts";
import { IReviewParams, TError } from "@/utils/types.ts";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, Flex, Form, Modal, type ModalProps, Upload } from "antd";
import TextArea from "antd/es/input/TextArea";
import { FC } from "react";
import { Rating } from "react-simple-star-rating";

const ReviewModal: FC<ModalProps & { id?: string }> = ({ id, ...rest }) => {
  const queryClient = useQueryClient();
  const [reviewForm] = Form.useForm<IReviewParams>();

  const addReviewMutation = useMutation<unknown, TError, IReviewParams>({
    mutationFn: (reviewParams) =>
      axiosInstance.post(`/review/join?productId=${id}`, {
        ...reviewParams,
        imageUrl1: "",
        imageUrl2: "",
        imageUrl3: "",
      }),
    onSuccess: () => {
      queryClient
        .invalidateQueries({
          queryKey: user.reviews.all().queryKey,
        })
        .then(() => alert("리뷰가 작성되었습니다"));
    },
    onError: ({ responseMessage }) => alert(responseMessage),
  });

  return (
    <Modal {...rest}>
      <Form<IReviewParams>
        form={reviewForm}
        onFinish={(v) => {
          console.log(v);
          addReviewMutation.mutate(v);
        }}
      >
        <Form.Item<IReviewParams>
          name="description"
          rules={[{ required: true, message: "리뷰를 작성해주세요" }]}
        >
          <TextArea placeholder="리뷰를 작성해주세요" />
        </Form.Item>
        <Form.Item<IReviewParams> name="ratingType">
          <Rating
            initialValue={5}
            rtl={false}
            SVGclassName="inline"
            onPointerMove={(value) => {
              const ratingType = ["ONE", "TWO", "THREE", "FOUR", "FIVE"];
              console.log(ratingType[value - 1]);
              reviewForm.setFieldValue("ratingType", ratingType[value - 1]);
            }}
          />
        </Form.Item>
        <Form.Item<IReviewParams>>
          <Flex className="gap-4">
            <Upload
              name="avatar"
              listType="picture-circle"
              className="avatar-uploader"
              showUploadList={false}
            >
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRuXYtA-Ugbmj-gFWh7JEuYe68pmKvJg9yvGg&s"
                alt="avatar"
              />
            </Upload>
            <Upload
              name="avatar"
              listType="picture-circle"
              className="avatar-uploader"
              showUploadList={false}
            >
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRuXYtA-Ugbmj-gFWh7JEuYe68pmKvJg9yvGg&s"
                alt="avatar"
              />
            </Upload>
            <Upload
              name="avatar"
              listType="picture-circle"
              className="avatar-uploader"
              showUploadList={false}
            >
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRuXYtA-Ugbmj-gFWh7JEuYe68pmKvJg9yvGg&s"
                alt="avatar"
              />
            </Upload>
          </Flex>
        </Form.Item>
        <Form.Item>
          <Button className="w-full" type="primary" htmlType="submit">
            작성
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ReviewModal;
