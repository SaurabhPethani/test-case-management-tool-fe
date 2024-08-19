// src/components/TestCaseList.js
import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Button, Container, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Paper, TextField, Typography } from '@mui/material';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { createTestCase, deleteTestCase, getTestCases, updateTestCase } from '../services/api';

const TestCaseList = () => {
    const [testCases, setTestCases] = useState([]);
    const [open, setOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const { projectId } = useParams();
    const [newTestCase, setNewTestCase] = useState({
        projectId: projectId,
        testCaseId: '',
        testCaseName: '',
        type: '',
        description: '',
        inputData: '',
        expectedResult: '',
        actualResult: '',
        status: ''
    });
    const [editingTestCase, setEditingTestCase] = useState(null);
    const [filteredTestCases, setFilteredTestCases] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterModel, setFilterModel] = useState({
        items: [],
    });

    useEffect(() => {
        const lowercasedQuery = searchQuery.toLowerCase();
        const filtered = testCases.filter(
          (testCase) =>
            testCase.testCaseName.toLowerCase().includes(lowercasedQuery) ||
            testCase.type.toLowerCase().includes(lowercasedQuery) ||
            testCase.status.toLowerCase().includes(lowercasedQuery) ||
            testCase.createdBy.toLowerCase().includes(lowercasedQuery)
        );
        setFilteredTestCases(filtered);
      }, [searchQuery, testCases]);

    useEffect(() => {
        async function fetchData() {
            try {
                console.log("Porject id ", projectId)
                const response = await getTestCases(projectId)
                if(response.data) {
                    setTestCases(response.data.data)
                }
            } catch(error) {
                alert("error occurred while fetching test case")
            }
            
        }
        fetchData()
    }, [projectId]);

    const handleCreateTestCase = () => {
        async function createTest() {
            try {
                const response = await createTestCase(newTestCase);
                if(response.data) {
                    setTestCases( [...testCases, response.data.data])
                    setOpen(false)
                    setNewTestCase({
                        projectId: projectId,
                        testCaseId: '',
                        testCaseName: '',
                        type: '',
                        description: '',
                        inputData: '',
                        expectedResult: '',
                        actualResult: '',
                        status: ''
                    })
                }
            } catch(error) {
                alert("error occurred while creating test case")
            }
            
        }
        if(newTestCase.actualResult && newTestCase.description
            && newTestCase.expectedResult && newTestCase.inputData
            && newTestCase.projectId && newTestCase.status
            && newTestCase.testCaseId && newTestCase.testCaseName
            && newTestCase.type) {
                createTest();
        } else {
            alert("please fill all the required fields");
        }
        
    };

    const handleEditTestCase = () => {

        async function editTest() {
            try {
                const response = await updateTestCase(editingTestCase.id, editingTestCase);
                console.log("Edit test ",response)
                if(response.data) {
                    const updatedTestCase = response.data.data;
                    setEditOpen(false)
                    alert('Test case updated successfully!');
                    const cases = testCases.map((testCase) =>
                        testCase.id === updatedTestCase.id ? { ...testCase, ...updatedTestCase } : testCase
                    );
                    console.log("cases ", cases)
                    setTestCases(cases)
                    
                }
            } catch(error) {
                alert("error occurred while editing test case")
            }
            
        }
        console.log("Editing case ", editingTestCase)
        if(editingTestCase.actualResult && editingTestCase.description
            && editingTestCase.expectedResult && editingTestCase.inputData
            && editingTestCase.status
            && editingTestCase.testCaseId && editingTestCase.testCaseName
            && editingTestCase.type) {
            editTest();
        } else {
            alert("Please fill all the required fields")
        }
    };

    const handleDeleteTestCase = (id) => {
        async function deleteCase() {
            try {
                const confirmDelete = window.confirm("Are you sure you want to delete this test case?");
                if (!confirmDelete) {
                    return; 
                }
                const response = await deleteTestCase(id);
                if(response.data) {
                    const cases = testCases.filter((testCase) => testCase.id !== id)
                    console.log("Edit test ",cases)
                    setTestCases(cases)
                }
            } catch(error) {
                alert("error occurred while deleting test case")
            }
            
        }
        deleteCase()
    };

    const handleRowClick = (params) => {
        setEditingTestCase(params.row);
        setEditOpen(true);
    };

    return (
        <Container>
            <Paper elevation={3} sx={{ padding: 4, mt: 4 }}>
                <Grid container>
                    <Grid item>
                        <Typography variant="h4" gutterBottom>
                            Test Cases
                        </Typography>
                    </Grid>
                    <Grid item xs>                                 
                        <Grid container direction="row-reverse"> 
                            <Grid item>
                                <TextField
                                    variant="outlined"
                                    size="small" 
                                    label="Search"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    sx={{ width: '300px'  }}
                                    style={{marginRight: 32}}
                                />
                                <Button variant="contained" color="primary" onClick={() => setOpen(true)}>Create New TestCase</Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
               
                <DataGrid
                    rows={ searchQuery.length == 0 ? testCases : filteredTestCases}
                    columns={[
                        { field: 'testCaseId', headerName: 'Test Case ID' },
                        { field: 'testCaseName', headerName: 'Test Case Name', width: 220 },
                        { field: 'type', headerName: 'Type' },
                        { field: 'description', headerName: 'Description', width: 170},
                        { field: 'inputData', headerName: 'Input Data', width: 200 },
                        { field: 'expectedResult', headerName: 'Expected Result', width: 200 },
                        { field: 'actualResult', headerName: 'Actual Result', width: 200 },
                        { field: 'status', headerName: 'Status', width: 100 },
                        { field: 'createdBy', headerName: 'TesterName', width: 100 },
                        {
                            field: 'actions',
                            headerName: 'Actions',
                            width: 400,
                            renderCell: (params) => (
                                <>
                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        onClick={() => handleRowClick(params)}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        color="secondary"
                                        onClick={() => handleDeleteTestCase(params.id)}
                                        style={{ marginLeft: 8 }}
                                    >
                                        Delete
                                    </Button>
                                </>
                            ),
                        },
                    ]}
                    pageSize={5}
                    autoHeight
                    pagination
                    rowsPerPageOptions={[5, 10, 20]} 
                    // pageSizeOptions={[5, 10, 25]}
                    filterModel={filterModel}
                    onFilterModelChange={(newFilterModel) => setFilterModel(newFilterModel)}
                    sortingOrder={['asc', 'desc']}
                />
            </Paper>
            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>Create New Test Case</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Test Case Id"
                        fullWidth
                        margin="normal"
                        required
                        placeholder='e.g. TC-1'
                        value={newTestCase.testCaseId}
                        onChange={(e) => setNewTestCase({ ...newTestCase, testCaseId: e.target.value })}
                    />
                    <TextField
                        label="Test Case Name"
                        required
                        fullWidth
                        margin="normal"
                        value={newTestCase.testCaseName}
                        onChange={(e) => setNewTestCase({ ...newTestCase, testCaseName: e.target.value })}
                    />
                    <TextField
                        required
                        label="Type"
                        fullWidth
                        margin="normal"
                        value={newTestCase.type}
                        onChange={(e) => setNewTestCase({ ...newTestCase, type: e.target.value })}
                    />
                    <TextField
                        label="Description"
                        fullWidth
                        required
                        margin="normal"
                        value={newTestCase.description}
                        onChange={(e) => setNewTestCase({ ...newTestCase, description: e.target.value })}
                    />
                    <TextField
                        label="Input Data"
                        fullWidth
                        required
                        margin="normal"
                        value={newTestCase.inputData}
                        onChange={(e) => setNewTestCase({ ...newTestCase, inputData: e.target.value })}
                    />
                    <TextField
                        label="Expected Result"
                        fullWidth
                        margin="normal"
                        required
                        value={newTestCase.expectedResult}
                        onChange={(e) => setNewTestCase({ ...newTestCase, expectedResult: e.target.value })}
                    />
                    <TextField
                        label="Actual Result"
                        fullWidth
                        margin="normal"
                        required
                        value={newTestCase.actualResult}
                        onChange={(e) => setNewTestCase({ ...newTestCase, actualResult: e.target.value })}
                    />
                    <TextField
                        label="Status"
                        fullWidth
                        required
                        margin="normal"
                        value={newTestCase.status}
                        onChange={(e) => setNewTestCase({ ...newTestCase, status: e.target.value })}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button onClick={handleCreateTestCase} color="primary">Create</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={editOpen} onClose={() => setEditOpen(false)}>
                <DialogTitle>Edit Test Case</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Test Case Id"
                        fullWidth
                        required
                        margin="normal"
                        placeholder='e.g. TC-1'
                        value={editingTestCase?.testCaseId}
                        onChange={(e) => setNewTestCase({ ...editingTestCase, testCaseId: e.target.value })}
                    />
                    <TextField
                        label="Test Case Name"
                        fullWidth
                        margin="normal"
                        required
                        value={editingTestCase?.testCaseName}
                        onChange={(e) => setEditingTestCase({ ...editingTestCase, testCaseName: e.target.value })}
                    />
                    <TextField
                        label="Type"
                        fullWidth
                        required
                        margin="normal"
                        value={editingTestCase?.type}
                        onChange={(e) => setEditingTestCase({ ...editingTestCase, type: e.target.value })}
                    />
                    <TextField
                        label="Description"
                        fullWidth
                        required
                        margin="normal"
                        value={editingTestCase?.description}
                        onChange={(e) => setEditingTestCase({ ...editingTestCase, description: e.target.value })}
                    />
                    <TextField
                        label="Input Data"
                        fullWidth
                        required
                        margin="normal"
                        value={editingTestCase?.inputData}
                        onChange={(e) => setEditingTestCase({ ...editingTestCase, inputData: e.target.value })}
                    />
                    <TextField
                        label="Expected Result"
                        required
                        fullWidth
                        margin="normal"
                        value={editingTestCase?.expectedResult}
                        onChange={(e) => setEditingTestCase({ ...editingTestCase, expectedResult: e.target.value })}
                    />
                    <TextField
                        label="Actual Result"
                        required
                        fullWidth
                        margin="normal"
                        value={editingTestCase?.actualResult}
                        onChange={(e) => setEditingTestCase({ ...editingTestCase, actualResult: e.target.value })}
                    />
                    <TextField
                        label="Status"
                        required
                        fullWidth
                        margin="normal"
                        value={editingTestCase?.status}
                        onChange={(e) => setEditingTestCase({ ...editingTestCase, status: e.target.value })}
                    />
                    <TextField
                        label="Assigned To"
                        required
                        fullWidth
                        margin="normal"
                        value={editingTestCase?.createdBy}
                        onChange={(e) => setEditingTestCase({ ...editingTestCase, createdBy: e.target.value })}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditOpen(false)}>Cancel</Button>
                    <Button onClick={handleEditTestCase} color="primary">Update</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default TestCaseList;
