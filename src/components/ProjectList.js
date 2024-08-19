// src/components/ProjectList.js
import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Button, Container, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Paper, TextField, Typography } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { createProject, getProjects } from '../services/api';

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [open, setOpen] = useState(false);
  const [newProject, setNewProject] = useState({id:0, name: '', jiraTicketId: '' });
  const [filterModel, setFilterModel] = useState({
    items: [],
  });
  const navigate = useNavigate();

  useEffect( () => {
    async function fetchData() {
        try {
            const response = await getProjects()
            console.log(" Projects ", response)
            if(response.data) {
                setProjects(response.data.data)
            } else {
                // handle failure
                alert("error occurred while fetching projects")
            }
        } catch(error) {
            alert("error occurred while fetching projects")
        }
        
    }
    fetchData();
    
  }, []);

  const handleCreateProject = () => {
    async function makeProject() {
        try {
            const response = await createProject(newProject)
            console.log(" Projects ", response)
            if(response.data) {
                setProjects([...projects, response.data.data ] )
                setOpen(false)
                setNewProject({id:0, name: '', jiraTicketId: '' })
            } else {
                // handle failure
            }
        } catch(error) {
            alert("error occurred while creating project")
        }
        
    }

    if(newProject.name && newProject.jiraTicketId) {
        makeProject()
    } else {
        alert("please fill all the fields")
    }
  };

  const handleRowClick = (params) => {
    navigate(`/projects/${params.row.id}/testcases`);
  };

  return (
    <Container>
      <Paper elevation={3} sx={{ padding: 4, mt: 4 }}>
        <Grid container>
            <Grid item>
                <Typography variant="h4" gutterBottom>
                    Projects
                </Typography>
            </Grid>
            <Grid item xs>                                 
                <Grid container direction="row-reverse"> 
                    <Grid item>
                        <Button variant="contained" color="primary" onClick={() => setOpen(true)}>Create New Project</Button>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
        {/* <Box sx={{ height: 500, mt: 2 }}> */}
            <DataGrid
                rows={projects}
                columns={[
                { field: 'id', headerName: 'ID', width: 150 },
                { field: 'name', headerName: 'Project Name', width: 300 },
                { field: 'jiraTicketId', headerName: 'JIRA ID', width: 200 },
                {
                    field: 'actions',
                    headerName: 'Actions',
                    width: 250,
                    renderCell: (params) => (
                    <Button
                        variant="contained"
                        color="primary"
                    >
                        View Test Cases
                    </Button>
                    ),
                },
                ]}
                pageSize={5}
                pagination={{ paginationModel: { pageSize: 5 } }}
                rowsPerPageOptions={[5, 10, 20]} 
                // pageSizeOptions={[5, 10, 25]}
                onRowClick={handleRowClick}
                filterModel={filterModel}
                onFilterModelChange={(newFilterModel) => setFilterModel(newFilterModel)}
                autoHeight
                sortingOrder={['asc', 'desc']}
            />
        {/* </Box> */}
      </Paper>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Create New Project</DialogTitle>
        <DialogContent>
          <TextField label="Project Name" 
            required fullWidth 
            margin="normal" 
            value={newProject.name} 
            onChange={(e) => setNewProject({ ...newProject, name: e.target.value })} />
          <TextField label="JIRA ID" required fullWidth margin="normal" value={newProject.jiraTicketId} onChange={(e) => setNewProject({ ...newProject, jiraTicketId: e.target.value })} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleCreateProject} color="primary">Create</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ProjectList;
