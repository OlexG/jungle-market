import { useEffect, useState } from "preact/hooks";
interface IProps {
  texts: string[];
  name: string;
  setNextPanel: () => void;
  setPreviousPanel: () => void;
  setPanelNumber: (panelNumber: number) => void;
}
let typingInterval: any;
export default function TutorialMonkey(props: IProps) {

  const [showComponent, setShowComponent] = useState(false);

  useEffect(() => {
    const storedName = localStorage.getItem(props.name);
    if (storedName !== props.name) {
      setShowComponent(true);
      localStorage.setItem(props.name, props.name);
    } else {
      props.setPanelNumber(100)
    }
  }, [props.name]);

  if (!showComponent) {
    return null;
  }

  const imageArray: string[] = [
    "DALL_E_2023-08-15_11.28.01_-_Please_open_the_monkies_mouth-removebg-preview.png", // closed mouth
    "ilikebirds82_a_high_quality_picture_of_a_cartoon_monkey_with_gl_7dfb7f53-be0d-453d-b916-7a3475cebed7-removebg-preview.png", // open mouth
    "DALL_E_2023-08-15_11.30.12_-_Please_close_the_monkies_eyes-removebg-preview.png", // blink
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isTalking, setIsTalking] = useState(false);
  const { texts } = props;
  const [currentArrayText, setArrayCurrentText] = useState(0);
  const [text, setText] = useState(texts[currentArrayText]);
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  if (currentArrayText === texts.length) {
    return null 
  }

  const turnOnTalking = (numberOfCharacters: number) => {
    const duration = numberOfCharacters * 0.05 * 1000;
    setIsTalking(true);

    setTimeout(() => {
      setIsTalking(false);
    }, duration);
  };

  useEffect(() => {
    const numberOfCharacters = texts[currentArrayText].length;

    if (numberOfCharacters > 0) {
      turnOnTalking(numberOfCharacters);
    }
  }, [currentArrayText]);

  useEffect(() => {
    typingInterval = setInterval(() => {
      if (currentIndex < text.length) {
        setDisplayText((prevText) => prevText + text[currentIndex]);
        setCurrentIndex((prevIndex) => prevIndex + 1);
      } else {
        clearInterval(typingInterval);
      }
    }, 35);

    return () => clearInterval(typingInterval);
  }, [currentIndex, text]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * 2);
      setCurrentImageIndex(randomIndex);
    }, getRandomInterval(150, 250));

    const blinkIntervalId = setInterval(() => {
      setCurrentImageIndex(2);
      setTimeout(() => {
        setCurrentImageIndex(1);
      }, 500);
    }, 15000);

    return () => {
      clearInterval(intervalId);
      clearInterval(blinkIntervalId);
    };
  }, []);

  const pageForward = () => {
    if (currentArrayText === texts.length - 1) {
      setShowComponent(false);
    }
    setDisplayText("");
    try {
      clearInterval(typingInterval);
    } catch (e) {
      console.log(e)
    }
    setCurrentIndex(0);
    setArrayCurrentText(currentArrayText + 1);
    setText(texts[currentArrayText + 1]);
    props.setNextPanel();
  };

  const pageBackward = () => {
    if (currentArrayText === 0) {
      return;
    }
    setDisplayText("");
    try {
      clearInterval(typingInterval);
    } catch (e) {
      console.log(e)
    }
    setCurrentIndex(0);
    setArrayCurrentText(currentArrayText - 1);
    setText(texts[currentArrayText - 1]);
    props.setPreviousPanel();
  };

  const getRandomInterval = (min: number, max: number) => {
    return Math.random() * (max - min) + min;
  };
  return (
    <div className="bottom-0 fixed">
      <img
        className="w-100 h-100 my-4 mx-auto z-50 fixed bottom-4 left-0"
        src={`/art/tutorialMonkey/${imageArray[currentImageIndex]}`}
        alt="filler image"
      />
      <div
        className="w-full h-20 transform bg-custom-dark-main fixed z-10 bottom-0 right-0 flex justify-end items-center p-2"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.9)" }}
      >
        <div className="flex space-x-4">
          <button
            className="w-8 h-8 flex items-center justify-center bg-white rounded-full hover:bg-gray-200 mt-3 ml-2"
            onClick={pageBackward}
          >
            &#8592;
          </button>
          <button
            className="w-12 h-12 flex items-center justify-center bg-white rounded-full hover:bg-gray-200"
            onClick={pageForward}
          >
            &#8594;
          </button>
        </div>
      </div>

      <div
        className="w-80 bg-off-white fixed z-50 bottom-60 left-96 round-full border-1 border-gray-400"
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.97)",
          minHeight: "auto",
        }}
      >
        <p className="m-8 bold text-lg animate-typing ">{displayText}</p>
      </div>
    </div>
  );
}
