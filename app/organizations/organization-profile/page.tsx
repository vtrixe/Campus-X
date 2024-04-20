"use client"
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
} from "@/components/ui/dropdown-menu";

const OrganizationComponent: React.FC = () => {
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

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  if (!organizations.length) {
    return <div className="text-gray-500">Loading...</div>;
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
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

      {isModalOpen && selectedOrganization && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" onClick={handleCloseModal}>
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-bold">{selectedOrganization.name}</h2>
            {selectedOrganization.image && (
              <img src={selectedOrganization.image} alt="Organization" className="w-20 h-20 rounded-full mx-auto my-2" />
            )}
            <p className="mt-2">Domain: {selectedOrganization.organizationDomain}</p>
            <p className="mt-2">Description: {selectedOrganization.description || 'No description available'}</p>
            <div className="mt-4">
              <button className="bg-blue-500 text-white py-2 px-4 rounded-md" onClick={handleCloseModal}>Close</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OrganizationComponent;
