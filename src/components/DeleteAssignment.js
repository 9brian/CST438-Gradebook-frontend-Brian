import React, {useState, useEffect}  from 'react';
import {SERVER_URL} from '../constants';
import { useHistory } from "react-router-dom";

function DeleteAssignment(props) { 
    const [assignment, setAssignment] = useState([]);
    const [forcer, setForcer] = useState('');
    let assignmentId=0;
    const [message, setMessage] = useState('');
  
    const path = window.location.pathname;  // /gradebook/123
    const s = /\d+$/.exec(path)[0];
    console.log("AssignmentID="+s);
    assignmentId=s;

    // how to redirect after a button click
    // https://stackoverflow.com/questions/50644976/react-button-onclick-redirect-page
    const history = useHistory();
  
    useEffect(() => {
        fetchAssignment()
     }, [] )
  
   
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
    
      // when submit button pressed, send updated grades to back end 
      //  and then fetch the new grades.
      const saveAssignment = ( ) => {
        setMessage(''); 
        console.log("Assignment.save ");

        fetch(`${SERVER_URL}/assignment/delete/${assignmentId}` , 
        {  
            method: 'DELETE', 
            headers: { 'Content-Type': 'application/json', }
        } )
        .then(res => {
            if (res.ok) {
            fetchAssignment(assignmentId);
            setMessage("Assignments deleted.");
            history.push(`/`);
        } else {

            if(res.status === 400){
                setMessage("Grades exist for this assignment. Error. "+res.status);
                if(window.confirm("Grades exist for this assignment. Do you want to force delete?")){
                  fetch(`${SERVER_URL}/assignment/delete/${assignmentId}?force=true` , 
                  {  
                    method: 'DELETE', 
                    headers: { 'Content-Type': 'application/json', }
                  } )
                  .then(res => {
                  if (res.ok) {
                    fetchAssignment(assignmentId);
                    setMessage("Assignments deleted.");
                    history.push(`/`);
                  } else {
                    setMessage("Delete error. "+res.status);
                    console.error('Delete assignment error =' + res.status);
                  }})
                  .catch(err => {
                    setMessage("Exception. "+err);
                    console.error('Delete assignment exception =' + err);
                  });
                }
            } else {
                setMessage("Delete error. "+res.status);
            }

            console.error('Delete assignment error =' + res.status);
        }})
        .catch(err => {
            setMessage("Exception. "+err);
            console.error('Delete assignment exception =' + err);
        });
     };        
      
  
      const onChangeInput = (e, idx) => {
        setMessage('');
      }
   
      const headers = ['Name', 'Due Date'];
  
      return (
        <div>
          <h3>Assignment Grades</h3>
          <div margin="auto" >
            <h4 id="gmessage" >{message}&nbsp;</h4>
            <table className="Center"> 
              <thead>
                <tr>
                  {headers.map((title, idx) => (<th key={idx}>{title}</th>))}
                </tr>
              </thead>
              <tbody>
  
                <td>
                  <input
                    name="grade"
                    value={(assignment.assignmentName)? assignment.assignmentName : ""}  
                    type="text"
                  />
                </td>
                <td>
                  <input
                    name="grade"
                    value={(assignment.dueDate)? assignment.dueDate : ""}  
                    type="text"
                  />
                </td>
                <td>
                </td>
              </tbody>
            </table>
            <button id="sedit" type="button" margin="auto" onClick={saveAssignment}>Delete Assignment</button>
          </div>
        </div>
      )
}

export default DeleteAssignment;