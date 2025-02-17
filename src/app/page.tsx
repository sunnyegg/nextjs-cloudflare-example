"use client";

import { useRouter } from "next/navigation";
import useGetUser from "@/query/get/useGetUser";

export default function Home() {
  const router = useRouter();

  const getUser = useGetUser();
  if (getUser.isPending) {
    return <div>Loading...</div>;
  }

  if (getUser.isError) {
    // Not logged in
    if (getUser.error.name === "AuthSessionMissingError") {
      router.push("/login");
    }
    return <div>Error: {getUser.error.message}</div>;
  }

  return (
    <div>
      <p>Hello {JSON.stringify(getUser.data, null, 4)}</p>
    </div>
  );
}
