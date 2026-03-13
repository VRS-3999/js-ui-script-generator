import axios from "axios";

const API_BASE_URL = "http://localhost:8045/api";

export const generateDagScript = async (payload: any) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/generate_script`,
      payload,
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

    return response.data;
  } catch (error: any) {
    console.error("Error generating DAG script:", error);

    throw error.response?.data || {
      message: "Failed to generate DAG script"
    };
  }
};

export const generateCronScheduleSyntax = async (payload: any) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/cron-job-schedule-syntax`,
      payload,
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

    return response.data;
  } catch (error: any) {
    console.error("Error generating Cron Schedule Syntax script:", error);
    throw error.response?.data || {
      message: "Failed to generate Cron Schedule Syntax script"
    };
  }
};


export const getManagerDefaults = async (managerName: string) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/manager-defaults/${managerName}`,
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

    return response.data;
  } catch (error: any) {
    console.error("Error fetching manager defaults:", error);

    throw error.response?.data || {
      message: "Failed to fetch manager defaults"
    };
  }
};

export const getManagers = async () => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/managers`,
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

    return response.data;
  } catch (error: any) {
    console.error("Error fetching managers:", error);

    throw error.response?.data || {
      message: "Failed to fetch managers"
    };
  }
};