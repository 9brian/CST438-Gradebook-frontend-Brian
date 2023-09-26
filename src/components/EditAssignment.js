import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import {SERVER_URL} from '../constants';

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';


function EditAssignment(props) {
    const [open, setOpen] = useState(false);
    const [assignment, setAssignment] = useState([]);
    let assignmentObj=props;
    let assignmentId = assignmentObj.id;
    console.log(assignmentId);
    const [message, setMessage] = useState('');

    const handleOpen = () => {
      setOpen(true);
      console.log(assignmentId);
    }


    const handleClose = () => {
      setOpen(false);
    }

    const fetchAssignment = ( ) => {
      setMessage('');
      console.log("fetchAssignment "+assignmentId);
      fetch(`${SERVER_URL}/assignment/${assignmentId}`)
      .then((response) => response.json()) 
      .then((data) => { setAssignment(data) })        
      .catch(err => { 
        setMessage("Exception. "+err);
        console.error("fetch assignment error "+ err);
      });
    }

    useEffect(() => {
      fetchAssignment()
      }, [] )
    
    const saveAssignment = ( ) => {
      setMessage(''); 
      console.log("Assignment.save ");
      // console.log(`${assignmentId}` + " save");
      // console.log(assignment);
      
      fetch(`${SERVER_URL}/assignment/update/${assignmentId}` , 
        {  
            method: 'PUT', 
            headers: { 'Content-Type': 'application/json', }, 
            body: JSON.stringify( assignment )
        } )
      .then(res => {
        
        if (res.ok) {
            fetchAssignment(assignmentId);
            setMessage("Assignments saved.");
            handleClose();
            window.location.reload();
         } else {
            setMessage("Save error. "+res.status);
            console.error('Save assignment error =' + res.status);
      }})
      .catch(err => {
          setMessage("Exception. "+err);
          console.error('Save assignment exception =' + err);
      });
      
      }; 

    const onChangeInput = (e, idx) => {
      setMessage('');
      console.log(e,idx);

        if(idx === 1){
          const updatedAssignment = { ...assignment };
    
          updatedAssignment.assignmentName = e.target.value;
          console.log(updatedAssignment);

          setAssignment(updatedAssignment);
        } else if(idx === 2){
          
          // got regex for date format here 
          // https://www.freecodecamp.org/news/regex-for-date-formats-what-is-the-regular-expression-for-matching-dates/
          // https://stackoverflow.com/questions/42516815/regex-date-mm-dd-yyyy-formatting-javascript
          // how to put it in js
          // (19|20)\d{2}(-)(0[1-9]|1[1,2])(-)(0[1-9]|[12][0-9]|3[01])

          var pattern = /(19|20)\d{2}(-)(0[1-9]|1[1,2])(-)(0[1-9]|[12][0-9]|3[01])/
          const updatedAssignment = { ...assignment };
          updatedAssignment.dueDate = e.target.value;
          setAssignment(updatedAssignment);
          
          if(pattern.test(e.target.value)){
            console.log(updatedAssignment);
          } else {
            setMessage("Date needs the correct format!");
          }
        }
      console.log(e.target.value);
    }

    const headers = ['Name', 'Due Date'];  

    return(
        <div> 
          <Button onClick={handleOpen}>Edit</Button>
          <Dialog open={open}> 
          <DialogContent>
            <DialogTitle>Edit Assignment</DialogTitle>  
            <p>{message}</p>      
            <table id="Center" > 
                <thead>
                  <tr>
                      {headers.map((s, idx) => (<th key={idx}>{s}</th>))}
                  </tr>
                </thead>
                <tbody>
                  <td>
                    <TextField
                    name="grade"
                    value={(assignment.assignmentName)? assignment.assignmentName : ""}  
                    type="text"
                    onChange={(e) => onChangeInput(e,1)}
                  />
                  </td>
                  <td>
                    <TextField
                    name="grade"
                    value={(assignment.dueDate)? assignment.dueDate : ""}  
                    type="text"
                    onChange={(e) => onChangeInput(e, 2)}
                    />
                  </td>
                </tbody>
            </table>
            <Button id="sedit" type="button" margin="auto" onClick={saveAssignment}>Save Assignment</Button>
            <DialogActions>
                <Button onClick={handleClose}>Close</Button>
            </DialogActions>
            </DialogContent>
            </Dialog>
        </div>
    );
}
export default EditAssignment;