'use client'
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"


export function CreateWorkspace() {
    const [open, setOpen] = useState(false)
    const form = useForm()
    
    function onSubmit() {
        console.log('data')
    }
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <DialogTrigger asChild>
                            <Button variant='ghost' size='icon' 
                            className="size-12 rounded-xl border-2 border-dashed border-muted-foreground/50 
                            text-muted-foreground hover:border-muted-foreground hover:text-foreground hover:rounded-lg transition-all duration-200">
                                <Plus className='size 5' />
                            </Button>
                        </DialogTrigger>
                    </TooltipTrigger>
                    <TooltipContent side='right'>
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
                    <form onSubmit={form.handleSubmit(onSubmit)} className="grid w-full items-center gap-4 py-4">
                        <FieldSet className="w-full max-w-sm">
                        <FieldLegend>Address Information</FieldLegend>
                        <FieldDescription>
                            We need your address to deliver your order.
                        </FieldDescription>
                        <FieldGroup>
                            <Field>
                            <FieldLabel htmlFor="street">Street Address</FieldLabel>
                            <Input id="street" type="text" placeholder="123 Main St" />
                            </Field>
                            <div className="grid grid-cols-2 gap-4">
                            <Field>
                                <FieldLabel htmlFor="city">City</FieldLabel>
                                <Input id="city" type="text" placeholder="New York" />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="zip">Postal Code</FieldLabel>
                                <Input id="zip" type="text" placeholder="90502" />
                            </Field>
                            <Field orientation="horizontal">
                                <Button type="submit">Submit</Button>
                                <Button variant="outline" type="button">
                                Cancel
                                </Button>
                            </Field>
                            </div>
                        </FieldGroup>
                        </FieldSet>
                    </form>
                </DialogContent>
            </TooltipProvider>
        </Dialog>
    )
}