import { useState, useEffect } from "react";
import { useUser } from "../../../contexts/User.contexts";
import {
    Form, Button, Card, Container, Col, Row, Modal
} from "react-bootstrap";
import { FaChevronLeft, FaChevronRight, FaTrash } from "react-icons/fa";
import "./styles.css";

import reminder_icon from "../../../assets/reminder_icon.jpg"
import sunIcon from "../../../assets/sunIcon.jpg"; // Use appropriate sun icon
import moonIcon from "../../../assets/moonIcon.jpg"; // Use appropriate moon icon


const getWeekDates = (currentDate) => {
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay()); // Start from Sunday

    return [...Array(7)].map((_, index) => {
        const date = new Date(startOfWeek);
        date.setDate(startOfWeek.getDate() + index);
        return {
            day: date.toLocaleDateString("en-US", { weekday: "short" }),
            date: date.getDate(),
            fullDate: date.toISOString().split("T")[0], // Keeps full date for task tracking
        };
    });
};

const DaySelector = ({ selectedDay, setSelectedDay, tasks }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [weekDates, setWeekDates] = useState(getWeekDates(currentDate));

    useEffect(() => {
        setWeekDates(getWeekDates(currentDate));
    }, [currentDate]); // Recalculate when moving to a different week

    const handlePrevWeek = () => {
        const prevWeek = new Date(currentDate);
        prevWeek.setDate(currentDate.getDate() - 7);
        setCurrentDate(prevWeek);
    };

    const handleNextWeek = () => {
        const nextWeek = new Date(currentDate);
        nextWeek.setDate(currentDate.getDate() + 7);
        setCurrentDate(nextWeek);
    };

    const monthYear = currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });

    return (
        <Container className="day-selector-container">
            <div className="header">
                <FaChevronLeft className="nav-icon" onClick={handlePrevWeek} />
                <span className="month-year">{monthYear}</span>
                <FaChevronRight className="nav-icon" onClick={handleNextWeek} />
            </div>

            <Row className="days-row justify-content-center">
                {weekDates.map(({ day, date, fullDate }, index) => (
                    <Col key={index} xs="auto">
                        <Button
                            // variant="link"
                            className={`day-btn ${selectedDay === fullDate ? "active-day" : ""}`}
                            onClick={() => setSelectedDay(fullDate)}
                        >
                            <div className="day-text">{day}</div>
                            <div className="date-text">{date}</div>
                            {/* Show task indicator if tasks exist for that day */}
                            {tasks[fullDate] && <div className="task-indicator"></div>}
                        </Button>
                    </Col>
                ))}
            </Row>
        </Container>
    );
};
const TaskList = ({ tasks, deleteTask }) => {
    return (
        <div className="mt-4">
            {tasks.length === 0 ? <p className="text-center">No tasks for today.</p> : null}

            {tasks.map((task, index) => (
                <Card key={task.id || index} className="task-card mb-3 p-3 shadow-sm d-flex flex-row align-items-center justify-content-between">
                    <div>
                        <h4>{task.title}</h4>
                        <p className="text-muted">{task.description}</p>
                        <p className="text-sm text-muted">{task.startTime} - {task.endTime}</p>
                    </div>

                    {/* Delete Button */}
                    <Button
                        variant="danger"
                        size="sm"
                        className="delete-btn"
                        onClick={() => deleteTask(task.id)}
                    >
                        <FaTrash />
                    </Button>
                </Card>
            ))}
        </div>
    );
};


const TaskForm = ({ addTask }) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title || !startTime || !endTime) return;
        addTask({ title, description, startTime, endTime });
        setTitle("");
        setDescription("");
        setStartTime("");
        setEndTime("");
    };

    return (
        <Form onSubmit={handleSubmit} className="task-form">
            <Form.Group className="mb-3">
                <Form.Control
                    type="text"
                    placeholder="Task Title"
                    value={title}
                    required
                    className="form-input"
                    onChange={(e) => setTitle(e.target.value)}
                />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Control
                    as="textarea"
                    rows={2}
                    placeholder="Description (Optional)"
                    value={description}
                    className="form-input"
                    onChange={(e) => setDescription(e.target.value)}
                />
            </Form.Group>

            <Row className="mb-3 time-row">
                <Col>
                    <Form.Control
                        type="time"
                        value={startTime}
                        required
                        className="form-time"
                        onChange={(e) => setStartTime(e.target.value)}
                    />
                </Col>
                <Col>
                    <Form.Control
                        type="time"
                        value={endTime}
                        required
                        className="form-time"
                        onChange={(e) => setEndTime(e.target.value)}
                    />
                </Col>
            </Row>

            <Button type="submit" className="submit-btn">
                Add Task
            </Button>
        </Form>
    );
};

