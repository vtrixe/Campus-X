"use client";


import axios from "axios";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import React, { useEffect, useState } from 'react';
import { getrOrganization } from '@/actions/get-organization';


interface Profile {
  id: string;
  userId: string;
  name?: string | null;
  imageUrl?: string | null;
  email?: string | null;
  createdAt: string;
  updatedAt: string;
  role: 'OWNER' | 'ADMIN' | 'MEMBER';
}

interface Organization {
  id: string;
  name: string;
  description?: string | null;
  image?: string | null;
  organizationDomain?: string;
  password?: string | null;
  createdAt: string;
  updatedAt: string;
  profile: Profile[];
}

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"




import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/file-upload";
import { useRouter } from "next/navigation";
import { useModal } from "@/hooks/use-modal-store";
import { RegisterOrganizationForm } from "../auth/register-organization";

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Server name is required."
  }),
  imageUrl: z.string().min(1, {
    message: "Server image is required."
  })

});



export const CreateServerModal = () => {
  const { isOpen, onClose, type } = useModal();
  const router = useRouter();



  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      imageUrl: "",
    }
  });

  
const [organizations, setOrganizations] = useState<Organization[]>([]);
const [selectedOrganization, setSelectedOrganization] = useState<Organization | null>(null);
const [isModalOpen, setIsModalOpen] = useState(false);
const [error, setError] = useState<string | null>(null);

useEffect(() => {
  const fetchOrgs = async () => {
    try {
      const response = await getrOrganization(); 
      setOrganizations(response as unknown as Organization[]);
    } catch (error) {
      console.error('Failed to fetch organizations', error);
      setError('Failed to load organization data');
    }
  };

  fetchOrgs();
}, []);

const handleOpenModal = (org: Organization) => {
  setSelectedOrganization(org);
  setIsModalOpen(true);
};

const handleCloseModal = () => {
  setIsModalOpen(false);
};



  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post("/api/servers", values);

      form.reset();
      router.refresh();
      onClose();
    } catch (error) {
      console.log(error);
    }
  }

  const handleClose = () => {
    form.reset();
    onClose();
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Customize your server
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Give your server a personality with a name and an image. You can always change it later.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-8 px-6">
              <div className="flex items-center justify-center text-center">
                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FileUpload
                          endpoint="serverImage"
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel
                      className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70"
                    >
                      Server name
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                        placeholder="Enter server name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
    <>

    <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel
                      className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70"
                    >
                      Organization
                    </FormLabel>
                    <FormControl>
                      <Input  />

                      <DropdownMenu>
        <DropdownMenuTrigger >
          <button className="bg-blue-500 text-white py-2 px-4 rounded-md">Select Organization</button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-white shadow-lg rounded-lg py-1">
          <DropdownMenuLabel className="px-4 py-2 text-sm text-gray-500">My Organizations</DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-gray-200" />
          {organizations.map((org) => (
            <DropdownMenuItem key={org.id} className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => handleOpenModal(org)}>
              {org.name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
                    
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
  

     
    </>
            </div>
            <DialogFooter className="bg-gray-100 px-6 py-4">
              <Button  disabled={isLoading}>
                Create
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}