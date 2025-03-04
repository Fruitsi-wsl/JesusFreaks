document.addEventListener("DOMContentLoaded", function () {
    let selectedDay = null;
    let scheduleData = {};  // Object to store data by day

    // Fetch the current schedule data when the page loads
    fetch('https://jesusapi.onrender.com/get-schedule')
        .then(response => response.json())
        .then(data => {
            scheduleData = data;  // Use the data from the server
            console.log("Current schedule data:", scheduleData);
            updateUI(); // Optionally, update UI with fetched data
        })
        .catch(error => console.error('Error fetching schedule data:', error));

    // Open popup when a day div is clicked
    document.querySelectorAll('.day-div').forEach(div => {
        div.addEventListener('click', function () {
              // Ignore clicks on saved or booked divs

            selectedDay = this.dataset.day;
            console.log("Clicked:", selectedDay);

            document.getElementById('popup-title').innerText = `Enter Details for ${selectedDay.charAt(0).toUpperCase() + selectedDay.slice(1)}`;
            document.getElementById('popup').style.display = 'block';

            // Clear previous input values
            document.getElementById('title').value = "";
            document.getElementById('teacher').value = "";
            document.getElementById('date').value = "";
            document.getElementById('time').value = "";
            document.getElementById('description').value = "";
        });
    });

    // Close popup
    function closePopup() {
        document.getElementById('popup').style.display = 'none';
    }

    // Save data when user clicks "Save"
    function saveData() {
        if (!selectedDay) return alert("Please select a day first!");

        let title = document.getElementById('title').value;
        let teacher = document.getElementById('teacher').value;
        let date = document.getElementById('date').value;
        let time = document.getElementById('time').value;
        let description = document.getElementById('description').value;

        if (!title || !teacher || !time || !description) {
            alert("All fields are required!");
            return;
        }

        if (!scheduleData[selectedDay]) {
            scheduleData[selectedDay] = [];
        }

        scheduleData[selectedDay].push({
            title: title,
            teacher: teacher,
            date: date,
            time: time,
            description: description,
            booked: 1  // Mark it as booked
        });

        // Disable the day div after data is saved (so it's no longer clickable)
        const dayDiv = document.querySelector(`.day-div[data-day="${selectedDay}"]`);
        dayDiv.classList.add("saved");
        dayDiv.classList.add("booked");

        // Show the "Clear" button
        const clearButton = dayDiv.querySelector(".clear-button");
        clearButton.style.display = "block";  // Make the Clear button visible

        // Send the updated schedule data to the server
        fetch('https://jesusapi.onrender.com/save-schedule', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(scheduleData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to save data');
            }
            return response.json();
        })
        .then(data => {
            
            closePopup();

            // Optionally update the UI here (e.g., showing the new data on the page)
            updateUI(selectedDay);  // Custom function to update the div with the new data
        })
        .catch(error => {
            console.error('Error saving data:', error);
            alert('Failed to save data');
        });
    }

    // Attach event listeners to buttons
    document.querySelector("#popup button:first-of-type").addEventListener("click", saveData);
    document.querySelector("#popup button:last-of-type").addEventListener("click", closePopup);

    // Update the UI with the saved data
    function updateUI(day) {
        if (!day) {
            // Loop through all days and update them
            document.querySelectorAll('.day-div').forEach(div => {
                const dayData = scheduleData[div.dataset.day];
                if (dayData && dayData.length > 0) {
                    const lastData = dayData[dayData.length - 1];
                    div.querySelector('.title p').innerText = lastData.title;
                    div.querySelector('.teacher p').innerText = lastData.teacher;
                    div.querySelector('.date p').innerText = lastData.date;
                    div.querySelector('.time p').innerText = lastData.time;
                    div.querySelector('.description p').innerText = lastData.description;
                    if (lastData.booked === 1) {
                        div.classList.add('booked');  // Mark it as booked
                        const clearButton = div.querySelector(".clear-button");
                        clearButton.style.display = "block";  // Make the Clear button visible
                    }
                }
            });
        } else {
            // Update only the clicked day
            const dayDiv = document.querySelector(`.day-div[data-day="${day}"]`);
            const dayData = scheduleData[day];
            if (dayData && dayData.length > 0) {
                const lastData = dayData[dayData.length - 1];
                dayDiv.querySelector('.title p').innerText = lastData.title;
                dayDiv.querySelector('.teacher p').innerText = lastData.teacher;
                dayDiv.querySelector('.date p').innerText = lastData.date;
                dayDiv.querySelector('.time p').innerText = lastData.time;
                dayDiv.querySelector('.description p').innerText = lastData.description;
                if (lastData.booked === 1) {
                    dayDiv.classList.add('booked');  // Mark it as booked
                    const clearButton = dayDiv.querySelector(".clear-button");
                    clearButton.style.display = "block";  // Make the Clear button visible
                }
            }
        }
    }

    // Clear the day data when the "Clear" button is clicked
    document.querySelectorAll('.clear-button').forEach(button => {
        button.addEventListener('click', function (event) {
            const dayDiv = this.closest('.day-div');
            const day = dayDiv.dataset.day;

            // Clear the data for that day
            dayDiv.querySelector('.title p').innerText = '';
            dayDiv.querySelector('.teacher p').innerText = '';
            dayDiv.querySelector('.date p').innerText = '';
            dayDiv.querySelector('.time p').innerText = '';
            dayDiv.querySelector('.description p').innerText = '';

            // Remove the saved and booked classes
            dayDiv.classList.remove('booked');
            dayDiv.classList.remove('saved');

            // Hide the "Clear" button
            const clearButton = dayDiv.querySelector(".clear-button");
            clearButton.style.display = "none";  // Hide the Clear button

            // Optionally, clear the data in the schedule object
            scheduleData[day] = [];

            // Optionally, send the updated data to the server to clear the schedule
            fetch('https://jesusapi.onrender.com/save-schedule', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(scheduleData)
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to save data');
                }
                return response.json();
            })
            .then(data => {

            })
            .catch(error => {
                console.error('Error saving data:', error);
                alert('Failed to save data');
            });

            event.stopPropagation();  // Prevent the click event from propagating to the parent div
        });
    });
});
