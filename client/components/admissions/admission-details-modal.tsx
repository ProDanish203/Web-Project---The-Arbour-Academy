"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { cn, formatDate } from "@/lib/utils";
import type { AdmissionRequest } from "@/types/types";
import { CheckCircle2, XCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AVAILABLE_SECTIONS } from "@/lib/data";
import { ADMISSION_STATUS } from "@/lib/constants";

interface AdmissionDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  admissionRequest: AdmissionRequest;
  onStatusUpdate: (
    id: string,
    status: string,
    comments: string,
    section?: string
  ) => void;
}

export function AdmissionDetailsModal({
  isOpen,
  onClose,
  admissionRequest,
  onStatusUpdate,
}: AdmissionDetailsModalProps) {
  const [status, setStatus] = useState<string>(ADMISSION_STATUS.PENDING);
  const [comments, setComments] = useState("");
  const [section, setSection] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSectionError, setShowSectionError] = useState(false);

  const handleSubmit = async () => {
    if (status === ADMISSION_STATUS.APPROVED && !section) {
      setShowSectionError(true);
      return;
    }
    setIsSubmitting(true);
    onStatusUpdate(admissionRequest._id, status, comments, section);
    setIsSubmitting(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Admission Application #{admissionRequest._id}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="details" className="mt-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Student Details</TabsTrigger>
            <TabsTrigger value="parent">Parent Information</TabsTrigger>
            <TabsTrigger value="review">Review & Decision</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4 mt-4">
            <StudentDetails admissionRequest={admissionRequest} />
          </TabsContent>

          <TabsContent value="parent" className="space-y-4 mt-4">
            <ParentDetails admissionRequest={admissionRequest} />
          </TabsContent>

          <TabsContent value="review" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Application Review</CardTitle>
                <CardDescription>
                  Review and make a decision on this application
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Decision</Label>
                  <Select
                    value={status}
                    onValueChange={(value) => {
                      setStatus(value);
                      setShowSectionError(false);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a decision" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={ADMISSION_STATUS.PENDING}>
                        Pending
                      </SelectItem>
                      <SelectItem value={ADMISSION_STATUS.APPROVED}>
                        Approve
                      </SelectItem>
                      <SelectItem value={ADMISSION_STATUS.REJECTED}>
                        Reject
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {status === ADMISSION_STATUS.APPROVED && (
                  <div className="space-y-2">
                    <Label htmlFor="section">Assign Section</Label>
                    <Select
                      value={section}
                      onValueChange={(value) => {
                        setSection(value);
                        setShowSectionError(false);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a section" />
                      </SelectTrigger>
                      <SelectContent>
                        {AVAILABLE_SECTIONS.map((section, idx) => (
                          <SelectItem key={idx} value={section}>
                            Section {section}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {showSectionError && (
                      <p className="text-sm text-red-500 mt-1">
                        Section is required for approved applications
                      </p>
                    )}
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="comments">Comments</Label>
                  <Textarea
                    id="comments"
                    placeholder="Add any comments or notes about this application"
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    rows={4}
                  />
                </div>

                {status === ADMISSION_STATUS.APPROVED && (
                  <Alert className="bg-green-50 border-green-200">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <AlertTitle className="text-green-800">
                      Approval Notice
                    </AlertTitle>
                    <AlertDescription className="text-green-700">
                      Approving this application will automatically create
                      accounts for the parent and student. The parent will
                      receive login credentials via email.
                    </AlertDescription>
                  </Alert>
                )}

                {status === ADMISSION_STATUS.REJECTED && (
                  <Alert className="bg-red-50 border-red-200">
                    <XCircle className="h-4 w-4 text-red-600" />
                    <AlertTitle className="text-red-800">
                      Rejection Notice
                    </AlertTitle>
                    <AlertDescription className="text-red-700">
                      The parent will be notified about the rejection via email.
                      Please provide a reason in the comments section.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0 mt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={cn(
              "text-white",
              status === ADMISSION_STATUS.APPROVED
                ? "bg-green-600 hover:bg-green-700"
                : status === ADMISSION_STATUS.REJECTED &&
                    "bg-red-600 hover:bg-red-700"
            )}
          >
            {isSubmitting ? (
              <>
                <span className="animate-spin mr-2">⟳</span>
                Processing...
              </>
            ) : status === ADMISSION_STATUS.PENDING ? (
              "Save"
            ) : status === ADMISSION_STATUS.APPROVED ? (
              "Approve Application"
            ) : (
              "Reject Application"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

const StudentDetails = ({
  admissionRequest,
}: {
  admissionRequest: AdmissionRequest;
}) => {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Student Information</CardTitle>
          <CardDescription>Personal details of the applicant</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Full Name</Label>
            <div className="font-medium">
              {admissionRequest.studentInfo.firstName}{" "}
              {admissionRequest.studentInfo.lastName}
            </div>
          </div>
          <div className="space-y-2">
            <Label>Date of Birth</Label>
            <div className="font-medium">
              {formatDate(admissionRequest.studentInfo.dateOfBirth)}
            </div>
          </div>
          <div className="space-y-2">
            <Label>Gender</Label>
            <div className="font-medium capitalize">
              {admissionRequest.studentInfo.gender}
            </div>
          </div>
          <div className="space-y-2">
            <Label>Grade Applied For</Label>
            <div className="font-medium">
              {admissionRequest.studentInfo.grade}
            </div>
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>Address</Label>
            <div className="font-medium">{admissionRequest.address}</div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Emergency Contact</CardTitle>
          <CardDescription>Emergency contact information</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Name</Label>
            <div className="font-medium">
              {admissionRequest.emergencyContact.name}
            </div>
          </div>
          <div className="space-y-2">
            <Label>Relation</Label>
            <div className="font-medium">
              {admissionRequest.emergencyContact.relation}
            </div>
          </div>
          <div className="space-y-2">
            <Label>Phone Number</Label>
            <div className="font-medium">
              {admissionRequest.emergencyContact.phone}
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

const ParentDetails = ({
  admissionRequest,
}: {
  admissionRequest: AdmissionRequest;
}) => {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Parent/Guardian Information</CardTitle>
          <CardDescription>Details of the parent or guardian</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Full Name</Label>
            <div className="font-medium">
              {admissionRequest.parentInfo.name}
            </div>
          </div>
          <div className="space-y-2">
            <Label>Relation to Student</Label>
            <div className="font-medium">
              {admissionRequest.parentInfo.relation}
            </div>
          </div>
          <div className="space-y-2">
            <Label>Email Address</Label>
            <div className="font-medium">
              {admissionRequest.parentInfo.email}
            </div>
          </div>
          <div className="space-y-2">
            <Label>Phone Number</Label>
            <div className="font-medium">
              {admissionRequest.parentInfo.phone}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Application Details</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Application Date</Label>
            <div className="font-medium">
              {formatDate(admissionRequest.applicationDate)}
            </div>
          </div>
          <div className="space-y-2">
            <Label>Application Status</Label>
            <div className="font-medium">
              <span className="px-2 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                Pending
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};
