import React, { useState, useEffect, useRef } from "react";
import "./App.css";

const SENTENCE_TIME = 30; // seconds

function App() {
  const [sentences, setSentences] = useState([
    "The quick brown fox jumps over the lazy dog",
    "A journey of a thousand miles begins with a single step",
    "Success is not final, failure is not fatal",
    "To be or not to be, that is the question",
    "Every moment is a fresh beginning",
    "Dream big and dare to fail",
    "Believe you can and you're halfway there",
    "Happiness depends upon ourselves",
    "Practice makes perfect, so keep typing every day.",
  "Learning new programming languages opens up new opportunities.",
  "Consistency is the key to mastering any skill.",
  "Debugging helps you understand how your code works.",
  "Focus on accuracy first, then speed will follow.",
  "Building projects is the best way to gain real experience.",
  "Time management improves productivity significantly.",
  "Stay curious and never stop exploring new ideas.",
  "Reading code written by others broadens your knowledge.",
  "Taking breaks can help maintain concentration and avoid fatigue.",
  "Mistakes are part of learning, so don’t be afraid to make them.",
  "Type each sentence carefully to improve your typing skills.",
  "Challenge yourself with more complex sentences over time.",
  "Use proper finger placement to increase typing efficiency.",
  "Typing regularly can boost your overall computer skills.",
  "Remember to keep your posture straight to avoid strain.",
  "The quicker you recognize words, the faster you'll type.",
  "Typing speed tests are fun and useful for self-improvement.",
  "Always proofread your work to catch any errors.",
  "Healthy eyes and hands make better typing possible.",
  "The quick brown fox jumps over the lazy dog near the riverbank.",
  "Complex algorithms often require thoughtful planning and precise execution.",
  "In the realm of programming, efficiency and readability must coexist harmoniously.",
  "Debugging convoluted code can sometimes be more art than science.",
  "Asynchronous operations require careful management of promises and callbacks.",
  "Understanding recursion is crucial for mastering many advanced programming concepts.",
  "Optimizing performance involves balancing speed, memory, and maintainability.",
  "The juxtaposition of simple ideas often yields the most elegant solutions.",
  "Refactoring legacy code demands patience, insight, and rigorous testing.",
  "Concurrency issues may lead to subtle and hard-to-reproduce bugs.",
  "A thorough code review can prevent potential security vulnerabilities.",
  "Implementing design patterns enhances code scalability and reusability.",
  "Proper exception handling is vital for robust and user-friendly applications.",
  "Profiling tools help identify bottlenecks and improve application speed.",
  "The intricacies of asynchronous JavaScript can be bewildering at first.",
  "Using descriptive variable names improves code comprehension significantly.",
  "Efficient data structures underpin effective algorithm design.",
  "Sophisticated software requires continuous integration and deployment pipelines.",
  "Multithreading can introduce complexity that must be carefully managed.",
  "Writing clean code is a discipline that separates novices from experts.",
  "Compilers translate high-level code into machine-readable instructions.",
  "Unit testing ensures individual components behave as expected under various conditions.",
  "Maintaining documentation is essential for long-term project success.",
  "Automated testing frameworks speed up quality assurance processes.",
  "Modular architecture allows easier updates and feature additions.",
  "Advanced algorithms often use recursion, iteration, and dynamic programming.",
  "Immutable data structures prevent unintended side effects in programs.",
  "Garbage collection helps manage memory automatically in many languages.",
  "Code reviews foster knowledge sharing and improve overall code quality.",
  "Continuous learning is necessary to keep up with evolving technologies.",
  "Synchronous code executes sequentially, while asynchronous code does not.",
  "The event loop is fundamental to understanding JavaScript concurrency.",
  "Functional programming emphasizes pure functions and immutable state.",
  "Designing intuitive user interfaces enhances user experience significantly.",
  "Software scalability depends on both hardware and software optimizations.",
  "Legacy systems pose unique challenges for integration and modernization.",
  "Profiling memory usage helps prevent leaks and optimize resource consumption.",
  "Refactoring improves code readability without changing its external behavior.",
  "Effective debugging requires both analytical skills and patience."
  
  ]);
  const [sentence, setSentence] = useState("");
  const [input, setInput] = useState("");
  const [timeLeft, setTimeLeft] = useState(SENTENCE_TIME);
  const [timerActive, setTimerActive] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [wpm, setWpm] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [errorCount, setErrorCount] = useState(0);
  const [lastSentenceIndex, setLastSentenceIndex] = useState(null);

  const inputRef = useRef(null);

  // Choose a random sentence different from the last
  const pickRandomSentence = () => {
    if (sentences.length === 0) return "";
    let idx;
    do {
      idx = Math.floor(Math.random() * sentences.length);
    } while (idx === lastSentenceIndex && sentences.length > 1);
    setLastSentenceIndex(idx);
    return sentences[idx];
  };

  useEffect(() => {
    const newSentence = pickRandomSentence();
    setSentence(newSentence);
  }, []);

  // Timer logic
  useEffect(() => {
    if (!timerActive) return;

    if (timeLeft <= 0) {
      setTimerActive(false);
      setIsFinished(true);
      calculateWpm();
      return;
    }

    const timerId = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearTimeout(timerId);
  }, [timerActive, timeLeft]);

  // Calculate WPM
  const calculateWpm = () => {
    if (!startTime) return;

    const now = Date.now();
    const minutes = (now - startTime) / 1000 / 60;

    const sentenceWords = sentence.trim().split(/\s+/);
    const inputWords = input.trim().split(/\s+/);

    let correctWords = 0;
    for (let i = 0; i < inputWords.length; i++) {
      if (inputWords[i] === sentenceWords[i]) {
        correctWords++;
      } else {
        break;
      }
    }

    const speed = Math.round(correctWords / minutes) || 0;
    setWpm(speed);
  };

  // Count errors live
  useEffect(() => {
    const sentenceWords = sentence.trim().split(/\s+/);
    const inputWords = input.trim().split(/\s+/);

    let errors = 0;
    for (let i = 0; i < inputWords.length; i++) {
      if (inputWords[i] !== sentenceWords[i]) {
        errors++;
      }
    }
    setErrorCount(errors);
  }, [input, sentence]);

  const handleInputChange = (e) => {
    const val = e.target.value;

    if (!timerActive && val.length > 0) {
      setTimerActive(true);
      setStartTime(Date.now());
    }

    if (val.trim() === sentence.trim()) {
      setIsFinished(true);
      setTimerActive(false);
      calculateWpm();
    }

    setInput(val);
  };

  const handleRestart = () => {
    const newSentence = pickRandomSentence();
    setSentence(newSentence);
    setInput("");
    setTimeLeft(SENTENCE_TIME);
    setTimerActive(false);
    setIsFinished(false);
    setWpm(0);
    setStartTime(null);
    setErrorCount(0);
    inputRef.current.focus();
  };

  // Split sentence into words for highlighting
  const renderSentence = () => {
    const sentenceWords = sentence.split(" ");
    const inputWords = input.split(" ");

    return sentenceWords.map((word, idx) => {
      let className = "";
      if (idx < inputWords.length) {
        className = inputWords[idx] === word ? "correct" : "incorrect";
      }
      return (
        <span key={idx} className={className}>
          {word}{" "}
        </span>
      );
    });
  };

  return (
    <div className="app">
      <div className="container">
        <h1>Typing Speed Tester</h1>

        <div className="sentence-display" aria-label="Sentence to type">
          {renderSentence()}
        </div>

        <textarea
          ref={inputRef}
          placeholder="Start typing here..."
          value={input}
          onChange={handleInputChange}
          disabled={isFinished || timeLeft === 0}
          rows={5}
          spellCheck="false"
        />

        <div className="info">
          <p>Time Left: {timeLeft}s</p>
          <p>Errors: {errorCount}</p>
          <p>WPM: {wpm}</p>
        </div>

        {(isFinished || timeLeft === 0) && (
          <button onClick={handleRestart}>Restart Test</button>
        )}
      </div>
    </div>
  );
}

export default App;
