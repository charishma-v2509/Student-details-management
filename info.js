document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.getElementById('students-tbody');

    // Load details from the database
    const loadStudents = async () => {
        try {
            // Fetch data from the API
            const response = await fetch('http://localhost:4000/studentsDetails');
            
            // Ensure the response is successful
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            // Parse the JSON data
            const students = await response.json();

            // Map each student object to a table row
            tableBody.innerHTML = students.map(student => `
                <tr>
                    <td>${student.name}</td>
                    <td>${student.roll}</td>
                    <td>${student.cls}</td>
                </tr>
            `).join(''); // Join all rows into a single string
        } catch (error) {
            console.error('Error loading student details:', error);
        }
    };

    const deleteStudent = async (studentId) => {
        try {
            const response = await fetch(`http://localhost:4000/deleteStudent/${studentId}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                // Reload the students table after deletion
                loadStudents();
            } else {
                alert('Failed to delete the student');
            }
        } catch (error) {
            console.error('Error deleting student:', error);
        }
    };

    // Load and display student details on page load
    loadStudents();
});
