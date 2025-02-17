"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Google from "../../../public/google.svg";
import Image from "next/image";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import supabase from "@/service/supabase";

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export default function Login() {
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(LoginSchema),
  });

  const handleSubmit = (data: z.infer<typeof LoginSchema>) => {
    console.log(data);
  };

  const handleGoogleLogin = () => {
    supabase.auth.signInWithOAuth({ provider: "google" });
  };

  return (
    <div className="p-4 space-y-4">
      <h1>Login</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Email" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" {...field} placeholder="Password" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>

      <div>
        <Button
          className="w-full"
          variant={"outline"}
          onClick={handleGoogleLogin}
        >
          <Image src={Google} alt="Google" width={20} height={20} />
          Sign in with Google
        </Button>
      </div>
    </div>
  );
}
