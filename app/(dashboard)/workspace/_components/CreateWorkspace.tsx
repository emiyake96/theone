'use client'

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { workspaceSchema } from "@/app/schemas/workspace";
import { UserNav } from "./UserNav";

export function CreateWorkspace() {
  const [open, setOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(workspaceSchema),
    defaultValues: {
      name: "",
    },
  });

  function onSubmit(data: any) {
    console.log("bang");
    console.log(data);
  }

  function onInvalid(errors: any) {
    console.log("Form errors:", errors);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="size-12 rounded-xl border-2 border-dashed border-muted-foreground/50 
                text-muted-foreground hover:border-muted-foreground hover:text-foreground hover:rounded-lg transition-all duration-200"
              >
                <Plus className="size-5" />
              </Button>
            </DialogTrigger>
          </TooltipTrigger>

          <TooltipContent side="right">
            <p>Create Workspace</p>
          </TooltipContent>
        </Tooltip>

        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create Workspace</DialogTitle>
            <DialogDescription>
              Fill in the details to create a new workspace.
            </DialogDescription>
          </DialogHeader>

          <form
            className="grid w-full items-center gap-4 py-4"
            onSubmit={form.handleSubmit(onSubmit, onInvalid)}
          >
            <FieldSet className="w-full max-w-sm">
              <Input
                id="name"
                type="text"
                placeholder="My Workspace"
                {...form.register("name")}
              />

              {form.formState.errors.name && (
                <p className="text-sm text-red-500">
                  {String(form.formState.errors.name.message)}
                </p>
              )}
            </FieldSet>

            <Button type="submit" className="w-50">
              Create Workspace
            </Button>
          </form>
        </DialogContent>
      </TooltipProvider>
    </Dialog>
  );
}