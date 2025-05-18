import api from "./middleware";

export const getAllTeachers = async ({
  page,
  limit,
  search,
  filter,
}: {
  limit: number;
  page: number;
  filter: string;
  search: string;
}) => {
  try {
    const { data } = await api.get(
      `/teachers?limit=${limit || 15}&page=${page || 1}&search=${
        search || ""
      }&filter=${filter || ""}`
    );

    if (data.success) {
      return {
        success: true,
        response: data,
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

export const addTeacher = async (formData: any) => {
  try {
    const { data } = await api.post("/teachers", formData);

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

export const updateTeacher = async ({
  id,
  formData,
}: {
  id: string;
  formData: any;
}) => {
  try {
    const { data } = await api.patch(`/teachers/${id}`, formData);

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

export const removeTeacher = async (id: string) => {
  try {
    const { data } = await api.delete(`/teachers/${id}`);

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
