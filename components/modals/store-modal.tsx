"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";

import { useStoreModal } from "@/hooks/use-store-modal";
import { Modal } from "@/components/ui/modal";

import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  name: z.string().min(3).max(32),
});

type FormInputType = z.infer<typeof formSchema>;

export const StoreModal = () => {
  const storeModal = useStoreModal();

  const form = useForm<FormInputType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (values: FormInputType) => {
    
  };

  return (
    <Modal
      title="Create store"
      description="Add a new store to manage products and categories"
      isOpen={storeModal.isOpen}
      onClose={storeModal.onClose}
    >
      Future create store form
    </Modal>
  );
};
