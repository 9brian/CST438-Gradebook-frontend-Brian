import React, { useState, useEffect } from 'react';
import {SERVER_URL} from '../constants';
import { useHistory } from "react-router-dom";

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';

import PropTypes from 'prop-types';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';


function AddAssignment(props) {
  const [open, setOpen] = useState(false);
  const [assignment, setAssignment] = useState([]);
  let assignmentObj=props;
  let assignmentId = assignmentObj.id;
  const [message, setMessage] = useState('');

  const handleOpen = () => {
    setOpen(true);
  }


  const handleClose = () => {
    setOpen(false);
  }

  useEffect(() => {
    fetchAssignment()
   }, [] )

 
  const fetchAssignment = ( ) => {
      setMessage('');
      console.log("fetchAssignment "+assignmentId);
      fetch(`${SERVER_URL}/assignment`)
      .then((response) => response.json()) 
      .then((data) => { setAssignment(data) })        
      .catch(err => { 
        setMessage("Exception. "+err);
        console.error("fetch assignment error "+ err);
      });
    }
  
    // when submit button pressed, send updated grades to back end 
    //  and then fetch the new grades.
    const saveAssignment = ( ) => {
      setMessage(''); 
      console.log("Assignment.save ");
      assignment.id = 0;

      fetch(`${SERVER_URL}/assignment/new` , 
          {  
            method: 'POST', 
            headers: { 'Content-Type': 'application/json', }, 
            body: JSON.stringify( assignment )
          } )
      .then(res => {
        if (res.ok) {
            fetchAssignment(assignmentId);
            setMessage("Assignments saved.");
            handleClose();
            window.location.reload();
            // history.push(`/`);
        } else {
            
            if(res.status === 500){
              setMessage("Save error. "+res.status + ". Insufficient data.");
            } else {
              setMessage("Save error. "+res.status);
            }
            console.error('Save assignment error =' + res.status);
      }})
      .catch(err => {
            setMessage("Exception. "+err);
            console.error('Save assignment exception =' + err);
      });
    
      
   };        
    

    const onChangeInput = (e, idx) => {
      setMessage('');

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
        } else if(idx === 4){
          if (/^\d*$/.test(e.target.value)){
            const updatedAssignment = { ...assignment };
    
            updatedAssignment.courseId = e.target.value;
            console.log(updatedAssignment);

            setAssignment(updatedAssignment);
          } else {
            setMessage("Course ID are digits only!");
          }
        }
      console.log(e.target.value);
    }
 
    const headers = ['Name', 'Due Date', 'Course ID'];

    return (
      <div> 
          <Button onClick={handleOpen}>Add assignment</Button>
          <Dialog open={open}> 
          <DialogContent>
            <DialogTitle>Add Assignment</DialogTitle>  
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
                      value={(assignment.dueDate)? assignment.dueDate : "YYYY-MM-DD"}  
                      type="text"
                      onChange={(e) => onChangeInput(e, 2)}
                    />
                  </td>
                  <td>
                    <TextField
                      name="grade"
                      value={(assignment.courseId)? assignment.courseId : ""}  
                      type="text"
                      onChange={(e) => onChangeInput(e, 4)}
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

export default AddAssignment;