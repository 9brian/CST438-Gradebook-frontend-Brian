import React, {useState, useEffect} from 'react';
import {SERVER_URL} from '../constants';
import {Link} from 'react-router-dom';
import { Button } from '@mui/base';
import EditAssignment from './EditAssignment';
import AddAssignment from './AddAssignment';


function ListAssignment(props) {

  const [assignments, setAssignments] = useState([]);
  const [message, setMessage] = useState('');
 
  useEffect(() => {
   // called once after intial render
   fetchAssignments();
  }, [] )
 
  const fetchAssignments = () => {
    console.log("fetchAssignments");
    fetch(`${SERVER_URL}/assignment`)
    .then((response) => response.json() ) 
    .then((data) => { 
      console.log("assignment length "+data.length);
      setAssignments(data);
     }) 
    .catch(err => console.error(err)); 
  }

   /*
  *  update student
  */ 
   const assignmentEdit = (idx) => {
    // setMessage('here');
    console.log(idx);

    // fetch(`${SERVER_URL}/students/update?email=${email}&statusCode=${code}&statusMsg=${status}`, {
    //     method: 'PUT',
    // })
    //     .then((response) => {
    //         if (response.ok) {
    //             console.log("Student updated successfully");
    //             setMessage("Student updated successfully.");
    //             fetchAssignments();
    //         } else {
    //             console.log("Status update error");
    //             setMessage("Error updating status: " + response.statusText);
    //         }
    //     })
    //     .catch((error) => {
    //         console.error("Exception updating status:", error);
    //         setMessage("Exception updating status: " + error);
    //     });
  }

  const deleteAssignment = (assignmentId) => {
    console.log(assignmentId);
    
    // Initial delete (should fail UNLESS grades do not exist)
    fetch(`${SERVER_URL}/assignment/delete/${assignmentId}` , 
    {  
      method: 'DELETE', 
      headers: { 'Content-Type': 'application/json', }
    } )
    .then(res => {
      if (res.ok) { // This should ONLY pass when grades do NOT exist
        // fetchAssignment(assignmentId);
        setMessage("Assignments deleted.");
        window.location.reload();
        // history.push(`/`);
      } else { // when grades DO exist

        if(res.status === 400){ // This should fail because grades do exist

            // set window popup, for force = true
            if(window.confirm("Grades exist for this assignment. Do you want to force delete?")){
              // force delete
                fetch(`${SERVER_URL}/assignment/delete/${assignmentId}?force=true` , 
                {  
                  method: 'DELETE', 
                  headers: { 'Content-Type': 'application/json', }
                } )
                .then(res => {
                  if (res.ok) {
                    setMessage("Assignments deleted.");
                    window.location.reload(); // reload after deletion
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
    }}).catch(err => {
      setMessage("Exception. "+err);
      console.error('Delete assignment exception =' + err);
    });
  }
  
  
    const headers = ['Assignment Name', 'Course Title', 'Due Date', ' ', ' ', ' '];
    
    return (
      <div>
        <h3>Assignments</h3>
        <div margin="auto" >
          <h4>{message}&nbsp;</h4>
              <table className="Center"> 
                <thead>
                  <tr>
                    {headers.map((title, idx) => (<th key={idx}>{title}</th>))}
                  </tr>
                </thead>
                <tbody>
                  {assignments.map((row, idx) => (
                    <tr key={idx}>
                      <td>{row.assignmentName}</td>
                      <td>{row.courseTitle}</td>
                      <td>{row.dueDate}</td>
                      <td>
                        <Link to={`/gradeAssignment/${assignments[idx].id}`} >Grade</Link>
                      </td>
                      <td>
                        {/* <Link to={`/editAssignment/${assignments[idx].id}`} >Edit</Link> */}
                        <EditAssignment id={assignments[idx].id}>Edit</EditAssignment>
                      </td>
                      <td>
                        <Button onClick={() => deleteAssignment(assignments[idx].id)}>Delete</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <AddAssignment>Add</AddAssignment>
                {/* <Link to={`/addAssignment/}`} >Add</Link> */}
              </table>
          </div>
      </div>
    )
}  

export default ListAssignment;