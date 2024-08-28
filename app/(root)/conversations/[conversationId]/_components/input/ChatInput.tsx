"use client";

import { Card } from "@components/ui/card";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@components/ui/form";
import { api } from "@convex/_generated/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useConversation } from "@hooks/useConversation";
import { useMutationState } from "@hooks/useMutationState";
import { ConvexError } from "convex/values";
import React, { useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import TextAreaAutoSize from "react-textarea-autosize";
import { Button } from "@components/ui/button";
import { SendHorizonal } from "lucide-react";

const formSchema = z.object({
  content: z.string().min(1, "This field can't be empty"),
});

type formData = z.infer<typeof formSchema>;

const ChatInput = () => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const { conversationId } = useConversation();
  const { mutate: createMessage, pending } = useMutationState(api.message.create);

  const form = useForm<formData>({
    resolver: zodResolver(formSchema),
    defaultValues: { content: "" },
  });

  const handleInputChange = (event: any) => {
    const { value, selectionStart } = event.target;
    if (selectionStart !== null) {
      form.setValue("content", value);
    }
  };

  const onSubmit = async (values: formData) => {
    createMessage({
      conversationId,
      type: "text",
      content: [values.content],
    })
      .then(() => {
        form.reset();
      })
      .catch((error) => toast.error(error instanceof ConvexError ? error.data : "Unexpected error occurred"));
  };

  return (
    <Card className="w-full p-2 rounded-lg relative">
      <div className="flex gap-2 items-end w-full">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-2 items-end w-full">
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem className="h-full w-full">
                  <FormControl>
                    <TextAreaAutoSize
                      onKeyDown={async (e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          await form.handleSubmit(onSubmit);
                        }
                      }}
                      rows={1}
                      maxRows={3}
                      {...field}
                      onChange={handleInputChange}
                      onClick={handleInputChange}
                      placeholder="Type a message..."
                      className="min-h-full w-full resize-none border-0 outline-0 bg-card text-card-foreground placeholder:text-muted-foreground p-1.5"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={pending} size="icon" type="submit">
              <SendHorizonal />
            </Button>
          </form>
        </Form>
      </div>
    </Card>
  );
};

export default ChatInput;
