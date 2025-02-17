"use client";

import { useRouter } from "next/navigation";
import useGetUser from "@/query/get/useGetUser";
import { Button } from "@/components/ui/button";
import supabase from "@/service/supabase";

export default function Home() {
  const router = useRouter();

  const getUser = useGetUser();
  if (getUser.isPending) {
    return <div>Loading...</div>;
  }

  if (getUser.isError) {
    // Not logged in
    if (getUser.error.name === "AuthSessionMissingError") {
      setTimeout(() => {
        router.push("/login");
      }, 100);
      return;
    }
    return <div>Error: {getUser.error.message}</div>;
  }

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      return <div>Error: {error.message}</div>;
    }

    // Reload the page and clear the url
    setTimeout(() => {
      router.push("/");
      setTimeout(() => {
        window.location.reload();
      }, 100);
    }, 100);
  };

  return (
    <div className="space-y-4">
      <p>Hello, {getUser.data.user.user_metadata.name}!</p>
      <Button
        className="w-full"
        onClick={() => handleSignOut()}
        variant={"outline"}
      >
        Sign Out
      </Button>
    </div>
  );
}
