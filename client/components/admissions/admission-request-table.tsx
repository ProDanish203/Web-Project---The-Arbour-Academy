"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Badge } from "@/components/ui/badge";
import { Search, FileText } from "lucide-react";
import { AdmissionDetailsModal } from "./admission-details-modal";
import { formatDate } from "@/lib/utils";
import type { AdmissionRequest } from "@/types/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAdmissionRequests,
  reviewAdmissionApplciation,
} from "@/API/admission.api";
import { toast } from "sonner";

export function AdmissionRequestsTable() {
  const queryClient = useQueryClient();
  const [admissionRequests, setAdmissionRequests] = useState<
    AdmissionRequest[]
  >([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRequest, setSelectedRequest] =
    useState<AdmissionRequest | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const itemsPerPage = 10;

  const { data, isLoading } = useQuery({
    queryKey: ["admission-requests"],
    queryFn: () =>
      getAdmissionRequests({
        limit: 1000,
        page: 1,
        search: "",
        filter: "",
      }),
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: reviewAdmissionApplciation,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admission-requests"],
      });
    },
  });

  useEffect(() => {
    if (data && data.success) {
      setAdmissionRequests(data.response.data);
    }
  }, [data]);

  const filteredRequests = admissionRequests.filter((request) => {
    const searchString = searchQuery.toLowerCase();
    return (
      request.studentInfo.firstName.toLowerCase().includes(searchString) ||
      request.studentInfo.lastName.toLowerCase().includes(searchString) ||
      request.parentInfo.name.toLowerCase().includes(searchString) ||
      request.parentInfo.email.toLowerCase().includes(searchString)
    );
  });

  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
  const paginatedRequests = filteredRequests.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleOpenModal = (request: AdmissionRequest) => {
    setSelectedRequest(request);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRequest(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search applications..."
            className="w-full pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Select defaultValue="applicationDate">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="applicationDate">Application Date</SelectItem>
              <SelectItem value="studentName">Student Name</SelectItem>
              <SelectItem value="grade">Grade</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="10">
            <SelectTrigger className="w-[80px]">
              <SelectValue placeholder="Show" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardHeader className="p-4">
          <CardTitle>Pending Admission Requests</CardTitle>
          <CardDescription>
            Review and process student admission applications
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : paginatedRequests.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center p-4">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">
                No admission requests found
              </h3>
              <p className="text-muted-foreground mt-2">
                {searchQuery
                  ? "Try adjusting your search query"
                  : "There are no pending admission requests at this time"}
              </p>
            </div>
          ) : (
            <div className="overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Application ID</TableHead>
                    <TableHead>Student Name</TableHead>
                    <TableHead>Grade</TableHead>
                    <TableHead>Parent Name</TableHead>
                    <TableHead>Application Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedRequests.map((request) => (
                    <TableRow
                      key={request._id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleOpenModal(request)}
                    >
                      <TableCell className="font-medium">
                        #{request._id}
                      </TableCell>
                      <TableCell>
                        {request.studentInfo.firstName}{" "}
                        {request.studentInfo.lastName}
                      </TableCell>
                      <TableCell>{request.studentInfo.grade}</TableCell>
                      <TableCell>{request.parentInfo.name}</TableCell>
                      <TableCell>
                        {formatDate(request.applicationDate)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="bg-amber-50 text-amber-700 border-amber-200"
                        >
                          Pending
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenModal(request);
                          }}
                        >
                          Review
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {!isLoading && filteredRequests.length > 0 && (
            <div className="flex items-center justify-end py-4 w-full">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage > 1) setCurrentPage(currentPage - 1);
                      }}
                      className={
                        currentPage === 1
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          href="#"
                          isActive={page === currentPage}
                          onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage(page);
                          }}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  )}
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage < totalPages)
                          setCurrentPage(currentPage + 1);
                      }}
                      className={
                        currentPage === totalPages
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>

      {selectedRequest && (
        <AdmissionDetailsModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          admissionRequest={selectedRequest}
          onStatusUpdate={async (id, status, comments, section) => {
            console.log("Updating status:", { id, status, comments, section });
            if (!status || !id || !section)
              return toast.error("Please fill all the fields");
            const { success, response } = await mutateAsync({
              id: id,
              formData: {
                status,
                comments,
                section,
              },
            });
            if (!success) toast.error(response as string);
            handleCloseModal();
          }}
        />
      )}
    </div>
  );
}
