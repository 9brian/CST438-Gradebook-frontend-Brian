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

    // how to redirect after a button clikc
    // https://stackoverflow.com/questions/50644976/react-button-onclick-redirect-page
    const history = useHistory();
  
    useEffect(() => {
      fetchGrades()
     }, [] )
  
   
    const fetchGrades = ( ) => {
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
  
        // console.log(`${assignmentId}`);
        // console.log(assignment);
        // console.log(assignment.id);
        // console.log(assignment.assignmentName);
        // console.log(assignment.dueDate);
        // console.log(assignment.courseTitle);
        // console.log(assignment.courseId);

        
        if (forcer === 'y'){
            fetch(`${SERVER_URL}/assignment/delete/${assignmentId}?force=true` , 
            {  
              method: 'DELETE', 
              headers: { 'Content-Type': 'application/json', }
            } )
            .then(res => {
            if (res.ok) {
              fetchGrades(assignmentId);
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
            console.log("here");
        } else {
            fetch(`${SERVER_URL}/assignment/delete/${assignmentId}` , 
            {  
              method: 'DELETE', 
              headers: { 'Content-Type': 'application/json', }, 
              body: JSON.stringify( assignment )
            } )
            .then(res => {
            if (res.ok) {
              fetchGrades(assignmentId);
              setMessage("Assignments deleted.");
            } else {
              setMessage("Delete error. "+res.status);
              console.error('Delete assignment error =' + res.status);
            }})
            .catch(err => {
              setMessage("Exception. "+err);
              console.error('Delete assignment exception =' + err);
            });
        }
  
        
     };        
      
  
      const onChangeInput = (e, idx) => {
        setMessage('');
  
          if(idx === 1){
            // https://stackoverflow.com/questions/47545450/regex-match-any-single-character-one-character-only
            // how to get just n or just y

            if(/^[ny]$/.test(e.target.value)){
                console.log("hello");
                
            } else {
                setMessage("Force accepts only n or y!");
            }
            setForcer(e.target.value);
         } 
        
      }
   
      const headers = ['Name', 'Due Date', 'Course Title', 'Course ID', 'force?'];
  
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
                    // onChange={(e) => onChangeInput(e,1)}
                  />
                </td>
                <td>
                  <input
                    name="grade"
                    value={(assignment.dueDate)? assignment.dueDate : ""}  
                    type="text"
                    // onChange={(e) => onChangeInput(e, 2)}
                  />
                </td>
                <td>
                  <input
                    name="grade"
                    value={(assignment.courseTitle)? assignment.courseTitle : ""}  
                    type="text"
                    // onChange={(e) => onChangeInput(e, 3)}
                  />
                </td>
                <td>
                  <input
                    name="grade"
                    value={(assignment.courseId)? assignment.courseId : ""}  
                    type="text"
                    // onChange={(e) => onChangeInput(e, 4)}
                  />
                </td>
                <td>
                  <input
                    name="force"
                    value={(forcer)}  
                    type="text"
                    onChange={(e) => onChangeInput(e, 1)}
                  />
                </td>
              </tbody>
            </table>
            <button id="sedit" type="button" margin="auto" onClick={saveAssignment}>Save Assignment</button>
          </div>
        </div>
      )
}

export default DeleteAssignment;