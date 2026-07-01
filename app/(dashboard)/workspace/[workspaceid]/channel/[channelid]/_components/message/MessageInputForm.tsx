'use client'

import { createMessageSchema } from "@/app/schemas/message";
import { RichTextEditor } from "@/components/rich-text-editor/Editor";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup } from "@/components/ui/field";
import { messagesQueryKey } from "../MessageList";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SendHorizonal } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { orpc } from "@/lib/orpc";

type MessageFormValues = z.infer<typeof createMessageSchema>;

interface iAppProps {
    channelId: string;
}

function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

export function MessageInputForm({ channelId }: iAppProps) {
    const queryClient = useQueryClient();
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [clearTrigger, setClearTrigger] = useState(0);

    const form = useForm<MessageFormValues>({
        resolver: zodResolver(createMessageSchema),
        defaultValues: {
            channelId,
            content: "",
        },
    });

    const createMessageMutation = useMutation(
        orpc.message.create.mutationOptions({
            onSuccess: () => {
                form.reset({ channelId, content: "" });
                setClearTrigger(n => n + 1);
                setImageFile(null);
                setImagePreview(null);
                toast.success("Message sent!");
                queryClient.invalidateQueries({ queryKey: messagesQueryKey(channelId) });
            },
            onError: (error) => {
                toast.error(`Failed to send message: ${error.message}`);
            },
        })
    );

    function handleImageChange(file: File | null) {
        setImageFile(file);
        if (file) {
            const url = URL.createObjectURL(file);
            setImagePreview(url);
        } else {
            setImagePreview(null);
        }
    }

    async function onSubmit(values: MessageFormValues) {
        // Strip tags only to check if there's actual content — send the original HTML
        const plainText = values.content.replace(/<[^>]*>/g, "").trim();
        if (!plainText && !imageFile) return;

        let imageUrl: string | undefined;
        if (imageFile) {
            try {
                imageUrl = await fileToBase64(imageFile);
            } catch {
                toast.error("Failed to process image. Please try again.");
                return;
            }
        }

        createMessageMutation.mutate({ ...values, imageUrl });
    }

    function handleKeyDown(e: React.KeyboardEvent) {
        if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
            form.handleSubmit(onSubmit)();
        }
    }

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} onKeyDown={handleKeyDown}>
            <FieldGroup>
                <Controller
                    name="content"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <RichTextEditor
                                value={field.value}
                                onChange={field.onChange}
                                onImageChange={handleImageChange}
                                imagePreview={imagePreview}
                                clearTrigger={clearTrigger}
                            />
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )}
                />
                <Field orientation="horizontal">
                    <p className="text-xs text-muted-foreground">
                        <kbd className="px-1 py-0.5 rounded border border-border text-xs">
                            ⌘ Enter
                        </kbd>{" "}
                        to send
                    </p>
                    <Button
                        type="submit"
                        size="sm"
                        disabled={createMessageMutation.isPending}
                    >
                        <SendHorizonal className="size-4 mr-1" />
                        {createMessageMutation.isPending ? "Sending..." : "Send"}
                    </Button>
                </Field>
            </FieldGroup>
        </form>
    );
}
