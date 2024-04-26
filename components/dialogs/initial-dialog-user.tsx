'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const JoinServerModal = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true); // Set isOpen to true initially
  const [inviteLink, setInviteLink] = useState("");

  const handleJoin = () => {
    const inviteCode = inviteLink.split("/").pop();
    if (inviteCode) {
      router.push(`/invite/${inviteCode}`);
    } else {
      // Handle invalid invite link
    }
  };

  return (
    <Dialog open={isOpen}>
      <DialogHeader>
        <DialogTitle>Join Server</DialogTitle>
      </DialogHeader>
      <DialogContent>
         <Label htmlFor="inviteLink">Enter Invite Link</Label>
          <Input
            id="inviteLink"
            placeholder="https://example.com/invite/abc123"
            value={inviteLink}
            onChange={(e) => setInviteLink(e.target.value)}
          />


          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button className="ml-2" onClick={handleJoin}>
            Join
          </Button>
      </DialogContent>
    </Dialog>
  );
};