import { Dispatch, FC, SetStateAction, useEffect } from "react";
import { Button, Form, FormProps, Input, Modal, ModalProps, Image } from "antd";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import queryKeys, { axiosInstance } from "@/utils/queryKeys.ts";
import { IProduct } from "@/utils/types.ts";
import { AxiosError } from "axios";

interface IProps {
  productId: string | null;
  setSelectedProductId: Dispatch<SetStateAction<string | null | undefined>>;
  queryString: string;
}

const UpsertModal: FC<IProps & ModalProps> = ({
  productId,
  setSelectedProductId,
  queryString,
  ...rest
}) => {
  const queryClient = useQueryClient();
  const [form] = Form.useForm<IProduct>();
  const hasProductId = productId !== null;

  const { data: product } = useQuery({
    ...queryKeys.products.detail(productId as string),
    enabled: hasProductId,
  });

  const addProductMutation = useMutation({
    mutationFn: (product: IProduct) => axiosInstance.post("/product/CreateProduct", product),
    onSuccess: async () => {
      await queryClient.invalidateQueries(queryKeys.products.all(queryString));
      alert("상품이 추가되었습니다");
      setSelectedProductId(undefined);
    },
    onError: (e: AxiosError) => alert(JSON.stringify(e.response?.data)),
  });

  const updateProductMutation = useMutation({
    mutationFn: (product: IProduct) => axiosInstance.put("/product/UpdateProduct", product),
    onSuccess: async () => {
      if (!hasProductId) return;
      await Promise.allSettled([
        queryClient.invalidateQueries(queryKeys.products.all(queryString)),
        queryClient.invalidateQueries(queryKeys.products.detail(productId)),
      ]);
      alert("상품이 수정되었습니다");
      setSelectedProductId(undefined);
    },
    onError: (e: AxiosError) => alert(JSON.stringify(e.response?.data)),
  });

  const deleteProductMutation = useMutation({
    mutationFn: (productId: string) =>
      axiosInstance.delete(`/product/DeleteProduct?productName=${productId}`),
    onSuccess: async () => {
      await queryClient.invalidateQueries(queryKeys.products.all(queryString));
      alert("상품이 삭제되었습니다");
      setSelectedProductId(undefined);
    },
    onError: (e: AxiosError) => alert(JSON.stringify(e.response?.data)),
  });

  const handleFinish: FormProps<IProduct>["onFinish"] = (product) => {
    console.log(product);
    const { mutate } = hasProductId ? updateProductMutation : addProductMutation;
    mutate(product);
  };

  useEffect(() => {
    if (product) form.setFieldsValue(product);
  }, [product]);

  console.log(product?.image);

  return (
    <Modal {...rest} title={`상품 ${hasProductId ? "상세" : "추가"}`}>
      <Form initialValues={product} form={form} onFinish={handleFinish}>
        {hasProductId && (
          <Form.Item>
            <Image
              alt={product?.image}
              src={
                product?.image ||
                "https://ssl.pstatic.net/melona/libs/1483/1483197/701ff7f5c96e711ca721_20240603141547415_1.jpg"
              }
            />
          </Form.Item>
        )}
        <Form.Item<IProduct>>
          <Input type="file" />
        </Form.Item>
        <Form.Item<IProduct> name="image">
          <Input placeholder="파일명" />
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
          <Button
            disabled={addProductMutation.isPending || updateProductMutation.isPending}
            htmlType="submit"
            type="primary"
          >
            {hasProductId ? "수정" : "추가"}
          </Button>
          {hasProductId && (
            <Button
              disabled={deleteProductMutation.isPending}
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
