import * as z from "zod";
import { useState } from "react";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";

import { Loader2Icon } from "lucide-react";

import useGetRoles from "@/query/get/useGetRoles";
import useUploadAvatar from "@/query/mutation/useUploadAvatar";
import useGetAvatar from "@/query/get/useGetAvatar";
import useUpdateProfile from "@/query/mutation/useUpdateProfile";

import { UpdateProfileRequest } from "@/types/profiles";

import { useToast } from "@/hooks/use-toast";

const UpdateProfileSchema = z.object({
  full_name: z.string().min(5),
  avatar_url: z.string(),
  role_id: z.string().uuid(),
});

interface ProfileFormProps {
  profile: UpdateProfileRequest;
}

export default function ProfileForm(props: ProfileFormProps) {
  const { profile } = props;
  const { toast } = useToast();

  const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url);

  const getRoles = useGetRoles({ enabled: true });
  const uploadAvatar = useUploadAvatar();
  const getAvatar = useGetAvatar(avatarUrl);
  const updateProfile = useUpdateProfile();

  const form = useForm({
    defaultValues: {
      full_name: profile.full_name,
      avatar_url: profile.avatar_url,
      role_id: profile.role_id,
    },
    resolver: zodResolver(UpdateProfileSchema),
  });

  const handleSubmit = async (data: z.infer<typeof UpdateProfileSchema>) => {
    try {
      await updateProfile.mutateAsync(data);
      toast({
        title: "Success ✅",
        description: "Your profile has been updated successfully",
      });
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: "Error ❌",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error ❌",
          description: "Unknown error",
          variant: "destructive",
        });
      }
    }
  };

  const handleAvatarChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    event.preventDefault();
    form.clearErrors("avatar_url");

    const file = event.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      // Upload the file to Cloudflare R2
      await uploadAvatar.mutateAsync(file);

      // Update the form value to the filename
      form.setValue("avatar_url", file.name);
      setAvatarUrl(file.name);

      await getAvatar.refetch();
    } else {
      form.setError("avatar_url", {
        type: "required",
        message: "Please select an image",
      });
    }
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
          name="avatar_url"
          render={() => (
            <FormItem>
              <FormLabel>Avatar</FormLabel>
              <FormControl>
                <div className="flex items-center gap-2">
                  {getAvatar.isPending || uploadAvatar.isPending ? (
                    <Skeleton className="w-16 h-16 rounded-full" />
                  ) : (
                    <Avatar className="w-16 h-16">
                      <AvatarImage src={getAvatar.data} />
                      <AvatarFallback>
                        {form.getValues("full_name").slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                  )}

                  <Input
                    type="file"
                    className="pt-1 md:pt-1.5"
                    onChange={handleAvatarChange}
                  />
                </div>
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
                  <SelectContent>
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

        <Button
          className="w-full"
          variant={"outline"}
          disabled={uploadAvatar.isPending}
        >
          {updateProfile.isPending ? (
            <Loader2Icon className="animate-spin" />
          ) : (
            "Submit"
          )}
        </Button>
      </form>
    </Form>
  );
}
