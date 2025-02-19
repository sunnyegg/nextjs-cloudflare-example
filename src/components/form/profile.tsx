import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import useGetRoles from "@/query/get/useGetRoles";

const UpdateProfileSchema = z.object({
  full_name: z.string().min(5),
  avatar_url: z.string().url(),
  role_id: z.string().optional(),
});

interface ProfileFormProps {
  profile: {
    full_name: string;
    avatar_url: string;
    role_id: string;
  };
}

export default function ProfileForm(props: ProfileFormProps) {
  const { profile } = props;
  const getRoles = useGetRoles({ enabled: true });

  const form = useForm({
    defaultValues: {
      full_name: profile.full_name,
      avatar_url: profile.avatar_url,
      role_id: profile.role_id,
    },
    resolver: zodResolver(UpdateProfileSchema),
  });

  const handleSubmit = (data: z.infer<typeof UpdateProfileSchema>) => {
    console.log(data);
  };

  return (
    <Form {...form}>
      <form className="space-y-2" onSubmit={form.handleSubmit(handleSubmit)}>
        <FormField
          control={form.control}
          name="full_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Full Name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="role_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Role" />
                  </SelectTrigger>
                </FormControl>
                {getRoles.isPending ? (
                  <div>Loading...</div>
                ) : (
                  <SelectContent className="w-[300px]">
                    {getRoles.data &&
                      getRoles.data.map((role) => (
                        <SelectItem key={role.id} value={role.id}>
                          {role.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                )}
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button className="w-full" variant={"outline"}>
          Submit
        </Button>
      </form>
    </Form>
  );
}
