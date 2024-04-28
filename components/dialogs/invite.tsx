"use client";
import axios from "axios";
import { Check, Copy, RefreshCw } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useDialog } from "@/zustand/use-dialogs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useOrigin } from "@/hooks/use-origin";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const InviteDialog = () => {
  const { onOpen, isOpen, onClose, type, data } = useDialog();
  const origin = useOrigin();
  const isModalOpen = isOpen && type === "invite";
  const { server } = data;
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState("LECTURER");
  const inviteUrl = `${origin}/invite/${server?.inviteCode}?role=${selectedRole}`;

  const onCopy = () => {
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 1000);
  };

  const onNew = async () => {
    try {
      setIsLoading(true);
      const response = await axios.patch(
        `/api/servers/${server?.id}/invite-code`
      );
      onOpen("invite", { server: response.data });
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className='bg-white text-black p-0 overflow-hidden'>
        <DialogHeader className='pt-8 px-6'>
          <DialogTitle className='text-2xl text-center font-bold'>
            Invite New Members
          </DialogTitle>
        </DialogHeader>
        <div className='p-6'>
          <Label className='uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70'>
            Server invite link
          </Label>
          <div className='flex items-center mt-2 gap-x-2'>
            <Input
              id='url'
              disabled={isLoading}
              className='bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0'
              value={inviteUrl}
            />
            <Button disabled={isLoading} onClick={onCopy} size='icon'>
              {copied ? (
                <Check className='w-4 h-4' />
              ) : (
                <Copy className='w-4 h-4' />
              )}
            </Button>
          </div>
          <div className='mt-4'>
            <Label className='uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70'>
              Choose Role
            </Label>
            <Select
              value={selectedRole}
              onValueChange={(value) => setSelectedRole(value)}
            >
              <SelectTrigger className='mt-2'>
                <SelectValue placeholder='Select a role' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='LECTURER'>LECTURER</SelectItem>
                <SelectItem value='STUDENT'>STUDENT</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            id='generatelink'
            onClick={onNew}
            disabled={isLoading}
            variant='link'
            size='sm'
            className='text-xs text-zinc-500 mt-4'
          >
            Generate a new link <RefreshCw className='w-4 h-4 ml-2' />
          </Button>
          <Button
            id='close'
            onClick={onClose}
            disabled={isLoading}
            variant='link'
            size='sm'
            className='text-xs text-zinc-500 mt-4'
          >
            Close <RefreshCw className='w-4 h-4 ml-2' />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
