// ========================== BASE CONFIG ==========================
const isLocalhost =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1";

const BASE_URL = isLocalhost
  ? "http://localhost:5000/api"
  : "https://erp-ten-pied.vercel.app/api";


// ========================== HEADERS ==========================
const getHeaders = (auth = false) => {
  const headers = {
    "Content-Type": "application/json",
  };

  if (auth) {
    const token = localStorage.getItem("token");

    console.log("TOKEN:", token); // DEBUG

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  return headers;
};


// ========================== GENERIC API ==========================
// 🔥 FIX: ADD export HERE
export const apiRequest = async (endpoint, method = "GET", body = null, auth = false) => {
  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method,
      headers: getHeaders(auth),
      body: body ? JSON.stringify(body) : null,
    });

    let data = {};
    try {
      data = await res.json();
    } catch {}

    if (res.status === 401) {
      localStorage.removeItem("token");
      alert("Session expired. Please login again.");
      window.location.href = "/pages/auth/login.html";
      throw new Error("Unauthorized");
    }

    if (!res.ok) {
      throw new Error(data.message || "API Error");
    }

    return data;

  } catch (err) {
    console.error("API ERROR:", err.message);
    throw err;
  }
};


// ========================== AUTH ==========================
export const registerUser = (data) =>
  apiRequest("/auth/register", "POST", data);

export const loginUser = (data) =>
  apiRequest("/auth/login", "POST", data);

export const getCurrentUser = () =>
  apiRequest("/auth/me", "GET", null, true);


// ========================== STUDENTS ==========================
export const getStudents = () =>
  apiRequest("/students", "GET", null, true);

export const addStudent = (data) =>
  apiRequest("/students", "POST", data, true);

export const deleteStudent = (id) =>
  apiRequest(`/students/${id}`, "DELETE", null, true);


// ========================== SUBJECTS ==========================
export const getSubjects = () =>
  apiRequest("/subjects", "GET", null, true);

export const addSubject = (data) =>
  apiRequest("/subjects", "POST", data, true);

export const deleteSubject = (id) =>
  apiRequest(`/subjects/${id}`, "DELETE", null, true);


// ========================== TEACHERS ==========================
export const getTeachers = () =>
  apiRequest("/teachers", "GET", null, true);

export const addTeacher = (data) =>
  apiRequest("/teachers", "POST", data, true);

export const deleteTeacher = (id) =>
  apiRequest(`/teachers/${id}`, "DELETE", null, true);


// ========================== MARKS ==========================
export const getMarks = (subject_id = "") =>
  apiRequest(`/marks${subject_id ? `?subject_id=${subject_id}` : ""}`, "GET", null, true);

export const addMarks = (data) =>
  apiRequest("/marks/add", "POST", data, true);


// ========================== RESULTS ==========================
export const getResults = (studentId) =>
  apiRequest(`/results/${studentId}`, "GET", null, true);

export const generateResults = (class_id) =>
  apiRequest("/results/generate-class", "POST", { class_id }, true);


// ========================== EXPORT ==========================
export default BASE_URL;