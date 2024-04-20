// Initialize Firebase
firebase.initializeApp({
    apiKey: "AIzaSyBsH0QhjerWpNXVOK0_iU4RQQFhpMIEO4o",
    authDomain: "app-project-cc9e7.firebaseapp.com",
    projectId: "app-project-cc9e7",
});
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = frebase.firestore();

//get elements
const signoutBtn = document.getElementById('signout-btn');
const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('due-date-input');
const dueDateInput = document.getElementById('due-date-input');
const prioritySelect = document.getElementById('priority-select');
const taskList = document.getElementById('task-list');

//reference to firestore collection 
const tasksRef = firebase.firestore().collection('task');

//auth state change listener
firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        //user is signed in
        taskForm.style.display = 'block';
        signoutBtn.style.display = 'block';
        loadTasks();
    } else {
        //no user signed in
        taskForm.style.display ='none';
        signoutBtn.style.display = 'none';
        taskList.innerHTML = '';
    }
});

//Sign out event listener
signoutBtn.addEventListener('click', () => {
    firebase.auth().signOut();
});
//listen form form submission
taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const taskText = taskInput.value.trim();
    const dueDate = dueDateInput.value;
    const priority = prioritySelect.value;
    if (taskText !== '') {
        //add task to firestore
        tasksRef.add({
            text: taskText,
            dueDate: dueDate,
            priority: priority,
            completed: false,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        })
        .then(() => {
            //clear input fields after adding task
            taskInput.value = '';
            dueDateInput.value ='';
        })
        .catch((error) => {
            console.error('Error adding task:', error);
        });
    }
});
//real time listener
function loadTasks() {
    tasksRef.orderBy('createdAt', 'desc').onSnapshot((snapshot) => {
        taskList.innerHTML = '';
        snapshot.forEach((doc) => {
            const task = doc.data();
            const li = document.createElement('li');
            li.textContent = '${task.text} - Due: ${task.dueDate} - Priority: ${task.priority}';
             if (task.completed) {
                li.classList.add('completed');
             }
             taskList.appendChild(li);
        });
    });
}