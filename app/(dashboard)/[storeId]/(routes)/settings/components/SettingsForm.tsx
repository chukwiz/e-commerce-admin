"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Store } from "@prisma/client";
import { Trash } from "lucide-react";
import { FC, useState } from "react";
import { useForm } from "react-hook-form";

import Heading from "@/components/Heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SettingsFormType } from "@/lib/validators/settings";
import { StoreFormSchema } from "@/lib/validators/store";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { AlertModal } from "@/components/modals/alert-modal";
import ApiAlert from "@/components/ui/api-alert";
import { useOrigin } from "@/hooks/use-origin";

interface SettingsFormProps {
  initialData: Store;
}

const SettingsForm: FC<SettingsFormProps> = ({ initialData }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const params = useParams()
  const router = useRouter()
  const origin = useOrigin()

  const form = useForm<SettingsFormType>({
    resolver: zodResolver(StoreFormSchema),
    defaultValues: initialData,
  });

  const onSubmit = async (data: SettingsFormType) => {
    try {
        setLoading(true)
        await axios.patch(`/api/stores/${params.storeId}`, data)
        router.refresh()
        toast.success("store updated")
        
    } catch (error) {
        toast.error("something went wrong")
    } finally {
        setLoading(false)
    }
  };

  const onDelete = async() => {
    try {
        setLoading(true)
        await axios.delete(`/api/stores/${params.storeId}`)
        router.refresh()
        router.push("/")
        toast.success("store deleted")
    } catch (error) {
        console.log(error)
        toast.error("Make sure you remove all products and categories first")
    } finally {
        setLoading(false)
        setOpen(false)
    }
  }

  return (
    <>
    <AlertModal isOpen={open} loading={loading} onClose={() => setOpen(false)} onConfirm={onDelete} />
      <div className=" flex items-center justify-between">
        <Heading title="Settings" description="Manage store preferences" />
        <Button disabled={loading} variant="destructive" size="icon" onClick={() => {setOpen(true)}}>
          <Trash className=" h-4 w-4" />
        </Button>
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className=" space-y-8 w-full"
        >
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="store name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button disabled={loading} className=" ml-auto" type="submit">
            Save Changes
          </Button>
        </form>
      </Form>
      <Separator />
      <ApiAlert title="NEXT_PUBLIC_API_URL" description={`${origin}/api/${params.storeId}`} variant="public" />
    </>
  );
};

export default SettingsForm;
