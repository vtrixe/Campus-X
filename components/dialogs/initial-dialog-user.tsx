"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const JoinServerModal = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [inviteLink, setInviteLink] = useState("");

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  const handleJoin = () => {
    const inviteCode = inviteLink.split("/").pop();
    if (inviteCode) {
      router.push(`/invite/${inviteCode}`);
    } else {
      // Handle invalid invite link
    }
    handleClose();
  };

  return (
    <>
      <Button onClick={handleOpen}>Join Server</Button>
      <Dialog open={isOpen} >
        <DialogHeader>
          <DialogTitle>Join Server</DialogTitle>
        </DialogHeader>
        <DialogContent>
          <div className="grid gap-4 py-4">
            <Label htmlFor="inviteLink">Enter Invite Link</Label>
            <Input
              id="inviteLink"
              placeholder="https://example.com/invite/abc123"
              value={inviteLink}
              onChange={(e) => setInviteLink(e.target.value)}
            />
          </div>
          <div className="mt-4 flex justify-end">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button className="ml-2" onClick={handleJoin}>
              Join
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};