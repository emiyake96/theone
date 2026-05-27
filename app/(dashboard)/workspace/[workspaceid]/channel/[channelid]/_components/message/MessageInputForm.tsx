'use client'

import { createMessageSchema } from "@/app/schemas/message";
import { RichTextEditor } from "@/components/rich-text-editor/Editor";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup } from "@/components/ui/field";
import { orpc } from "@/lib/orpc";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { SendHorizonal } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

type MessageFormValues = z.infer<typeof createMessageSchema>;

interface iAppProps {
    channelId: string;
}

export function MessageInputForm({ channelId }: iAppProps) {
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

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
                setImageFile(null);
                setImagePreview(null);
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

    function onSubmit(values: MessageFormValues) {
        const text = values.content.replace(/<[^>]*>/g, "").trim();
        if (!text && !imageFile) return;
        // TODO: upload imageFile to storage and set values.imageUrl before mutating
        createMessageMutation.mutate(values);
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