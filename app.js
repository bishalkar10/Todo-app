// app.js
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let showArchived = false;

document.getElementById("addTask").addEventListener("click", addTask);
document
  .getElementById("toggleArchived")
  .addEventListener("click", toggleArchived);
const editTaskmodal = document.getElementById("editModal");
const newtaskModal = document.getElementById("newTaskModal");
document
  .getElementById("openTaskModal")
  .addEventListener("click", toggleNewTaskModal);
document
  .getElementById("closeNewTaskModal")
  .addEventListener("click", () => toggleModal(newtaskModal));

// Add a new task
function addTask(e) {
  e.preventDefault();
  const title = document.getElementById("taskTitle").value.trim();
  const description = document.getElementById("taskDescription").value.trim();

  if (title.length < 4 || description.length < 4) {
    alert("Title and description must be at least 4 characters long.");
    return;
  }

  const newTask = {
    id: Date.now(),
    title,
    description,
    completed: false,
    archived: false,
    timestamp: Date.now(),
  };

  tasks.push(newTask);
  updateLocalStorage();
  renderTasks();
  clearInputs();
  toggleModal(newtaskModal);
}

// Render tasks based on their archived status
function renderTasks() {
  renderMainList();
  renderArchivedList();
}

// Render main task list
function renderMainList() {
  const mainList = document.getElementById("mainList");
  mainList.innerHTML = "";

  tasks
    .filter((task) => !task.archived)
    .sort((a, b) => b.timestamp - a.timestamp)
    .forEach((task) => {
      const taskElement = createTaskElement(task);
      mainList.appendChild(taskElement);
    });
}

// Render archived task list
function renderArchivedList() {
  const archivedList = document.querySelector("#archivedList ul");

  archivedList.innerHTML = "";

  tasks
    .filter((task) => task.archived)
    .sort((a, b) => b.timestamp - a.timestamp)
    .forEach((task) => {
      const taskElement = createTaskElement(task);
      archivedList.appendChild(taskElement);
    });
}

// Create task HTML element
function createTaskElement(task) {
  const taskDiv = document.createElement("div");
  taskDiv.className =
    "relative group p-4 bg-white rounded shadow flex justify-between items-center";
  taskDiv.innerHTML = `
    <div class="${task.completed ? "line-through text-gray-500" : ""}">
      <h3 class="font-bold">${task.title}</h3>
      <p>${task.description}</p>
    </div>
    <div class="hidden absolute bg-white right-4 top-0 h-full w-max group-hover:flex gap-2 items-center">
      ${
        !task.archived
          ? `
      <button class="w-8 h-8 rounded-lg bg-green-100 hover:bg-green-200 text-green-600 flex items-center justify-center" onclick="toggleComplete(${task.id})">
        <i class="fas text-lg fa-check"></i>
      </button>
      
      <button class="w-8 h-8 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-600 flex items-center justify-center" onclick="editTask(${task.id})">
        <i class="fas text-lg fa-edit"></i>
      </button> `
          : ""
      }
      <button class="w-8 h-8 rounded-lg bg-yellow-100 hover:bg-yellow-200 text-yellow-600 flex items-center justify-center" onclick="toggleArchive(${
        task.id
      })">
        <i class="fas text-lg ${task.archived ? "fa-undo" : "fa-archive"}"></i>
      </button>
      <button class="w-8 h-8 rounded-lg bg-red-100 hover:bg-red-200 text-red-600 flex items-center justify-center" onclick="removeTask(${
        task.id
      })">
        <i class="fas text-lg fa-trash"></i>
      </button>
    </div>
  `;
  return taskDiv;
}

// Toggle task completion
function toggleComplete(id) {
  const task = tasks.find((t) => t.id === id);
  task.completed = !task.completed;
  updateLocalStorage();
  renderTasks();
}

function toggleModal(modal) {
  // Toggle flex and hidden classes
  modal.classList.toggle("flex");
  modal.classList.toggle("hidden");
}

function toggleNewTaskModal() {
  newtaskModal.classList.toggle("flex");
  newtaskModal.classList.toggle("hidden");
}

// Edit a task
function editTask(id) {
  const task = tasks.find((t) => t.id === id);

  // Pre-fill modal with current task data
  document.getElementById("editTaskTitle").value = task.title;
  document.getElementById("editTaskDescription").value = task.description;

  // Show the modal
  toggleModal(editTaskmodal);

  // Attach event listener for Save button
  const saveBtn = document.getElementById("saveEdit");
  saveBtn.onclick = function () {
    const newTitle = document.getElementById("editTaskTitle").value.trim();
    const newDescription = document
      .getElementById("editTaskDescription")
      .value.trim();

    if (newTitle.length >= 4 && newDescription.length >= 4) {
      task.title = newTitle;
      task.description = newDescription;
      task.timestamp = Date.now();

      updateLocalStorage();
      renderTasks();
      toggleModal(editTaskmodal); // Close the modal after saving
    } else {
      alert("Title and description must be at least 4 characters long.");
    }
  };

  // Attach event listener for Close button
  const closeBtn = document.getElementById("closeEditModal");
  closeBtn.onclick = function () {
    toggleModal(editTaskmodal);
  };
}

// Toggle archive status
function toggleArchive(id) {
  const task = tasks.find((t) => t.id === id);
  task.archived = !task.archived;
  updateLocalStorage();
  renderTasks();
}

// Remove a task
function removeTask(id) {
  tasks = tasks.filter((t) => t.id !== id);
  updateLocalStorage();
  renderTasks();
}

// Toggle archived tasks visibility
function toggleArchived() {
  const archivedList = document.getElementById("archivedList");

  archivedList.classList.toggle("hidden");
  archivedList.classList.toggle("flex");
  renderTasks();
}

// Update local storage
function updateLocalStorage() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Clear input fields
function clearInputs() {
  document.getElementById("taskTitle").value = "";
  document.getElementById("taskDescription").value = "";
}

function clearAllArchived() {
  tasks = tasks.filter((item) => !item.archived);
  updateLocalStorage();
  renderTasks();
  toggleArchived();
}

// Initial rendering
renderTasks();
