import { useState, useEffect } from "react";
import { useUser } from "../../../contexts/User.contexts";
import { Form, Button, Card, Container, Col, Row } from "react-bootstrap";
import "./styles.css";
import { FaTrash } from "react-icons/fa";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const getWeekDates = () => {
    const today = new Date();
    const dayOfWeek = today.getDay(); // Get the current day index (0 = Sunday, 6 = Saturday)

    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1)); // Adjust to Monday

    return days.map((_, index) => {
        const date = new Date(startOfWeek);
        date.setDate(startOfWeek.getDate() + index); // Increment day
        return date.getDate(); // Get only the day number
    });
};

const DaySelector = ({ selectedDay, setSelectedDay }) => {
    const [dates, setDates] = useState([]);

    useEffect(() => {
        setDates(getWeekDates()); // Generate new week dates on load
    }, []);

    return (
        <Container className="text-center mt-4">
            <h5 className="fw-bold">Today</h5>
            <Row className="justify-content-center mt-2">
                {days.map((day, index) => (
                    <Col key={index} xs="auto">
                        <Button
                            variant="link"
                            className={`day-btn ${selectedDay === index ? "active-day" : ""}`}
                            onClick={() => setSelectedDay(index)}
                        >
                            <div className="day-text">{day}</div>
                            <div className="date-text">{dates[index]}</div>
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
                <Card key={index} className="task-card mb-3 p-3 shadow-sm d-flex flex-row align-items-center justify-content-between">
                    <div>
                        <h5>{task.title}</h5>
                        <p className="text-muted">{task.description}</p>
                        <p className="text-sm text-muted">{task.startTime} - {task.endTime}</p>
                    </div>

                    {/* Delete Button */}
                    <Button
                        variant="danger"
                        size="sm"
                        className="delete-btn"
                        onClick={() => deleteTask(task)}
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
        <Form onSubmit={handleSubmit} className="mt-4">
            <Form.Group className="mb-2">
                <Form.Control
                    type="text"
                    placeholder="Task Title"
                    value={title}
                    required
                    onChange={(e) => setTitle(e.target.value)}
                />
            </Form.Group>
            <Form.Group className="mb-2">
                <Form.Control
                    type="text"
                    placeholder="Description (Optional)"
                    value={description}
                    required
                    onChange={(e) => setDescription(e.target.value)}
                />
            </Form.Group>
            <div className="flex space-x-2">
                <Form.Control
                    type="time"
                    value={startTime}
                    required
                    onChange={(e) => setStartTime(e.target.value)}
                />
                <Form.Control
                    type="time"
                    value={endTime}
                    required
                    onChange={(e) => setEndTime(e.target.value)}
                />
            </div>
            <Button type="submit" className="mt-3 w-full bg-blue-500">Add Task</Button>
        </Form>
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
    }, [tasks]);

    // Function to add a task
    const addTask = (task) => {
        setTasks((prev) => ({
            ...prev,
            [selectedDay]: [...(prev[selectedDay] || []), task],
        }));
    };

    // Function to delete a task
    const deleteTask = (taskToDelete) => {
        setTasks((prev) => ({
            ...prev,
            [selectedDay]: prev[selectedDay].filter((task) => task !== taskToDelete),
        }));
    };

    return (
        <div className="container">
            <DaySelector selectedDay={selectedDay} setSelectedDay={setSelectedDay} />
            <TaskList tasks={tasks[selectedDay] || []} deleteTask={deleteTask} />
            <TaskForm addTask={addTask} />
        </div>
    );
};

