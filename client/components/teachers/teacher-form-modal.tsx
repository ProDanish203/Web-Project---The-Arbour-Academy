"use client";

import type React from "react";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Plus } from "lucide-react";
import type { Teacher } from "@/types/types";
import {
  EMPLOYMENT_TYPES,
  AVAILABLE_GRADES,
  AVAILABLE_SECTIONS,
} from "@/lib/data";

interface TeacherFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  teacher?: Teacher | null;
  onSubmit: (teacher: Teacher) => void;
}

export function TeacherFormModal({
  isOpen,
  onClose,
  teacher,
  onSubmit,
}: TeacherFormModalProps) {
  const [formData, setFormData] = useState<Partial<Teacher>>({
    userId: {
      _id: "",
      name: "",
      email: "",
      phone: "",
      avatar: "",
    },
    designation: "",
    qualifications: [],
    subjects: [],
    grades: [],
    sections: [],
    joiningDate: new Date(),
    employmentType: "full-time",
    salary: 0,
  });
  const [newQualification, setNewQualification] = useState("");
  const [newSubject, setNewSubject] = useState("");
  const [newGrade, setNewGrade] = useState("");
  const [newSection, setNewSection] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (teacher) {
      setFormData({
        ...teacher,
        joiningDate: new Date(teacher.joiningDate),
      });
    }
  }, [teacher]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name.startsWith("userId.")) {
      const userField = name.split(".")[1];
      setFormData({
        ...formData,
        userId: {
          ...formData.userId!,
          [userField]: value,
        },
      });
    } else if (name === "salary") {
      setFormData({
        ...formData,
        [name]: Number.parseFloat(value) || 0,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      joiningDate: new Date(e.target.value),
    });
  };

  const handleEmploymentTypeChange = (value: string) => {
    setFormData({
      ...formData,
      employmentType: value,
    });
  };

  const addQualification = () => {
    if (newQualification.trim() === "") return;
    setFormData({
      ...formData,
      qualifications: [
        ...(formData.qualifications || []),
        newQualification.trim(),
      ],
    });
    setNewQualification("");
  };

  const removeQualification = (index: number) => {
    const updatedQualifications = [...(formData.qualifications || [])];
    updatedQualifications.splice(index, 1);
    setFormData({
      ...formData,
      qualifications: updatedQualifications,
    });
  };

  const addSubject = () => {
    if (newSubject.trim() === "") return;
    setFormData({
      ...formData,
      subjects: [...(formData.subjects || []), newSubject.trim()],
    });
    setNewSubject("");
  };

  const removeSubject = (index: number) => {
    const updatedSubjects = [...(formData.subjects || [])];
    updatedSubjects.splice(index, 1);
    setFormData({
      ...formData,
      subjects: updatedSubjects,
    });
  };

  const addGrade = () => {
    if (newGrade === "" || (formData.grades || []).includes(newGrade)) return;
    setFormData({
      ...formData,
      grades: [...(formData.grades || []), newGrade],
    });
    setNewGrade("");
  };

  const removeGrade = (grade: string) => {
    setFormData({
      ...formData,
      grades: (formData.grades || []).filter((g) => g !== grade),
    });
  };

  const addSection = () => {
    if (newSection === "" || (formData.sections || []).includes(newSection))
      return;
    setFormData({
      ...formData,
      sections: [...(formData.sections || []), newSection],
    });
    setNewSection("");
  };

  const removeSection = (section: string) => {
    setFormData({
      ...formData,
      sections: (formData.sections || []).filter((s) => s !== section),
    });
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.userId?.name) newErrors["userId.name"] = "Name is required";
    if (!formData.userId?.email)
      newErrors["userId.email"] = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.userId.email))
      newErrors["userId.email"] = "Invalid email format";

    if (!formData.designation)
      newErrors.designation = "Designation is required";
    if (!formData.qualifications?.length)
      newErrors.qualifications = "At least one qualification is required";
    if (!formData.subjects?.length)
      newErrors.subjects = "At least one subject is required";
    if (!formData.grades?.length)
      newErrors.grades = "At least one grade is required";
    if (!formData.sections?.length)
      newErrors.sections = "At least one section is required";
    if (!formData.employmentType)
      newErrors.employmentType = "Employment type is required";
    if (!formData.salary || formData.salary <= 0)
      newErrors.salary = "Valid salary is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);

    onSubmit(formData as Teacher);

    setIsSubmitting(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {teacher ? "Edit Teacher" : "Add New Teacher"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <Tabs defaultValue="personal" className="mt-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="personal">Personal Information</TabsTrigger>
              <TabsTrigger value="academic">Academic Details</TabsTrigger>
              <TabsTrigger value="employment">Employment Details</TabsTrigger>
            </TabsList>

            <TabsContent value="personal" className="space-y-4 mt-4">
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">
                        Full Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="name"
                        name="userId.name"
                        value={formData.userId?.name || ""}
                        onChange={handleInputChange}
                        placeholder="Enter full name"
                        className={
                          errors["userId.name"] ? "border-red-500" : ""
                        }
                      />
                      {errors["userId.name"] && (
                        <p className="text-sm text-red-500">
                          {errors["userId.name"]}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">
                        Email Address <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="email"
                        name="userId.email"
                        type="email"
                        value={formData.userId?.email || ""}
                        onChange={handleInputChange}
                        placeholder="Enter email address"
                        className={
                          errors["userId.email"] ? "border-red-500" : ""
                        }
                      />
                      {errors["userId.email"] && (
                        <p className="text-sm text-red-500">
                          {errors["userId.email"]}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        name="userId.phone"
                        value={formData.userId?.phone || ""}
                        onChange={handleInputChange}
                        placeholder="Enter phone number"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="designation">
                        Designation <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="designation"
                        name="designation"
                        value={formData.designation || ""}
                        onChange={handleInputChange}
                        placeholder="Enter designation"
                        className={errors.designation ? "border-red-500" : ""}
                      />
                      {errors.designation && (
                        <p className="text-sm text-red-500">
                          {errors.designation}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="academic" className="space-y-4 mt-4">
              <Card>
                <CardContent className="pt-6 space-y-6">
                  <div className="space-y-2">
                    <Label>
                      Qualifications <span className="text-red-500">*</span>
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        value={newQualification}
                        onChange={(e) => setNewQualification(e.target.value)}
                        placeholder="Add qualification (e.g., M.Sc. Mathematics)"
                        className={
                          errors.qualifications ? "border-red-500" : ""
                        }
                      />
                      <Button
                        type="button"
                        onClick={addQualification}
                        size="sm"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    {errors.qualifications && (
                      <p className="text-sm text-red-500">
                        {errors.qualifications}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.qualifications?.map((qualification, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="px-2 py-1 flex items-center gap-1"
                        >
                          {qualification}
                          <X
                            className="h-3 w-3 cursor-pointer"
                            onClick={() => removeQualification(index)}
                          />
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>
                      Subjects <span className="text-red-500">*</span>
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        value={newSubject}
                        onChange={(e) => setNewSubject(e.target.value)}
                        placeholder="Add subject (e.g., Mathematics)"
                        className={errors.subjects ? "border-red-500" : ""}
                      />
                      <Button type="button" onClick={addSubject} size="sm">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    {errors.subjects && (
                      <p className="text-sm text-red-500">{errors.subjects}</p>
                    )}
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.subjects?.map((subject, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="px-2 py-1 flex items-center gap-1 bg-blue-50 text-blue-700 border-blue-200"
                        >
                          {subject}
                          <X
                            className="h-3 w-3 cursor-pointer"
                            onClick={() => removeSubject(index)}
                          />
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>
                        Grades <span className="text-red-500">*</span>
                      </Label>
                      <div className="flex gap-2">
                        <Select value={newGrade} onValueChange={setNewGrade}>
                          <SelectTrigger
                            className={errors.grades ? "border-red-500" : ""}
                          >
                            <SelectValue placeholder="Select grade" />
                          </SelectTrigger>
                          <SelectContent>
                            {AVAILABLE_GRADES.filter(
                              (grade) =>
                                !(formData.grades || []).includes(grade)
                            ).map((grade) => (
                              <SelectItem key={grade} value={grade}>
                                {grade}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button
                          type="button"
                          onClick={addGrade}
                          size="sm"
                          disabled={!newGrade}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      {errors.grades && (
                        <p className="text-sm text-red-500">{errors.grades}</p>
                      )}
                      <div className="flex flex-wrap gap-2 mt-2">
                        {formData.grades?.map((grade) => (
                          <Badge
                            key={grade}
                            variant="secondary"
                            className="px-2 py-1 flex items-center gap-1 bg-purple-50 text-purple-700 border-purple-200"
                          >
                            {grade}
                            <X
                              className="h-3 w-3 cursor-pointer"
                              onClick={() => removeGrade(grade)}
                            />
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>
                        Sections <span className="text-red-500">*</span>
                      </Label>
                      <div className="flex gap-2">
                        <Select
                          value={newSection}
                          onValueChange={setNewSection}
                        >
                          <SelectTrigger
                            className={errors.sections ? "border-red-500" : ""}
                          >
                            <SelectValue placeholder="Select section" />
                          </SelectTrigger>
                          <SelectContent>
                            {AVAILABLE_SECTIONS.filter(
                              (section) =>
                                !(formData.sections || []).includes(section)
                            ).map((section) => (
                              <SelectItem key={section} value={section}>
                                Section {section}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button
                          type="button"
                          onClick={addSection}
                          size="sm"
                          disabled={!newSection}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      {errors.sections && (
                        <p className="text-sm text-red-500">
                          {errors.sections}
                        </p>
                      )}
                      <div className="flex flex-wrap gap-2 mt-2">
                        {formData.sections?.map((section) => (
                          <Badge
                            key={section}
                            variant="secondary"
                            className="px-2 py-1 flex items-center gap-1 bg-green-50 text-green-700 border-green-200"
                          >
                            Section {section}
                            <X
                              className="h-3 w-3 cursor-pointer"
                              onClick={() => removeSection(section)}
                            />
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="employment" className="space-y-4 mt-4">
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="joiningDate">
                        Joining Date <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="joiningDate"
                        name="joiningDate"
                        type="date"
                        value={
                          formData.joiningDate
                            ? new Date(formData.joiningDate)
                                .toISOString()
                                .split("T")[0]
                            : ""
                        }
                        onChange={handleDateChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="employmentType">
                        Employment Type <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={formData.employmentType || ""}
                        onValueChange={handleEmploymentTypeChange}
                      >
                        <SelectTrigger
                          className={
                            errors.employmentType ? "border-red-500" : ""
                          }
                        >
                          <SelectValue placeholder="Select employment type" />
                        </SelectTrigger>
                        <SelectContent>
                          {EMPLOYMENT_TYPES.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.employmentType && (
                        <p className="text-sm text-red-500">
                          {errors.employmentType}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="salary">
                        Salary <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="salary"
                        name="salary"
                        type="number"
                        value={formData.salary || ""}
                        onChange={handleInputChange}
                        placeholder="Enter salary amount"
                        className={errors.salary ? "border-red-500" : ""}
                      />
                      {errors.salary && (
                        <p className="text-sm text-red-500">{errors.salary}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0 mt-6">
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="text-white"
            >
              {isSubmitting ? (
                <>
                  <span className="animate-spin mr-2">⟳</span>
                  {teacher ? "Updating..." : "Creating..."}
                </>
              ) : teacher ? (
                "Update Teacher"
              ) : (
                "Add Teacher"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
