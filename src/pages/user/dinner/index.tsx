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
        <Typography style={{ color: "white", fontSize: "0.75rem", fontWeight: 500 }}>
          2024.10.08 Autumn
        </Typography>
        <Typography style={{ color: "white", fontSize: "0.75rem", fontWeight: 500 }}>
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
              padding: "50px",
              flexDirection: "column",
              gap: "30px",
              textAlign: "center",
            }}
          >
            <dl>
              <dt style={{ fontWeight: 500, marginBottom: "10px" }}>Salad(Appetizer)</dt>
              <dd style={{ margin: 0, fontSize: "0.75rem" }}>식욕을 돋구는 샐러드</dd>
            </dl>
            <dl>
              <dt style={{ fontWeight: 500, marginBottom: "10px" }}>Beef Steak(Meal)</dt>
              <dd style={{ margin: 0, fontSize: "0.75rem" }}>세가지 소금을 곁들인 비프 스테이크</dd>
            </dl>
            <dl>
              <dt style={{ fontWeight: 500, marginBottom: "10px" }}>Aglio e Olio(Semi-Meal)</dt>
              <dd style={{ margin: 0, fontSize: "0.75rem" }}>
                베이컨과 아스파라거스, 치킨스톡의 풍미를 느낄 수 있는 알리오올리오
              </dd>
            </dl>
            <dl>
              <dt style={{ fontWeight: 500, marginBottom: "10px" }}>Dessert</dt>
              <dd style={{ margin: 0, fontSize: "0.75rem" }}>???</dd>
            </dl>
            <dl>
              <dt style={{ fontWeight: 500, marginBottom: "10px" }}>Ect</dt>
              <dd style={{ margin: 0, fontSize: "0.75rem" }}>???</dd>
            </dl>
          </Flex>
          <Flex
            style={{ position: "fixed", bottom: "0", width: "100%", left: 0, padding: "20px" }}
            align="center"
            justify="space-between"
          >
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
