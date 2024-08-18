// src/services/api.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

// const users = [
//     { id: 1, username: "tester1", password: "password123", role: "TESTER" },
//     { id: 2, username: "admin", password: "adminpassword", role: "ADMIN" },
//     { id: 3, username: "tester2", password: "password456", role: "TESTER" },
// ];

var projects = [  
    { id: 1, name: "Project Alpha", jiraTicketId: "JIRA-101", active: true },
    { id: 2, name: "Project Beta", jiraTicketId: "JIRA-102", active: true },
    // { id: 2, name: "Project Beta", jiraTicketId: "JIRA-102", active: true },
    // { id: 2, name: "Project Beta", jiraTicketId: "JIRA-102", active: true },
    // { id: 2, name: "Project Beta", jiraTicketId: "JIRA-102", active: true },
    // { id: 2, name: "Project Beta", jiraTicketId: "JIRA-102", active: true },
    // { id: 2, name: "Project Beta", jiraTicketId: "JIRA-102", active: true },
    // { id: 2, name: "Project Beta", jiraTicketId: "JIRA-102", active: true },
    // { id: 2, name: "Project Beta", jiraTicketId: "JIRA-102", active: true },
    // { id: 2, name: "Project Beta", jiraTicketId: "JIRA-102", active: true },
    // { id: 2, name: "Project Beta", jiraTicketId: "JIRA-102", active: true },
    // { id: 2, name: "Project Beta", jiraTicketId: "JIRA-102", active: true },
    // { id: 2, name: "Project Beta", jiraTicketId: "JIRA-102", active: true },
    // { id: 2, name: "Project Beta", jiraTicketId: "JIRA-102", active: true },
    // { id: 2, name: "Project Beta", jiraTicketId: "JIRA-102", active: true },
    // { id: 2, name: "Project Beta", jiraTicketId: "JIRA-102", active: true },
    // { id: 2, name: "Project Beta", jiraTicketId: "JIRA-102", active: true },
    // { id: 2, name: "Project Beta", jiraTicketId: "JIRA-102", active: true },
    // { id: 2, name: "Project Beta", jiraTicketId: "JIRA-102", active: true },
    // { id: 2, name: "Project Beta", jiraTicketId: "JIRA-102", active: true },
    // { id: 2, name: "Project Beta", jiraTicketId: "JIRA-102", active: true },
    // { id: 2, name: "Project Beta", jiraTicketId: "JIRA-102", active: true },

    // { id: 2, name: "Project Beta", jiraTicketId: "JIRA-102", active: true },
    // { id: 2, name: "Project Beta", jiraTicketId: "JIRA-102", active: true },
    // { id: 2, name: "Project Beta", jiraTicketId: "JIRA-102", active: true },
    // { id: 2, name: "Project Beta", jiraTicketId: "JIRA-102", active: true }
];

var testCases = [
    { id: 1, projectId: 1, testCaseId: "TC-01", testCaseName: "Login Test", type: "Sanity", description: "Test login functionality", inputData: "username, password", expectedResult: "Login successful", actualResult: "Login successful", status: "Pass", createdBy: "tester1" },
    { id: 2, projectId: 1, testCaseId: "TC-02", testCaseName: "Logout Test", type: "Sanity", description: "Test logout functionality", inputData: "click logout", expectedResult: "Logout successful", actualResult: "Logout successful", status: "Pass", createdBy: "tester1" },
    { id: 3, projectId: 1, testCaseId: "TC-02", testCaseName: "Project  Test", type: "Sanity", description: "Test logout functionality", inputData: "click logout", expectedResult: "Logout successful", actualResult: "Logout successful", status: "Pass", createdBy: "tester1" },
    { id: 4, projectId: 1, testCaseId: "TC-02", testCaseName: "Project list Test", type: "Sanity", description: "Test logout functionality", inputData: "click logout", expectedResult: "Logout successful", actualResult: "Logout successful", status: "Pass", createdBy: "tester1" },
    { id: 5, projectId: 1, testCaseId: "TC-02", testCaseName: "Testcase List Test", type: "Sanity", description: "Test logout functionality", inputData: "click logout", expectedResult: "Logout successful", actualResult: "Logout successful", status: "Pass", createdBy: "tester1" },
    { id: 6, projectId: 1, testCaseId: "TC-02", testCaseName: "Testcase search Test", type: "Sanity", description: "Test logout functionality", inputData: "click logout", expectedResult: "Logout successful", actualResult: "Logout successful", status: "Pass", createdBy: "tester1" },
    { id: 7, projectId: 1, testCaseId: "TC-02", testCaseName: "Project search Test", type: "Sanity", description: "Test logout functionality", inputData: "click logout", expectedResult: "Logout successful", actualResult: "Logout successful", status: "Pass", createdBy: "tester1" },
    { id: 8, projectId: 2, testCaseId: "TC-03", testCaseName: "Testcase filter Test", type: "Regression", description: "Test registration functionality", inputData: "user details", expectedResult: "Registration successful", actualResult: "Registration failed", status: "Fail", createdBy: "tester2" },
];

// Set up axios instance with base URL and token header
const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

// Auth API
export const login = async (credentials) => { 
    return await api.post('/login', credentials );
};
// export const login = (credentials) => users.find(user => user.username === credentials.username && user.password === credentials.password);

// Project API
export const getProjects = async () =>   api.get('/projects');
// export const getProjects = () => projects;

export const createProject = async (project) => api.post('/projects', project);
// export const createProject =  (newProject) => {
//     const project = { ...newProject, id: projects.length + 1 };
//     projects = [...projects, project]
//     return projects;
// };



// Test Case API
export const getTestCases = async (projectId) => api.get(`/testcases/${projectId}`);
// export const getTestCases = (projectId) => {
//     return testCases.filter(testCase => testCase.projectId == projectId );
// };

export const createTestCase = async (testCase) => api.post(`/testcases`, testCase);
// export const createTestCase = (newTestCase) => {
//     const testCase = { ...newTestCase, id: testCases.length + 1 };
//     testCases.push(testCase);
//     return testCases;
// };

export const updateTestCase = (testCaseId, testCase) => api.put(`/testcases/${testCaseId}`, testCase);
export const deleteTestCase = (testCaseId) => api.delete(`/testcases/${testCaseId}`);

export default api;
