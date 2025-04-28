"use client";

import Welcome from "@/sections/welcome";
import "../styles/globals.css";
import useAuthRedirect from "@/hooks/useAuthRedirect";
import Loader from "@/components/loader";

const Page = () => {
  const { isLoading } = useAuthRedirect();

  if (isLoading) return <Loader />;

  return <Welcome />;
};

export default Page;
