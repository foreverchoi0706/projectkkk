import useQueryDispatch from "@/hooks/store/useQueryDispatch.ts";
import useQuerySelector from "@/hooks/store/useQuerySelector.ts";
import { Button } from "antd";
import { FC } from "react";

const Page: FC = () => {
  const value = useQuerySelector("TEST");
  const dispatch = useQueryDispatch();
  return (
    <>
      {value}
      <Button onClick={() => dispatch("TEST", Date.now())}>BUTTON</Button>
    </>
  );
};

export default Page;
