import api from "./middleware";

export const getStudentsbyGradeAndSection = async ({
  grade,
  section,
}: {
  grade: string;
  section: string;
}) => {
  try {
    const { data } = await api.get(
      `/student/by-grade-and-section?grade=${grade}&section=${section}`
    );

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
      response: error?.response?.data?.message || "Something went wrong",
    };
  }
};

export const getStudentsbyParentId = async () => {
  try {
    const { data } = await api.get(`/student/by-parent`);

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
      response: error?.response?.data?.message || "Something went wrong",
    };
  }
};
