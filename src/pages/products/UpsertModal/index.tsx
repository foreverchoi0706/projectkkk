import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import { Button, Flex, Form, FormProps, Image, Input, Modal, ModalProps } from "antd";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import queryKeys, { axiosInstance } from "@/utils/queryKeys";
import { IProduct, IResponse } from "@/utils/types";
import { AxiosError } from "axios";

interface IProps {
  productId: number | null;
  setSelectedProductId: Dispatch<SetStateAction<number | null | undefined>>;
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
  const [isEditableSelledCount, setIsEditableSelledCount] = useState<boolean>(false);
  const [cancelSellCount, setCancelSellCount] = useState<number>(0);
  const hasProductId = productId !== null;

  const { data: product } = useQuery({
    ...queryKeys.products.detail(productId!),
    enabled: hasProductId,
  });

  const increaseStockMutation = useMutation({
    mutationFn: (stock: number) =>
      axiosInstance.put(`product/IncreaseStock?productId=${productId}&stock=${stock}`),
    onSuccess: async () => {
      if (!hasProductId) return;
      await Promise.allSettled([
        queryClient.invalidateQueries(queryKeys.products.all(queryString)),
        queryClient.invalidateQueries(queryKeys.products.detail(productId)),
      ]);
      alert("재고수량이 증가되었습니다");
    },
    onError: ({ response }: AxiosError<IResponse>) => alert(JSON.stringify(response?.data.result)),
  });

  const decreaseStockStockMutation = useMutation({
    mutationFn: (stock: number) =>
      axiosInstance.put(`/product/DecreaseStock?productId=${productId}&stock=${stock}`),
    onSuccess: async () => {
      if (!hasProductId) return;
      await Promise.allSettled([
        queryClient.invalidateQueries(queryKeys.products.all(queryString)),
        queryClient.invalidateQueries(queryKeys.products.detail(productId)),
      ]);
      alert("재고수량이 감소되었습니다");
    },
    onError: ({ response }: AxiosError<IResponse>) => alert(JSON.stringify(response?.data.result)),
  });

  const addProductMutation = useMutation({
    mutationFn: (product: IProduct) => axiosInstance.post("/product/CreateProduct", product),
    onSuccess: async () => {
      await queryClient.invalidateQueries(queryKeys.products.all(queryString));
      alert("상품이 추가되었습니다");
      setSelectedProductId(undefined);
    },
    onError: ({ response }: AxiosError<IResponse>) => alert(JSON.stringify(response?.data.result)),
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
    onError: ({ response }: AxiosError<IResponse>) => alert(JSON.stringify(response?.data.result)),
  });

  const deleteProductMutation = useMutation({
    mutationFn: (productId: number) =>
      axiosInstance.delete(`/product/DeleteProduct?productId=${productId}`),
    onSuccess: async () => {
      await queryClient.invalidateQueries(queryKeys.products.all(queryString));
      alert("상품이 삭제되었습니다");
      setSelectedProductId(undefined);
    },
    onError: ({ response }: AxiosError<IResponse>) => alert(JSON.stringify(response?.data.result)),
  });

  const onFinish: FormProps<IProduct>["onFinish"] = (product) => {
    const { mutate } = hasProductId ? updateProductMutation : addProductMutation;
    mutate(product);
  };

  const onClickIncreaseStock = () => {
    if (cancelSellCount === 0 || !window.confirm(`${cancelSellCount}개 재고수량 증가하시겠습니까?`))
      return;
    increaseStockMutation.mutate(cancelSellCount);
  };

  const onClickDecreaseStock = () => {
    if (cancelSellCount === 0 || !window.confirm(`${cancelSellCount}개 재고수량 감소하시겠습니까?`))
      return;
    decreaseStockStockMutation.mutate(cancelSellCount);
  };

  useEffect(() => {
    if (product) form.setFieldsValue(product);
  }, [product]);

  return (
    <Modal {...rest} title={`상품 ${hasProductId ? "상세" : "추가"}`}>
      <Form initialValues={product} form={form} onFinish={onFinish}>
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
          <Input placeholder="상품번호" readOnly />
        </Form.Item>
        <Form.Item<IProduct> name="brand">
          <Input placeholder="브랜드" />
        </Form.Item>
        <Form.Item<IProduct> name="selledcount">
          <Input type="number" placeholder="현재 판매량" readOnly={hasProductId} />
        </Form.Item>
        <Form.Item<IProduct> name="category">
          <Input placeholder="카테고리" />
        </Form.Item>
        <Form.Item<IProduct> name="name">
          <Input placeholder="상품명" />
        </Form.Item>
        <Flex gap="middle">
          <Form.Item<IProduct> name="stock" style={{ flexGrow: "1" }}>
            <Input type="number" placeholder="수량" />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              disabled={!hasProductId}
              onClick={() => setIsEditableSelledCount((prevState) => !prevState)}
            >
              {isEditableSelledCount ? "취소" : "재고관리"}
            </Button>
          </Form.Item>
        </Flex>

        {isEditableSelledCount && (
          <Form.Item>
            <Flex gap="middle">
              <Input
                type="number"
                value={cancelSellCount}
                placeholder="판매취소할 수량"
                onChange={({ target: { value } }) => setCancelSellCount(+value)}
              />
              <Button
                disabled={cancelSellCount === 0 || increaseStockMutation.isPending}
                htmlType="button"
                type="primary"
                onClick={onClickIncreaseStock}
              >
                재고 증가
              </Button>
              <Button
                disabled={cancelSellCount === 0 || decreaseStockStockMutation.isPending}
                htmlType="button"
                type="primary"
                onClick={onClickDecreaseStock}
              >
                판매 취소
              </Button>
            </Flex>
          </Form.Item>
        )}
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
              onClick={() => deleteProductMutation.mutate(productId)}
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
