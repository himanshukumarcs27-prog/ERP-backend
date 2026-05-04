// ========================== BASE CONFIG ==========================
const BASE_URL = "https://erp-backend-49ee.onrender.com/api";


// ========================== HEADERS ==========================
const getHeaders = (auth = false) => {
  const headers = {
    "Content-Type": "application/json",
  };

  if (auth) {
    const token = localStorage.getItem("token");

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  return headers;
};


// ========================== GENERIC API ==========================
export const apiRequest = async (
  endpoint,
  method = "GET",
  body = null,
  auth = false
) => {
  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method,
      headers: getHeaders(auth),
      body: body ? JSON.stringify(body) : null,
    });

    let data = {};

    try {
      data = await res.json();
    } catch {
      data = {};
    }

    // 🔐 Handle Unauthorized
    if (res.status === 401) {
      localStorage.removeItem("token");
      alert("Session expired. Please login again.");

      // Redirect safely
      window.location.href = "/pages/auth/login.html";
      throw new Error("Unauthorized");
    }

    // ❌ Handle other errors
    if (!res.ok) {
      throw new Error(data.message || "Something went wrong");
    }

    return data;

  } catch (err) {
    console.error("API ERROR:", err.message);

    // 🌐 Network issue handling
    if (!navigator.onLine) {
      alert("No internet connection");
    } else {
      alert(err.message);
    }

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
  apiRequest(
    `/marks${subject_id ? `?subject_id=${subject_id}` : ""}`,
    "GET",
    null,
    true
  );

export const addMarks = (data) =>
  apiRequest("/marks/add", "POST", data, true);


// ========================== RESULTS ==========================
export const getResults = (studentId) =>
  apiRequest(`/results/${studentId}`, "GET", null, true);

export const generateResults = (class_id) =>
  apiRequest("/results/generate-class", "POST", { class_id }, true);


// ========================== EXPORT ==========================
export default BASE_URL;