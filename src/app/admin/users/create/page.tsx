"use client";

import React from "react";
import Link from "next/link";
import { UserManagementView } from "@/components/admin/UserManagementView";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/common/Button";

export default function CreateUserPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Link href="/admin/users">
          <Button variant="ghost" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />}>
            Back to Users Directory
          </Button>
        </Link>
      </div>
      <UserManagementView />
    </div>
  );
}
