import user from "@/queryKeys/user.ts";
import axiosInstance from "@/utils/axiosInstance.ts";
import { IReviewParams, TError } from "@/utils/types.ts";
import { UploadOutlined } from "@ant-design/icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, Flex, Form, FormProps, Modal, type ModalProps, Upload, UploadFile } from "antd";
import TextArea from "antd/es/input/TextArea";
import { FC, useState } from "react";
import { Rating } from "react-simple-star-rating";

const ReviewModal: FC<ModalProps & { id: number }> = ({ id, ...rest }) => {
  const queryClient = useQueryClient();
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([]);
  const [reviewForm] = Form.useForm<IReviewParams>();

  const addReviewMutation = useMutation<unknown, TError, IReviewParams>({
    mutationFn: (reviewParams) =>
      axiosInstance.post(`/review/join?productId=${id}`, {
        ...reviewParams,
        imageUrl1: uploadFiles[0]?.name || "",
        imageUrl2: uploadFiles[1]?.name || "",
        imageUrl3: uploadFiles[2]?.name || "",
      }),
    onSuccess: () => {
      queryClient
        .invalidateQueries({
          queryKey: user.reviews.all().queryKey,
        })
        .then(() => alert("리뷰가 작성되었습니다"));
    },
    onError: (e) => {
      console.log(e);
    },
  });

  const onFinishAddReview: FormProps<IReviewParams>["onFinish"] = (reviewParams) => {
    addReviewMutation.mutate(reviewParams);
  };

  return (
    <Modal {...rest}>
      <Form<IReviewParams> form={reviewForm} onFinish={onFinishAddReview}>
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
              maxCount={3}
              openFileDialogOnClick={uploadFiles.length !== 3}
              showUploadList
              onChange={(e) => setUploadFiles(e.fileList)}
            >
              <UploadOutlined />
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
