import axiosInstance from "./axiosConfig";

export const supportApi = {
  // Support Tickets
  getTickets: async (params = {}) => {
    const response = await axiosInstance.get("/supporttickets", { params });
    return response.data;
  },

  getTicketById: async (id) => {
    const response = await axiosInstance.get(`/supporttickets/${id}`);
    return response.data;
  },

  createTicket: async (data) => {
    const response = await axiosInstance.post("/supporttickets", data);
    return response.data;
  },

  deleteTicket: async (id) => {
    const response = await axiosInstance.delete(`/supporttickets/${id}`);
    return response.data;
  },

  updateTicketStatus: async (id, status) => {
    const response = await axiosInstance.patch(
      `/supporttickets/${id}/status`,
      { id, status }
    );
    return response.data;
  },

  // Support Ticket Messages
  getMessages: async (params = {}) => {
    const response = await axiosInstance.get("/supportticketmessages", {
      params,
    });
    return response.data;
  },

  getMessageById: async (id) => {
    const response = await axiosInstance.get(`/supportticketmessages/${id}`);
    return response.data;
  },

  createMessage: async (data) => {
    const response = await axiosInstance.post("/supportticketmessages", data);
    return response.data;
  },

  updateMessage: async (id, message) => {
    const response = await axiosInstance.put(`/supportticketmessages/${id}`, {
      id,
      message,
    });
    return response.data;
  },

  deleteMessage: async (id) => {
    const response = await axiosInstance.delete(
      `/supportticketmessages/${id}`
    );
    return response.data;
  },
};
