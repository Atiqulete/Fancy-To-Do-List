document.addEventListener("DOMContentLoaded", loadTasks);

function showAlert(message) {
    const alertDiv = document.getElementById("alert");
    alertDiv.textContent = message;
    alertDiv.style.display = "block";
    setTimeout(() => alertDiv.style.display = "none", 3000);
}

function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.forEach(task => addTaskToDOM(task.text, task.priority));
}

function addTask() {
    const taskInput = document.getElementById("task-input");
    const prioritySelect = document.getElementById("priority-select");
    const taskText = taskInput.value.trim();
    const priority = prioritySelect.value;

    if (taskText === "") {
        showAlert("Task cannot be empty.");
        return;
    }

    addTaskToDOM(taskText, priority);
    saveTask({ text: taskText, priority });
    taskInput.value = "";
}

function saveTask(task) {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.push(task);
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function addTaskToDOM(task, priority) {
    const taskList = document.getElementById("task-list");
    const li = document.createElement("li");
    li.innerHTML = `
        <span>${task} <span class="priority-label">(${priority})</span></span>
        <span>
          <i class="fas fa-edit edit" onclick="editTask(this)"></i>
          <i class="fas fa-trash delete" onclick="deleteTask(this)"></i>
        </span>
      `;
    taskList.appendChild(li);
}

function deleteTask(element) {
    const li = element.parentElement.parentElement;
    const taskText = li.firstElementChild.textContent.split(" (")[0].trim();
    li.remove();
    deleteTaskFromStorage(taskText);
}

function deleteTaskFromStorage(taskText) {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks = tasks.filter(t => t.text !== taskText);
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function editTask(element) {
    const li = element.parentElement.parentElement;
    const taskText = li.firstElementChild.textContent.split(" (")[0].trim();
    const priority = li.firstElementChild.textContent.split(" (")[1].replace(")", "");
    const newTaskText = prompt("Edit your task:", taskText);
    const newPriority = prompt("Edit priority (Low, Medium, High):", priority);

    if (newTaskText && newTaskText.trim() !== "" && ["Low", "Medium", "High"].includes(newPriority)) {
        li.firstElementChild.innerHTML = `${newTaskText.trim()} <span class="priority-label">(${newPriority})</span>`;
        updateTaskInStorage(taskText, newTaskText.trim(), newPriority);
    }
}

function updateTaskInStorage(oldTaskText, newTaskText, newPriority) {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const taskIndex = tasks.findIndex(t => t.text === oldTaskText);
    if (taskIndex !== -1) {
        tasks[taskIndex] = { text: newTaskText, priority: newPriority };
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }
}