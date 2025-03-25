import { useState, useEffect } from "react";
import { useUser } from "../../../contexts/User.contexts";
import { Form, Button, Card, Container, Col, Row } from "react-bootstrap";
import { FaChevronLeft, FaChevronRight, FaTrash } from "react-icons/fa";
import "./styles.css";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

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
                <Card key={index} className="task-card mb-3 p-3 shadow-sm d-flex flex-row align-items-center justify-content-between">
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
        <div className="">
            <DaySelector selectedDay={selectedDay} setSelectedDay={setSelectedDay} tasks={tasks}/>
            <TaskList tasks={tasks[selectedDay] || []} deleteTask={deleteTask} />
            <TaskForm addTask={addTask} />
        </div>
    );
};

