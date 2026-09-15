import { api } from "../api/api";


export const bookList = async (params = {}) => {

    const response = await api.get("books/", { params });

    return response.data;
};



export const bookDetails = async (bookId) => {

    const response = await api.get(`books/${bookId}/`);

    return response.data;
};


export const bookUpdate = async (id, data) => {

    const response = await api.put(
        `books/${id}/update/`,
        data
    );

    return response.data;
};


export const addBookImages = async (id, images) => {

    const accessToken =
        localStorage.getItem("access_token") ||
        sessionStorage.getItem("access_token");

    const formData = new FormData();

    images.forEach((image) => {
        formData.append("images", image);
    });

    const response = await api.post(
        `books/${id}/images/`,
        formData,
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "multipart/form-data"
            }
        }
    );

    return response.data;
};


export const deleteBookImage = async (imageId) => {

    const accessToken =
        localStorage.getItem("access_token") ||
        sessionStorage.getItem("access_token");

    const response = await api.delete(
        `books/images/${imageId}/delete/`,
        {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }
    );

    return response.data;
};


export const addBookNotes = async (id, notes) => {

    const accessToken =
        localStorage.getItem("access_token") ||
        sessionStorage.getItem("access_token");

    const formData = new FormData();

    formData.append("book_notes", notes);

    const response = await api.post(
        `books/${id}/notes/`,
        formData,
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "multipart/form-data"
            }
        }
    );

    return response.data;
};


export const deleteBookNotes = async (id) => {

    const accessToken =
        localStorage.getItem("access_token") ||
        sessionStorage.getItem("access_token");

    const response = await api.delete(
        `books/${id}/notes/delete/`,
        {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }
    );

    return response.data;
};


export const bookAdd = async (formData) => {

    const accessToken =
        localStorage.getItem("access_token") ||
        sessionStorage.getItem("access_token");

    const response = await api.post(
        "books/add/",
        formData,
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "multipart/form-data"
            }
        }
    );

    return response.data;
};


export const bookDelete = async (id) => {

    const accessToken =
        localStorage.getItem("access_token") ||
        sessionStorage.getItem("access_token");

    const response = await api.delete(
        `books/${id}/delete/`,
        {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }
    );

    return response.data;
};