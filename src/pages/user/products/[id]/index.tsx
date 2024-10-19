import { FC, useEffect } from "react";
import { useParams } from "react-router-dom";

const Page: FC = () => {
  const { id } = useParams();

  useEffect(() => {
    console.log(id);
  });
  return <main>dasdad</main>;
};

export default Page;
