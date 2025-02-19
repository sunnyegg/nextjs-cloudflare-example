"use client";

import { useRouter } from "next/navigation";
import useGetProfile from "@/query/get/useGetProfile";
import { createClient } from "@/lib/supabase/client";

import { Button } from "@/components/ui/button";
import ProfileForm from "@/components/form/profile";

export default function Home() {
  const router = useRouter();
  const getProfile = useGetProfile();

  if (getProfile.isPending) {
    return <div>Loading...</div>;
  }

  if (getProfile.isError) {
    // Not logged in
    if (getProfile.error.name === "AuthSessionMissingError") {
      setTimeout(() => {
        router.push("/login");
      }, 100);
      return;
    }

    setTimeout(async () => {
      await signOut();
    }, 1000);
    return <div>Error: {getProfile.error.message}</div>;
  }

  const handleSignOut = async () => {
    const error = await signOut();
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
    <div className="space-y-4 p-4">
      <p>Hello, {getProfile.data.full_name}!</p>

      <ProfileForm profile={getProfile.data} />

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

const signOut = async () => {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();
  return error;
};
