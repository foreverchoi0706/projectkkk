import { FC } from "react";
import { Form, Input, Modal, ModalProps } from "antd";

const UpsertModal: FC<ModalProps> = (props) => {
  return (
    <Modal {...props}>
      <Form>
        <Form.Item>
          <Input placeholder="상품번호" />
        </Form.Item>
        <Form.Item>
          <Input placeholder="브랜드" />
        </Form.Item>
        <Form.Item>
          <Input placeholder="판매량" />
        </Form.Item>
        <Form.Item>
          <Input placeholder="카테고리" />
        </Form.Item>
        <Form.Item>
          <Input placeholder="상품명" />
        </Form.Item>
        <Form.Item>
          <Input placeholder="수량" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpsertModal;
