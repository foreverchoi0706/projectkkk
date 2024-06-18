import { Col, Row } from "antd";
import { FC } from "react";
import { Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

const Page: FC = () => {
  return (
    <Row>
      {[...new Array(2)].map((_, index) => (
        <Col style={{ flexGrow: "1" }} key={index}>
          <Line
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: "top",
                },
                title: {
                  display: true,
                  text: "상품",
                },
              },
            }}
            data={{
              labels: ["January", "February", "March", "April", "May", "June", "July"],
              datasets: [
                {
                  label: "분류 1", //그래프 분류되는 항목
                  data: [1, 2, 3, 4, 5, 6, 7], //실제 그려지는 데이터(Y축 숫자)
                  borderColor: "rgb(255, 99, 132)", //그래프 선 color
                  backgroundColor: "rgba(255, 99, 132, 0.5)", //마우스 호버시 나타나는 분류네모 표시 bg
                },
                {
                  label: "분류 2",
                  data: [2, 3, 4, 5, 4, 7, 8],
                  borderColor: "rgb(53, 162, 235)", //실제 그려지는 데이터(Y축 숫자)
                  backgroundColor: "rgba(53, 162, 235, 0.5)",
                },
              ],
            }}
          />
        </Col>
      ))}
    </Row>
  );
};

export default Page;