const NotificationService = ({ tasks }) => {
    const [missedTasks, setMissedTasks] = useState([]);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        console.log("🔄 NotificationService mounted, checking notification support...");

        if (!("Notification" in window)) {
            console.warn("❌ Browser does NOT support notifications.");
            return;
        }

        if (Notification.permission !== "granted") {
            console.warn("⚠️ Notifications not granted. Requesting...");
            Notification.requestPermission().then((permission) => {
                if (permission === "granted") {
                    console.log("✅ Notifications allowed!");
                } else {
                    console.warn("🚫 Notifications denied.");
                }
            });
        }
        const checkTaskNotifications = () => {
            console.log("🔍 Checking for task notifications...");

            if (Notification.permission !== "granted") {
                console.warn("🚫 Notifications are blocked! Skipping check.");
                return;
            }

            const now = new Date();
            const currentTime = now.getHours() * 60 + now.getMinutes(); // Convert to minutes
            const todayKey = now.toISOString().split("T")[0]; // YYYY-MM-DD format

            console.log(`📅 Today’s Date: ${todayKey}`);
            console.log("📋 Scheduled tasks:", tasks[todayKey] || []);

            if (!tasks[todayKey] || tasks[todayKey].length === 0) {
                console.log("✅ No tasks scheduled for today.");
                return;
            }

            let missed = JSON.parse(localStorage.getItem("missedTasks")) || [];

            tasks[todayKey].forEach((task) => {
                const [startHour, startMinute] = task.startTime.split(":").map(Number);
                const [endHour, endMinute] = task.endTime.split(":").map(Number);
                const taskStartTime = startHour * 60 + startMinute;
                const taskEndTime = endHour * 60 + endMinute;

                console.log(`⏰ Checking task: ${task.title}`);
                console.log(`🕒 Start: ${task.startTime} (${taskStartTime} mins)`);
                console.log(`🕒 End: ${task.endTime} (${taskEndTime} mins)`);
                console.log(`🕒 Now: ${currentTime} mins`);

                if (taskStartTime === currentTime) {
                    console.log(`🔔 Sending notification: ${task.title}`);

                    const notification = new Notification("Task Reminder", {
                        body: `${task.title} - ${task.description}`,
                        icon: reminder_icon,
                        requireInteraction: true,
                    });

                    notification.onclick = () => {
                        console.log(`🖱️ User clicked notification: ${task.title}`);
                        window.location.href = "/dashboard/home";
                    };
                }

                // Track if task is missed, ensuring no duplicates
                setTimeout(() => {
                    if (currentTime > taskEndTime) {
                        const alreadyMissed = missed.find((missedTask) => missedTask.title === task.title && missedTask.date === todayKey);

                        if (!alreadyMissed) {
                            console.warn(`⚠️ Task MISSED: ${task.title}`);
                            missed.push({ ...task, date: todayKey });
                            localStorage.setItem("missedTasks", JSON.stringify(missed));
                        } else {
                            console.log(`✅ Task already marked as missed: ${task.title}`);
                        }
                    }
                }, 60000); // Check 1 minute after end time
            });
        };

        const interval = setInterval(checkTaskNotifications, 60000);
        return () => clearInterval(interval);
    }, [tasks]);

    useEffect(() => {
        console.log("🚀 Checking missed tasks on site visit...");

        let storedMissedTasks = JSON.parse(localStorage.getItem("missedTasks")) || [];
        const todayKey = new Date().toISOString().split("T")[0];

        console.log("📌 Stored Missed Tasks:", storedMissedTasks);

        // Remove outdated missed tasks
        const validMissedTasks = storedMissedTasks.filter(task => task.date === todayKey);
        localStorage.setItem("missedTasks", JSON.stringify(validMissedTasks));

        if (validMissedTasks.length > 0) {
            console.warn("⚠️ Showing Missed Tasks Modal...");
            setMissedTasks(validMissedTasks);
            setShowModal(true);
        } else {
            console.log("✅ No missed tasks.");
        }
    }, []);

    const handleClose = () => {
        console.log("🛑 User dismissed missed tasks modal.");
        setShowModal(false);
        localStorage.removeItem("missedTasks");
    };

    return (
        <Modal show={showModal} onHide={handleClose} centered>
            <Modal.Body className="missed-tasks-modal">
                <h3 className="modal-title">⚠️ Missed Tasks</h3>
                <p className="modal-description">You missed the following tasks:</p>

                <div className="tasks-container">
                    {missedTasks.map((task, index) => {
                        const isDaytime = parseInt(task.startTime.split(":")[0], 10) < 18; // Before 6 PM = daytime
                        return (
                            <div key={index} className={`task-card ${isDaytime ? "day-task" : "night-task"}`}>
                                <img src={isDaytime ? sunIcon : moonIcon} alt="Task Icon" className="task-icon" />
                                <div className="task-details">
                                    <h5>{task.title}</h5>
                                    <p>{task.description}</p>
                                    <span className="task-time">{task.startTime} - {task.endTime}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <Button variant="secondary" onClick={handleClose} className="close-btn">
                    Close
                </Button>
            </Modal.Body>
        </Modal>
    );
};

export const Schedule = () => {
    const { currentUser } = useUser();
    const { id } = currentUser;
    const [selectedDay, setSelectedDay] = useState(new Date().getDay());
    const [tasks, setTasks] = useState(() => {
        return JSON.parse(localStorage.getItem(`${id}_scheduleTasks1`)) || {};
    });

    useEffect(() => {
        localStorage.setItem(`${id}_scheduleTasks1`, JSON.stringify(tasks));
    }, [tasks, id]);

    useEffect(() => {
        if ("Notification" in window) {
            Notification.requestPermission().then((permission) => {
                console.log("Notification Permission:", permission);
            });
        }
    }, []);

    // Function to add a new task
    const addTask = (task) => {
        const newTask = {
            id: Date.now(), // Unique ID for each task
            ...task,
        };

        setTasks((prev) => ({
            ...prev,
            [selectedDay]: [...(prev[selectedDay] || []), newTask],
        }));
    };

    // Function to delete a task by ID
    const deleteTask = (taskId) => {
        setTasks((prev) => ({
            ...prev,
            [selectedDay]: prev[selectedDay].filter((task) => task.id !== taskId),
        }));
    };

    return (
        <div className="">
            <NotificationService tasks={tasks} />
            <DaySelector selectedDay={selectedDay} setSelectedDay={setSelectedDay} tasks={tasks} />
            <TaskList tasks={tasks[selectedDay] || []} deleteTask={deleteTask} />
            <TaskForm addTask={addTask} />
        </div>
    );
};
