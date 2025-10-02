document.addEventListener("DOMContentLoaded", () => {
  const activitiesList = document.getElementById("activities-list");
  const activitySelect = document.getElementById("activity");
  const signupForm = document.getElementById("signup-form");
  const messageDiv = document.getElementById("message");

  // Function to fetch activities from API
  async function fetchActivities() {
    try {
      const response = await fetch("/activities");
      const activities = await response.json();

      activitiesList.innerHTML = "";

      const template = document.getElementById("activity-card-template");

      Object.entries(activities).forEach(([name, details]) => {
        const activityCard = template.content.cloneNode(true);

        activityCard.querySelector(".activity-name").textContent = name;
        activityCard.querySelector(".activity-description").textContent = details.description;
        activityCard.querySelector(".activity-schedule").textContent = details.schedule;

        const spotsLeft = details.max_participants - details.participants.length;
        activityCard.querySelector(".activity-availability").textContent = `${spotsLeft} spots left`;

        const participantsList = activityCard.querySelector(".participants-list");
        const noParticipantsMsg = activityCard.querySelector(".no-participants");

        participantsList.innerHTML = "";
        if (details.participants.length > 0) {
          details.participants.forEach((participant) => {
            const li = document.createElement("li");
            li.className = "participant-item";
            li.textContent = participant;
            participantsList.appendChild(li);
          });
          participantsList.classList.remove("hidden");
          noParticipantsMsg.classList.add("hidden");
        } else {
          participantsList.classList.add("hidden");
          noParticipantsMsg.textContent = "No participants yet.";
          noParticipantsMsg.classList.remove("hidden");
        }

        activitiesList.appendChild(activityCard);

        const option = document.createElement("option");
        option.value = name;
        option.textContent = name;
        activitySelect.appendChild(option);
      });
    } catch (error) {
      activitiesList.innerHTML = "<p>Failed to load activities. Please try again later.</p>";
      console.error("Error fetching activities:", error);
    }
  }

  // Handle form submission
  signupForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const activity = document.getElementById("activity").value;

    try {
      const response = await fetch(
        `/activities/${encodeURIComponent(activity)}/signup?email=${encodeURIComponent(email)}`,
        {
          method: "POST",
        }
      );

      const result = await response.json();

      if (response.ok) {
        messageDiv.textContent = result.message;
        messageDiv.className = "success";
        signupForm.reset();
      } else {
        messageDiv.textContent = result.detail || "An error occurred";
        messageDiv.className = "error";
      }

      messageDiv.classList.remove("hidden");

      // Hide message after 5 seconds
      setTimeout(() => {
        messageDiv.classList.add("hidden");
      }, 5000);
    } catch (error) {
      messageDiv.textContent = "Failed to sign up. Please try again.";
      messageDiv.className = "error";
      messageDiv.classList.remove("hidden");
      console.error("Error signing up:", error);
    }
  });

  // Initialize app
  fetchActivities();
});
