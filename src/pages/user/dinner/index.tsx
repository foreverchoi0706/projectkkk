import { Button, Flex, Modal, Spin, Typography } from "antd";
import { FC, useState } from "react";

const Page: FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isPaymentStatus, setIsPaymentStatus] = useState<null | "TRYING" | "DONE">(null);

  const onClickPaymet = () => {
    setIsPaymentStatus("TRYING");
    setTimeout(() => setIsPaymentStatus("DONE"), 2000);
  };

  return (
    <main style={{ color: "white" }}>
      <Flex align="center" justify="space-between">
        <Typography style={{ color: "white", fontSize: "1rem", fontWeight: 500 }}>
          2024.10.08 Autumn
        </Typography>
        <Typography style={{ color: "white", fontSize: "1rem", fontWeight: 500 }}>
          Chef forever choi`s Dinner
        </Typography>
      </Flex>
      {isPaymentStatus === "DONE" ? (
        <Flex style={{ height: "80vh" }} justify="center" align="center">
          <Typography
            style={{ textAlign: "center", color: "white", fontSize: "1rem", fontWeight: 500 }}
          >
            주문완료! 😁<br />
            조리가 완료될 때까지 잠시만 기다려주세요...
          </Typography>
        </Flex>
      ) : (
        <>
          <Flex
            style={{
              padding: "60px",
              flexDirection: "column",
              gap: "50px",
              textAlign: "center",
            }}
          >
            <dl>
              <dt style={{ fontWeight: 500, marginBottom: "10px" }}>Appetizer</dt>
              <dd style={{ margin: 0 }}>Salad</dd>
            </dl>
            <dl>
              <dt style={{ fontWeight: 500, marginBottom: "10px" }}>Meal</dt>
              <dd style={{ margin: 0 }}>Beef Steak</dd>
            </dl>
            <dl>
              <dt style={{ fontWeight: 500, marginBottom: "10px" }}>Semi-Meal</dt>
              <dd style={{ margin: 0 }}>Aglio e Olio</dd>
            </dl>
            <dl>
              <dt style={{ fontWeight: 500, marginBottom: "10px" }}>Dessert</dt>
              <dd style={{ margin: 0 }}>???</dd>
            </dl>
            <dl>
              <dt style={{ fontWeight: 500, marginBottom: "10px" }}>Ect</dt>
              <dd style={{ margin: 0 }}>???</dd>
            </dl>
          </Flex>
          <Flex align="center" justify="space-between">
            Dinner For 엄쪽이
            <Button
              variant="solid"
              color="primary"
              onClick={() => setIsOpen((prevState) => !prevState)}
            >
              주문하기
            </Button>
          </Flex>

          <Modal
            cancelText="취소"
            okText="결제"
            onOk={onClickPaymet}
            okButtonProps={{
              disabled: isPaymentStatus === "TRYING",
            }}
            onCancel={() => setIsOpen((prevState) => !prevState)}
            onClose={() => setIsOpen((prevState) => !prevState)}
            open={isOpen}
          >
            해당 코스로 결제하시겠습니까?
            {isPaymentStatus === "TRYING" && <Spin fullscreen />}
          </Modal>
        </>
      )}
    </main>
  );
};

export default Page;
