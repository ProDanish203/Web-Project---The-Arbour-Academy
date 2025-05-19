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
import { Search, Pencil, Trash2, UserPlus } from "lucide-react";
import { TeacherFormModal } from "./teacher-form-modal";
import { DeleteTeacherDialog } from "./delete-teacher-dialog";
import { formatDate } from "@/lib/utils";
import type { Teacher } from "@/types/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addTeacher,
  getAllTeachers,
  removeTeacher,
  updateTeacher,
} from "@/API/teachers.api";
import { toast } from "sonner";

export function TeachersTable() {
  const queryClient = useQueryClient();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const itemsPerPage = 10;

  const { data, isLoading } = useQuery({
    queryKey: ["teachers"],
    queryFn: () =>
      getAllTeachers({
        limit: 1000,
        page: 1,
        search: "",
        filter: "",
      }),
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: addTeacher,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["teachers"],
      });
    },
  });

  const { mutateAsync: updateAsync, isPending: updatePending } = useMutation({
    mutationFn: updateTeacher,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["teachers"],
      });
    },
  });

  const { mutateAsync: deleteAsync, isPending: deletePending } = useMutation({
    mutationFn: removeTeacher,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["teachers"],
      });
    },
  });

  useEffect(() => {
    if (data && data.success) {
      setTeachers(data.response.data);
    }
  }, [data]);

  const filteredTeachers = teachers.filter((teacher) => {
    const searchString = searchQuery.toLowerCase();
    return (
      teacher.userId.name.toLowerCase().includes(searchString) ||
      teacher.userId.email.toLowerCase().includes(searchString) ||
      teacher.designation.toLowerCase().includes(searchString) ||
      teacher.subjects.some((subject) =>
        subject.toLowerCase().includes(searchString)
      ) ||
      teacher.grades.some((grade) => grade.toLowerCase().includes(searchString))
    );
  });

  const sortedTeachers = [...filteredTeachers].sort((a, b) => {
    let valueA, valueB;

    switch (sortField) {
      case "name":
        valueA = a.userId.name;
        valueB = b.userId.name;
        break;
      case "designation":
        valueA = a.designation;
        valueB = b.designation;
        break;
      case "joiningDate":
        valueA = new Date(a.joiningDate).getTime();
        valueB = new Date(b.joiningDate).getTime();
        break;
      case "employmentType":
        valueA = a.employmentType;
        valueB = b.employmentType;
        break;
      default:
        valueA = a.userId.name;
        valueB = b.userId.name;
    }

    if (valueA < valueB) return sortOrder === "asc" ? -1 : 1;
    if (valueA > valueB) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  const totalPages = Math.ceil(sortedTeachers.length / itemsPerPage);
  const paginatedTeachers = sortedTeachers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleOpenFormModal = (teacher?: Teacher) => {
    setSelectedTeacher(teacher || null);
    setIsFormModalOpen(true);
  };

  const handleCloseFormModal = () => {
    setIsFormModalOpen(false);
    setSelectedTeacher(null);
  };

  const handleOpenDeleteDialog = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setIsDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setSelectedTeacher(null);
  };

  const handleAddTeacher = async (newTeacher: Teacher) => {
    const newTeacherData = {
      ...newTeacher,
      name: newTeacher.userId.name,
      email: newTeacher.userId.email,
      phone: newTeacher.userId.phone,
    };
    const { success, response } = await mutateAsync(newTeacherData);
    if (!success) toast.error(response as string);
    handleCloseFormModal();
  };

  const handleUpdateTeacher = async (updatedTeacher: Teacher) => {
    const { userId, ...rest } = updatedTeacher;
    const updatedTeacherData = {
      teacherData: rest,
      userData: {
        name: userId.name,
        email: userId.email,
        phone: userId.phone,
      },
    };
    const { success, response } = await updateAsync({
      id: updatedTeacher._id,
      formData: updatedTeacherData,
    });
    if (!success) toast.error(response as string);
    handleCloseFormModal();
  };

  const handleDeleteTeacher = async (teacherId: string) => {
    const { response, success } = await deleteAsync(teacherId);
    if (!success) toast.error(response as string);
    handleCloseDeleteDialog();
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search teachers..."
            className="w-full pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Select
            value={sortField}
            onValueChange={(value) => {
              setSortField(value);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="designation">Designation</SelectItem>
              <SelectItem value="joiningDate">Joining Date</SelectItem>
              <SelectItem value="employmentType">Employment Type</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={sortOrder}
            onValueChange={(value: "asc" | "desc") => {
              setSortOrder(value);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Order" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="asc">Ascending</SelectItem>
              <SelectItem value="desc">Descending</SelectItem>
            </SelectContent>
          </Select>
          <Button
            onClick={() => handleOpenFormModal()}
            className="flex items-center gap-1 text-white"
          >
            <UserPlus className="h-4 w-4" />
            <span className="hidden sm:inline">Add Teacher</span>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="p-4">
          <CardTitle>Faculty Members</CardTitle>
          <CardDescription>
            Manage teachers and their information
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : paginatedTeachers.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center p-4">
              <UserPlus className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No teachers found</h3>
              <p className="text-muted-foreground mt-2">
                {searchQuery
                  ? "Try adjusting your search query"
                  : "Add your first teacher to get started"}
              </p>
              <Button onClick={() => handleOpenFormModal()} className="mt-4 text-white">
                Add Teacher
              </Button>
            </div>
          ) : (
            <div className="overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead
                      className="cursor-pointer"
                      onClick={() => handleSort("name")}
                    >
                      Name
                      {sortField === "name" && (
                        <span className="ml-1">
                          {sortOrder === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </TableHead>
                    <TableHead
                      className="cursor-pointer"
                      onClick={() => handleSort("designation")}
                    >
                      Designation
                      {sortField === "designation" && (
                        <span className="ml-1">
                          {sortOrder === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </TableHead>
                    <TableHead>Subjects</TableHead>
                    <TableHead>Grades</TableHead>
                    <TableHead
                      className="cursor-pointer"
                      onClick={() => handleSort("joiningDate")}
                    >
                      Joining Date
                      {sortField === "joiningDate" && (
                        <span className="ml-1">
                          {sortOrder === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </TableHead>
                    <TableHead
                      className="cursor-pointer"
                      onClick={() => handleSort("employmentType")}
                    >
                      Employment
                      {sortField === "employmentType" && (
                        <span className="ml-1">
                          {sortOrder === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedTeachers.map((teacher) => (
                    <TableRow key={teacher._id}>
                      <TableCell>
                        <div className="font-medium">{teacher.userId.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {teacher.userId.email}
                        </div>
                      </TableCell>
                      <TableCell>{teacher.designation}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {teacher.subjects.map((subject, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="bg-blue-50 text-blue-700 border-blue-200"
                            >
                              {subject}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {teacher.grades.map((grade, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="bg-purple-50 text-purple-700 border-purple-200"
                            >
                              {grade}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>{formatDate(teacher.joiningDate)}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            teacher.employmentType === "full-time"
                              ? "bg-green-50 text-green-700 border-green-200"
                              : teacher.employmentType === "part-time"
                              ? "bg-amber-50 text-amber-700 border-amber-200"
                              : "bg-blue-50 text-blue-700 border-blue-200"
                          }
                        >
                          {teacher.employmentType.replace("-", " ")}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenFormModal(teacher)}
                            title="Edit"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenDeleteDialog(teacher)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {!isLoading && filteredTeachers.length > 0 && (
            <div className="flex items-center justify-center py-4">
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

      {isFormModalOpen && (
        <TeacherFormModal
          isOpen={isFormModalOpen}
          onClose={handleCloseFormModal}
          teacher={selectedTeacher}
          onSubmit={selectedTeacher ? handleUpdateTeacher : handleAddTeacher}
        />
      )}

      {isDeleteDialogOpen && selectedTeacher && (
        <DeleteTeacherDialog
          isOpen={isDeleteDialogOpen}
          onClose={handleCloseDeleteDialog}
          teacher={selectedTeacher}
          onDelete={handleDeleteTeacher}
        />
      )}
    </div>
  );
}
