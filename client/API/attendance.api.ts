import api from "./middleware";

export const markAttendance = async (formData: {
  attendanceRecords: { studentId: string; status: string; remarks?: string }[];
  section: string;
  grade: string;
}) => {
  try {
    const { data } = await api.post("/attendance/mark", formData);

    if (data.success) {
      return {
        success: true,
        response: data.data,
      };
    } else {
      return {
        success: false,
        response: data.message,
      };
    }
  } catch (error: any) {
    return {
      success: false,
      response: error.response.data.message || "something went wrong",
    };
  }
};

export const getAttendanceforParents = async () => {
  try {
    const { data } = await api.get("/attendance/for-parents");

    if (data.success) {
      return {
        success: true,
        response: data.data,
      };
    } else {
      return {
        success: false,
        response: data.message,
      };
    }
  } catch (error: any) {
    return {
      success: false,
      response: error.response.data.message || "something went wrong",
    };
  }
};
