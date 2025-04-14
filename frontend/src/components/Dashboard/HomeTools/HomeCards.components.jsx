import React, { useState, useEffect } from "react";
import { Carousel, Container, Image, Card, Row, Col } from "react-bootstrap";
import "./homecards.styles.css";
import carouselImage from "../../../assets/4214472.jpg"

const quotes = [
    {
        text: "Education is the most powerful weapon which you can use to change the world.",
        author: "Nelson Mandela",
    },
    {
        text: "The beautiful thing about learning is that no one can take it away from you.",
        author: "B.B. King",
    },
    {
        text: "Live as if you were to die tomorrow. Learn as if you were to live forever.",
        author: "Mahatma Gandhi",
    },
    {
        text: "An investment in knowledge pays the best interest.",
        author: "Benjamin Franklin",
    },
    {
        text: "Education is not the learning of facts, but the training of the mind to think.",
        author: "Albert Einstein",
    },
    {
        text: "Develop a passion for learning. If you do, you will never cease to grow.",
        author: "Anthony J. D'Angelo",
    },
    {
        text: "Education is not preparation for life; education is life itself.",
        author: "John Dewey",
    },
    {
        text: "The roots of education are bitter, but the fruit is sweet.",
        author: "Aristotle",
    },
    {
        text: "Success is not the key to happiness. Happiness is the key to success. If you love what you are doing, you will be successful.",
        author: "Albert Schweitzer",
    },
    {
        text: "Education is the movement from darkness to light.",
        author: "Allan Bloom",
    },
    {
        text: "Tell me and I forget, teach me and I may remember, involve me and I learn.",
        author: "Benjamin Franklin",
    },
    {
        text: "A person who won’t read has no advantage over one who can’t read.",
        author: "Mark Twain",
    },
    {
        text: "Education is simply the soul of a society as it passes from one generation to another.",
        author: "G.K. Chesterton",
    },
    {
        text: "You can never be overdressed or overeducated.",
        author: "Oscar Wilde",
    },
    {
        text: "Change is the end result of all true learning.",
        author: "Leo Buscaglia",
    },
    {
        text: "The expert in anything was once a beginner.",
        author: "Helen Hayes",
    },
    {
        text: "Wisdom... comes not from age, but from education and learning.",
        author: "Anton Chekhov",
    },
    {
        text: "Do not train a child to learn by force or harshness; but direct them to it by what amuses their minds.",
        author: "Plato",
    },
    {
        text: "The purpose of education is to replace an empty mind with an open one.",
        author: "Malcolm Forbes",
    },
    {
        text: "Education is the foundation upon which we build our future.",
        author: "Christine Gregoire",
    }
];

const funFacts = [
    {
        fact: "Did you know? The Eiffel Tower can be 15 cm taller during hot days.",
        author: "Albert Einstein",
    },
    {
        fact: "Octopuses have three hearts and their blood is blue!",
        author: "Marie Curie",
    },
    {
        fact: "Honey never spoils. Archaeologists found pots of honey in ancient Egyptian tombs still edible!",
        author: "Isaac Newton",
    },
    {
        fact: "A day on Venus is longer than a year on Venus!",
        author: "Nikola Tesla",
    },
    {
        fact: "Sharks existed before trees did!",
        author: "Stephen Hawking",
    },
    {
        fact: "Bananas are berries, but strawberries aren’t!",
        author: "Charles Darwin",
    },
    {
        fact: "Water can boil and freeze at the same time (Triple Point)!",
        author: "Galileo Galilei",
    },
    {
        fact: "The human brain generates enough electricity to power a light bulb.",
        author: "Leonardo da Vinci",
    },
    {
        fact: "Lightning is five times hotter than the surface of the sun!",
        author: "Thomas Edison",
    },
    {
        fact: "The first computer was invented in the 1940s and occupied an entire room.",
        author: "Alan Turing",
    },
];


const ExampleCarouselTextBox = ({ text }) => {
    return (
        <Container
            className="example-carousel-box d-flex flex-column justify-content-center align-items-center text-center"
        >
            {carouselImage && <Image src={carouselImage} alt="Slide" className="carousel-image mb-3" />}
            <h3>{text}</h3>
        </Container>
    );
};

export const QuoteCarousel = () => {
    return (
        <Carousel interval={2500} data-bs-theme="dark" className="mb-5 p-2">
            {quotes.map((quote, index) => (
                <Carousel.Item key={index} className="quote-item ">
                    <ExampleCarouselTextBox text={`"${quote.text}"`} />
                    <Carousel.Caption>
                        <p className="quote-author">- {quote.author}</p>
                    </Carousel.Caption>
                </Carousel.Item>
            ))}
        </Carousel>
    );
};

export const FunFactCarousel = () => {
    const [index, setIndex] = useState(0);

    const handleSelect = (selectedIndex) => {
        setIndex(selectedIndex);
    };

    // Split fun facts into groups of three
    const chunkedFacts = [];
    for (let i = 0; i < funFacts.length; i += 3) {
        chunkedFacts.push(funFacts.slice(i, i + 3));
    }

    return (

        <div>
            <h2 className="text-center my-4">📚 Fun Educational Facts</h2>
            <Carousel activeIndex={index} onSelect={handleSelect} interval={4000} indicators={false}>
                {chunkedFacts.map((group, idx) => (
                    <Carousel.Item key={idx}>
                        <Row className="justify-content-center">
                            {group.map((fact, factIdx) => (
                                <Col md={4} key={factIdx}>
                                    <Card className="funfact-card">
                                        <Card.Body>
                                            <blockquote className="blockquote mb-5">
                                                <p>“{fact.fact}”</p>
                                            </blockquote>
                                            <div className="funfact-author">
                                                <Image src={carouselImage} roundedCircle className="author-img" />
                                                <span className="author-name">{fact.author}</span>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    </Carousel.Item>
                ))}
            </Carousel>
        </div>
    );
};
export const FlipClock = () => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const interval = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(interval);
    }, []);

    const formatTime = (date) => {
        let hours = date.getHours();
        let minutes = date.getMinutes();
        let ampm = hours >= 12 ? "PM" : "AM";
        hours = hours % 12 || 12;

        return {
            h1: String(hours).padStart(2, "0")[0],
            h2: String(hours).padStart(2, "0")[1],
            m1: String(minutes).padStart(2, "0")[0],
            m2: String(minutes).padStart(2, "0")[1],
            ampm1: ampm[0],
            ampm2: ampm[1],
        };
    };

    const { h1, h2, m1, m2, ampm1, ampm2 } = formatTime(time);

    return (
        <div className="flip-clock-container">
            <div className="flip-box">{h1}</div>
            <div className="flip-box">{h2}</div>
            <span className="colon">:</span>
            <div className="flip-box">{m1}</div>
            <div className="flip-box">{m2}</div>
            <div className="flip-box small">{ampm1}</div>
            <div className="flip-box small">{ampm2}</div>
        </div>
    );
};

