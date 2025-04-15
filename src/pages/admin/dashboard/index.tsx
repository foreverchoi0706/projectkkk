import type { FC } from "react";

const Page: FC = () => {
  return (
    <iframe
      title="dashboard"
      width="100%"
      height="100%"
      src="https://www.projectkkk.com:5601/app/dashboards#/view/b885cd80-0fd6-11f0-b9da-41f9d64eebe5?_g=(refreshInterval%3A(pause%3A!t%2Cvalue%3A60000)%2Ctime%3A(from%3Anow-15m%2Cto%3Anow))"
    />
  );
};

export default Page;
