import React, {useState, useEffect}  from 'react';
import {SERVER_URL} from '../constants';
import { useHistory } from "react-router-dom";


function EditAssignment(props) { 

  const [assignment, setAssignment] = useState([]);
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

      console.log(`${assignmentId}`);

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
            history.push(`/`);
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

          // var pattern = /(19|20)\d{2}(-)(0[1-9]|1[1,2])(-)(0[1-9]|[12][0-9]|3[01])/
          const updatedAssignment = { ...assignment };
          updatedAssignment.dueDate = e.target.value;
          console.log(updatedAssignment);

          setAssignment(updatedAssignment);
          
          // if(pattern.test(e.target.value)){
            
            
          // } else {
          //   setMessage("Date needs the correct format!");
          // }
        } else if(idx === 3){
          const updatedAssignment = { ...assignment };
    
          updatedAssignment.courseTitle = e.target.value;
          console.log(updatedAssignment);

          setAssignment(updatedAssignment);
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
 
    const headers = ['Name', 'Due Date', 'Course Title', 'Course ID'];

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
                  onChange={(e) => onChangeInput(e,1)}
                />
              </td>
              <td>
                <input
                  name="grade"
                  value={(assignment.dueDate)? assignment.dueDate : ""}  
                  type="text"
                  onChange={(e) => onChangeInput(e, 2)}
                />
              </td>
              <td>
                <input
                  name="grade"
                  value={(assignment.courseTitle)? assignment.courseTitle : ""}  
                  type="text"
                  onChange={(e) => onChangeInput(e, 3)}
                />
              </td>
              <td>
                <input
                  name="grade"
                  value={(assignment.courseId)? assignment.courseId : ""}  
                  type="text"
                  onChange={(e) => onChangeInput(e, 4)}
                />
              </td>
            </tbody>
          </table>
          <button id="sedit" type="button" margin="auto" onClick={saveAssignment}>Save Assignment</button>
        </div>
      </div>
    )
}

export default EditAssignment;