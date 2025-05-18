import api from "./middleware";

export const submitApplicationRequest = async (formData: any) => {
  try {
    const { data } = await api.post("/admission/submit-application", formData);

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

export const getAdmissionRequests = async ({
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
      `/admission/applications?limit=${limit || 15}&page=${page || 1}&search=${
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
