'use client'

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Plus } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { channelSchema, transformChannelName } from "@/app/schemas/channel";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

type ChannelFormValues = {
  name: string;
};

export function CreateNewChannel() {
  const [open, setOpen] = useState(false);

  const form = useForm<ChannelFormValues>({
    resolver: zodResolver(channelSchema),
    defaultValues: {
      name: "",
    },
  });

  const watchedName = form.watch("name");

  const transformedName = watchedName
    ? transformChannelName(watchedName)
    : "";

  function onSubmit(data: ChannelFormValues) {
    const finalChannelName = transformChannelName(data.name);

    console.log({
      originalName: data.name,
      channelName: finalChannelName,
    });

    // Later, this is where you would call your API/server action.
    // createChannel({ name: finalChannelName })

    form.reset();
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <Plus className="size-4" />
          Add Channel
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:w-[400px]">
        <DialogHeader>
          <DialogTitle>Create New Channel</DialogTitle>
          <DialogDescription>
            Create a new channel to get started.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>
                  Channel Name
                </FieldLabel>

                <Input
                  {...field}
                  id={field.name}
                  placeholder=""
                  aria-invalid={fieldState.invalid}
                />

                {transformedName && (
                  <FieldDescription>
                    Channel name will be:{" "}
                    <code>{transformedName}</code>
                  </FieldDescription>
                )}

                {fieldState.error && (
                  <FieldError>
                    {fieldState.error.message}
                  </FieldError>
                )}
              </Field>
            )}
          />

          <Button type="submit" className="w-50">
            Create Channel
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}