import admin from "@/queryKeys/admin";
import user from "@/queryKeys/user.ts";
import axiosInstance from "@/utils/axiosInstance";
import {
  REQUIRED_BRAND_NAME,
  REQUIRED_CATEGORY_NAME,
  REQUIRED_COLOR_NAME,
  REQUIRED_DISCOUNT_RATE_NAME,
  REQUIRED_PRICE_NAME,
  REQUIRED_PRODUCT_NAME,
  REQUIRED_SIZE_NAME,
  REQUIRED_SOLD_QUANTITY_NAME,
  REQUIRED_STOCK_NAME,
} from "@/utils/constants";
import type { IProduct, IResponse, TError } from "@/utils/types";
import { UploadOutlined } from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Button,
  Flex,
  Form,
  type FormProps,
  Input,
  Modal,
  type ModalProps,
  Select,
  Spin,
  Upload,
} from "antd";
import type { AxiosResponse } from "axios";
import { type Dispatch, type FC, type SetStateAction, useEffect, useState } from "react";

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
  const hasProductId = productId !== null;
  const queryClient = useQueryClient();
  const [form] = Form.useForm<IProduct>();
  const [mainImageUrl, setMainImageUrl] = useState<string>();
  const [isEditableSoldCount, setIsEditableSoldCount] = useState<boolean>(false);
  const [cancelSellCount, setCancelSellCount] = useState<number>(0);

  const increaseStockMutation = useMutation<unknown, TError, number>({
    mutationFn: (stock) =>
      axiosInstance.put(`admin/product/increase_stock?productId=${productId}&stock=${stock}`),
    onSuccess: async () => {
      if (!hasProductId) return;
      await queryClient.invalidateQueries({
        queryKey: admin.products._def,
      });
      alert("재고수량이 증가되었습니다");
    },
    onError: ({ responseMessage }) => alert(responseMessage),
  });

  const decreaseStockStockMutation = useMutation<unknown, TError, number>({
    mutationFn: (stock) =>
      axiosInstance.put(`/admin/product/decrease_stock?productId=${productId}&stock=${stock}`),
    onSuccess: async () => {
      if (!hasProductId) return;
      await Promise.allSettled([
        queryClient.invalidateQueries(admin.products.pages(queryString)),
        queryClient.invalidateQueries(admin.products.detail(productId)),
      ]);
      alert("재고수량이 감소되었습니다");
    },
    onError: ({ responseMessage }) => alert(responseMessage),
  });

  const uploadImageMutation = useMutation<
    AxiosResponse<IResponse<{ mainImageUrl: string; descriptionImageUrls: string[] }>>,
    TError,
    FormData
  >({
    mutationFn: (formData) => axiosInstance.post("/admin/product/create_image", formData),
    onError: ({ responseMessage }) => alert(responseMessage),
  });

  const addProductMutation = useMutation<unknown, TError, IProduct>({
    mutationFn: (product) => axiosInstance.post("/admin/product/create", product),
    onSuccess: async () => {
      await queryClient.invalidateQueries(admin.products.pages(queryString));
      alert("상품이 추가되었습니다");
      setSelectedProductId(undefined);
    },
    onError: ({ responseMessage }) => alert(responseMessage),
  });

  const updateProductMutation = useMutation<unknown, TError, IProduct>({
    mutationFn: (product) =>
      axiosInstance.put("/admin/product/update", {
        ...product,
        id: productId,
      }),
    onSuccess: async () => {
      if (!hasProductId) return;
      await Promise.allSettled([
        queryClient.invalidateQueries(admin.products.pages(queryString)),
        queryClient.invalidateQueries(admin.products.detail(productId)),
      ]);
      alert("상품이 수정되었습니다");
      setSelectedProductId(undefined);
    },
    onError: ({ responseMessage }) => alert(responseMessage),
  });

  const deleteProductMutation = useMutation<unknown, TError, number>({
    mutationFn: (productId) => axiosInstance.delete(`/admin/product/delete?productId=${productId}`),
    onSuccess: async () => {
      await queryClient.invalidateQueries(admin.products.pages(queryString));
      alert("상품이 삭제되었습니다");
      setSelectedProductId(undefined);
    },
    onError: ({ responseMessage }) => alert(responseMessage),
  });

  const onFinish: FormProps<IProduct>["onFinish"] = (product) => {
    if (mainImageUrl === undefined) return alert("상품 이미지를 등록해주세요");
    const { mutate } = hasProductId ? updateProductMutation : addProductMutation;
    mutate({
      ...product,
      mainImageUrl,
      descriptionImageUrls: ["image"],
    });
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

  const { data: brands } = useQuery(admin.brands.pages("size=999"));
  const { data: categories } = useQuery(user.categories.all());
  const { data: product } = useQuery({
    ...admin.products.detail(productId as number),
    enabled: hasProductId,
  });

  useEffect(() => {
    if (product) setMainImageUrl(product.mainImageUrl);
  }, [product]);

  if (hasProductId && product === undefined) return <Spin fullscreen />;

  return (
    <Modal
      {...rest}
      title={`상품 ${hasProductId ? "상세" : "추가"}`}
      styles={{ body: { maxHeight: "600px", overflowY: "auto" } }}
    >
      <Form<IProduct>
        layout="vertical"
        initialValues={hasProductId ? product : { soldQuantity: 0 }}
        form={form}
        onFinish={onFinish}
      >
        <Form.Item label="상품이미지" name="mainImageUrl">
          <Upload
            name="mainImageUrl"
            listType="picture-card"
            onRemove={() => {
              setMainImageUrl(undefined);
              form.setFieldValue("mainImageUrl", null);
            }}
            customRequest={({ file, onSuccess }) => {
              const formData = new FormData();
              formData.append("mainImageFile", file);
              uploadImageMutation.mutate(formData, {
                onSuccess: ({ data: { result } }) => {
                  if (onSuccess) onSuccess(result.mainImageUrl);
                  form.setFieldValue("mainImageUrl", result.mainImageUrl);
                  setMainImageUrl(result.mainImageUrl);
                },
              });
            }}
            disabled={uploadImageMutation.isPending}
            defaultFileList={
              product?.mainImageUrl
                ? [{ uid: "-1", name: "mainImageUrl", url: product.mainImageUrl }]
                : []
            }
            maxCount={1}
            accept="image/*"
          >
            <UploadOutlined />
          </Upload>
        </Form.Item>
        <Form.Item<IProduct>
          name="name"
          label="상품명"
          rules={[
            {
              required: true,
              message: REQUIRED_PRODUCT_NAME,
            },
          ]}
        >
          <Input placeholder="상품명" />
        </Form.Item>
        <Form.Item<IProduct>
          name="brand"
          label="브랜드"
          rules={[
            {
              required: true,
              message: REQUIRED_BRAND_NAME,
            },
          ]}
        >
          <Select placeholder="브랜드">
            {brands?.content.map(({ name }) => (
              <Select.Option key={name} value={name}>
                {name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item<IProduct>
          name="category"
          label="카테고리"
          rules={[
            {
              required: true,
              message: REQUIRED_CATEGORY_NAME,
            },
          ]}
        >
          <Select placeholder="카테고리">
            {categories?.content.map(({ id, name, code }) => (
              <Select.Option key={id} value={code}>
                {name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item<IProduct>
          name="price"
          label="가격"
          rules={[
            {
              required: true,
              message: REQUIRED_PRICE_NAME,
            },
          ]}
        >
          <Input placeholder="가격" />
        </Form.Item>
        <Form.Item<IProduct>
          name="size"
          label="사이즈"
          rules={[
            {
              required: true,
              message: REQUIRED_COLOR_NAME,
            },
          ]}
        >
          <Select placeholder="사이즈">
            <Select.Option value="SMALL">SMALL</Select.Option>
            <Select.Option value="MEDIUM">MEDIUM</Select.Option>
            <Select.Option value="LARGE">LARGE</Select.Option>
            <Select.Option value="FREE">FREE</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item<IProduct>
          name="color"
          label="색상"
          rules={[
            {
              required: true,
              message: REQUIRED_SIZE_NAME,
            },
          ]}
        >
          <Select placeholder="색상">
            <Select.Option value="RED">RED</Select.Option>
            <Select.Option value="BLUE">BLUE</Select.Option>
            <Select.Option value="GREEN">GREEN</Select.Option>
            <Select.Option value="YELLOW">YELLOW</Select.Option>
            <Select.Option value="ORANGE">ORANGE</Select.Option>
            <Select.Option value="PURPLE">PURPLE</Select.Option>
            <Select.Option value="PINK">PINK</Select.Option>
            <Select.Option value="BROWN">BROWN</Select.Option>
            <Select.Option value="BLACK">BLACK</Select.Option>
            <Select.Option value="WHITE">WHITE</Select.Option>
            <Select.Option value="GRAY">GRAY</Select.Option>
            <Select.Option value="CYAN">CYAN</Select.Option>
            <Select.Option value="MAGENTA">MAGENTA</Select.Option>
            <Select.Option value="LIME">LIME</Select.Option>
            <Select.Option value="NAVY">NAVY</Select.Option>
            <Select.Option value="TEAL">TEAL</Select.Option>
            <Select.Option value="MAROON">MAROON</Select.Option>
            <Select.Option value="OLIVE">OLIVE</Select.Option>
            <Select.Option value="VIOLET">VIOLET</Select.Option>
            <Select.Option value="GOLD">GOLD</Select.Option>
            <Select.Option value="SILVER">SILVER</Select.Option>
            <Select.Option value="INDIGO">INDIGO</Select.Option>
            <Select.Option value="TURQUOISE">TURQUOISE</Select.Option>
            <Select.Option value="BEIGE">BEIGE</Select.Option>
            <Select.Option value="IVORY">IVORY</Select.Option>
            <Select.Option value="CORAL">CORAL</Select.Option>
            <Select.Option value="LAVENDER">LAVENDER</Select.Option>
            <Select.Option value="CHARCOAL">CHARCOAL</Select.Option>
            <Select.Option value="SALMON">SALMON</Select.Option>
            <Select.Option value="PEACH">PEACH</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item<IProduct>
          name="discountRate"
          label="할인율"
          rules={[
            {
              required: true,
              message: REQUIRED_DISCOUNT_RATE_NAME,
            },
          ]}
        >
          <Input placeholder="할인율" type="number" />
        </Form.Item>
        <Form.Item<IProduct>
          name="soldQuantity"
          label="현재 판매량"
          rules={[
            {
              required: hasProductId,
              message: REQUIRED_SOLD_QUANTITY_NAME,
            },
          ]}
        >
          <Input
            type="number"
            min="0"
            placeholder="현재 판매량"
            readOnly
            disabled={!hasProductId}
          />
        </Form.Item>
        <Flex gap="middle" align="end">
          <Form.Item<IProduct>
            name="stock"
            label="현재 재고"
            style={{ flexGrow: "1" }}
            rules={[
              {
                required: true,
                message: REQUIRED_STOCK_NAME,
              },
            ]}
          >
            <Input type="number" min="0" placeholder="현재 재고" />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              disabled={!hasProductId}
              onClick={() => setIsEditableSoldCount((prevState) => !prevState)}
            >
              {isEditableSoldCount ? "취소" : "재고관리"}
            </Button>
          </Form.Item>
        </Flex>

        {isEditableSoldCount && (
          <Form.Item>
            <Flex gap="middle">
              <Input
                type="number"
                value={cancelSellCount}
                placeholder="판매취소할 수량"
                onChange={({ target: { value } }) => setCancelSellCount(+value)}
              />
              <Button
                disabled={cancelSellCount <= 0 || increaseStockMutation.isPending}
                htmlType="button"
                type="primary"
                onClick={onClickIncreaseStock}
              >
                재고 증가
              </Button>
              <Button
                disabled={cancelSellCount <= 0 || decreaseStockStockMutation.isPending}
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
