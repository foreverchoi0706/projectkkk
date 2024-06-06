import { FC, useEffect } from "react";
import { Button, Form, FormProps, Input, Modal, ModalProps } from "antd";
import { useMutation, useQuery } from "@tanstack/react-query";
import queryKeys, { axiosInstance } from "@/utils/queryKeys.ts";
import { IProduct } from "@/utils/types.ts";

interface IProps {
  productId: string | null;
}

const UpsertModal: FC<IProps & ModalProps> = ({ productId, ...rest }) => {
  const [form] = Form.useForm<IProduct>();
  const hasProductId = productId !== null;

  const { data: product } = useQuery({
    ...queryKeys.products.detail(productId as string),
    enabled: hasProductId,
    select: ({ result }) => result,
  });

  const addProductMutation = useMutation({
    mutationFn: (product: IProduct) =>
      axiosInstance.post("/product/CreateProduct", product),
  });

  const updateProductMutation = useMutation({
    mutationFn: (product: IProduct) =>
      axiosInstance.put("/product/UpdateProduct", product),
  });

  const deleteProductMutation = useMutation({
    mutationFn: (productId: string) =>
      axiosInstance.delete(`/product/DeleteProduct?productName=${productId}`),
  });

  const handleFinish: FormProps<IProduct>["onFinish"] = (product) => {
    console.log(product);
    const { mutate } = hasProductId
      ? updateProductMutation
      : addProductMutation;
    mutate(product);
  };

  useEffect(() => {
    if (product) form.setFieldsValue(product);
  }, [product]);

  return (
    <Modal {...rest} title={`상품 ${hasProductId ? "상세" : "추가"}`}>
      <Form initialValues={product} form={form} onFinish={handleFinish}>
        <Form.Item<IProduct> name="image">
          <Input placeholder="이미지" />
        </Form.Item>
        <Form.Item<IProduct> name="id">
          <Input placeholder="상품번호" />
        </Form.Item>
        <Form.Item<IProduct> name="brand">
          <Input placeholder="브랜드" />
        </Form.Item>
        <Form.Item<IProduct> name="selledcount">
          <Input type="number" placeholder="판매량" />
        </Form.Item>
        <Form.Item<IProduct> name="category">
          <Input placeholder="카테고리" />
        </Form.Item>
        <Form.Item<IProduct> name="name">
          <Input placeholder="상품명" />
        </Form.Item>
        <Form.Item<IProduct> name="stock">
          <Input type="number" placeholder="수량" />
        </Form.Item>
        <Form.Item>
          <Button htmlType="submit" type="primary">
            {hasProductId ? "수정" : "추가"}
          </Button>
          {hasProductId && (
            <Button
              onClick={() => deleteProductMutation.mutate(productId as string)}
              htmlType="button"
              type="link"
            >
              상품 삭제
            </Button>
          )}
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpsertModal;
