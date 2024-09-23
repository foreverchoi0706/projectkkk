import useQueryDispatch from "@/hooks/store/useQueryDispatch.ts";
import useQuerySelector from "@/hooks/store/useQuerySelector.ts";
import { getCookie, setCookie } from "@/utils/cookie.ts";
import { Button } from "antd";
import { FC, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

const Page: FC = () => {
  const [urlSearchParams] = useSearchParams();
  const value = useQuerySelector("TEST");
  const dispatch = useQueryDispatch();

  //http://localhost:5173/test?utm_source=AAA&utm_term=BBB
  useEffect(() => {
    const oldUtmParams = getCookie("utmParams");
    const oldUtmParamsMap = new Map<string, string>();
    if (oldUtmParams) {
      decodeURIComponent(oldUtmParams)
        .split("&")
        .forEach((oldUtmParam) => {
          const [key, value] = oldUtmParam.split("=");
          oldUtmParamsMap.set(key, value);
        });
    }
    const utmKeys = ["utm_source", "utm_term", "utm_content"];
    const utmParams = utmKeys
      .map((utmKey) => {
        const utmValue = urlSearchParams.get(utmKey) || oldUtmParamsMap.get(utmKey);
        return utmValue ? `${utmKey}=${utmValue}` : null;
      })
      .filter(Boolean)
      .join("&");
    setCookie("utmParams", encodeURIComponent(utmParams));
  }, []);

  return (
    <>
      {value}
      <Button onClick={() => dispatch("TEST", Date.now())}>BUTTON</Button>
    </>
  );
};

export default Page;
