"use client";

import React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@components/ui/dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "@components/ui/tooltip";
import { Button } from "@components/ui/button";
import { UserPlus } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@components/ui/form";
import { Input } from "@components/ui/input";
import { useMutationState } from "@hooks/useMutationState";
import { api } from "@convex/_generated/api";
import { toast } from "sonner";
import { ConvexError } from "convex/values";

const formSchema = z.object({
  email: z.string().min(1, "This field can't be empty").email("Please enter a valid email"),
});

type formData = z.infer<typeof formSchema>;

const AddFriendDialog = () => {
  const { mutate: createRequest, pending } = useMutationState(api.request.create);

  const form = useForm<formData>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (values: formData) => {
    await createRequest({ email: values.email })
      .then(() => {
        form.reset();
        toast.success("Friend request sent!");
      })
      .catch((error) => {
        toast.error(error instanceof ConvexError ? error.data : "Unexpected error occurred");
      });
  };

  return (
    <Dialog>
      <Tooltip>
        <TooltipTrigger>
          <Button size="icon" variant="outline">
            <DialogTrigger>
              <UserPlus />
            </DialogTrigger>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Add Friend</p>
        </TooltipContent>
      </Tooltip>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Friend</DialogTitle>
          <DialogDescription>Send a request to connect with your friends!</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Email..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button disabled={pending} type="submit">
                Send
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddFriendDialog;
