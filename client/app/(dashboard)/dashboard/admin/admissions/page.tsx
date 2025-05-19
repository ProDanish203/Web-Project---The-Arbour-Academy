import { AdmissionRequestsTable } from "@/components/admissions/admission-request-table";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Admission Requests | The Arbour Academy",
  description: "Review and manage student admission requests",
};

const AdmissionsPage = () => {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Admission Requests
          </h1>
          <p className="text-muted-foreground">
            Review and manage pending admission applications
          </p>
        </div>
      </div>
      <AdmissionRequestsTable />
    </div>
  );
};

export default AdmissionsPage;
