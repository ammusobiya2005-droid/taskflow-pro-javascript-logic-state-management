const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const filterButtons = document.querySelectorAll(".filter-btn");

const STORAGE_KEY = "taskflow_pro_tasks";

let tasks = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
let currentFilter = "all";

function saveTasks() {
    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(tasks)
    );
}

function addTask(text) {
    const task = {
        id: Date.now(),
        text: text,
        completed: false
    };

    tasks.push(task);

    saveTasks();
    renderTasks();
}

function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);

    saveTasks();
    renderTasks();
}

function editTask(id) {
    const task = tasks.find(task => task.id === id);

    const updatedText = prompt(
        "Edit Task",
        task.text
    );

    if (!updatedText || updatedText.trim() === "") {
        return;
    }

    task.text = updatedText.trim();

    saveTasks();
    renderTasks();
}

function toggleTask(id) {
    const task = tasks.find(task => task.id === id);

    task.completed = !task.completed;

    saveTasks();
    renderTasks();
}

function getFilteredTasks() {
    switch (currentFilter) {

        case "active":
            return tasks.filter(
                task => !task.completed
            );

        case "completed":
            return tasks.filter(
                task => task.completed
            );

        default:
            return tasks;
    }
}

function renderTasks() {

    taskList.innerHTML = "";

    const filteredTasks = getFilteredTasks();

    if (filteredTasks.length === 0) {
        taskList.innerHTML =
            `<div class="empty-message">
                No Tasks Available
            </div>`;
        return;
    }

    filteredTasks.forEach(task => {

        const li = document.createElement("li");

        li.className =
            `task-item ${
                task.completed ? "completed" : ""
            }`;

        li.dataset.id = task.id;

        li.innerHTML = `
            <span class="task-text">
                ${task.text}
            </span>

            <div class="task-actions">

                <button class="complete-btn">
                    ${task.completed ? "Undo" : "Done"}
                </button>

                <button class="edit-btn">
                    Edit
                </button>

                <button class="delete-btn">
                    Delete
                </button>

            </div>
        `;

        taskList.appendChild(li);
    });
}

taskForm.addEventListener("submit", event => {

    event.preventDefault();

    const text = taskInput.value.trim();

    if (!text) return;

    addTask(text);

    taskInput.value = "";
});

taskList.addEventListener("click", event => {

    const taskItem =
        event.target.closest(".task-item");

    if (!taskItem) return;

    const id = Number(taskItem.dataset.id);

    if (event.target.classList.contains("complete-btn")) {
        toggleTask(id);
    }

    if (event.target.classList.contains("edit-btn")) {
        editTask(id);
    }

    if (event.target.classList.contains("delete-btn")) {
        deleteTask(id);
    }
});

filterButtons.forEach(button => {

    button.addEventListener("click", () => {

        filterButtons.forEach(btn =>
            btn.classList.remove("active")
        );

        button.classList.add("active");

        currentFilter = button.dataset.filter;

        renderTasks();
    });
});

renderTasks();
