import { useEffect, useState } from "preact/hooks";

export default function TutorialMonkey() {
  const imageArray: string[] = [
    "DALL_E_2023-08-15_11.28.01_-_Please_open_the_monkies_mouth-removebg-preview.png", // closed mouth
    "ilikebirds82_a_high_quality_picture_of_a_cartoon_monkey_with_gl_7dfb7f53-be0d-453d-b916-7a3475cebed7-removebg-preview.png", // open mouth
    "DALL_E_2023-08-15_11.30.12_-_Please_close_the_monkies_eyes-removebg-preview.png", // blink
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const [isTalking, setIsTalking] = useState(false);

  let i = 0;
  let testing = "";
  for (; i < 10; i++) {
    testing += " This is for testing! ";
  }

  const turnOnTalking = (numberOfCharacters: number) => {
    const duration = numberOfCharacters * 0.05 * 1000;
    setIsTalking(true);

    setTimeout(() => {
      setIsTalking(false);
    }, duration);
  };

  useEffect(() => {
    const numberOfCharacters = testing.length;

    if (numberOfCharacters > 0) {
      turnOnTalking(numberOfCharacters);
    }
  }, []);

  const [text, setText] = useState(testing);
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const typingInterval = setInterval(() => {
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
    if (isTalking) {
      const intervalId = setInterval(() => {
        const randomIndex = Math.floor(Math.random() * 2);
        setCurrentImageIndex(randomIndex);
      }, getRandomInterval(150, 250));
  
      return () => {
        clearInterval(intervalId);
      };
    }
  }, [isTalking]);

  useEffect(() => {
    const blinkIntervalId = setInterval(() => {
      setCurrentImageIndex(2); 
      setTimeout(() => {
        setCurrentImageIndex(1); 
      }, 500);
    }, 15000);
  
    return () => {
      clearInterval(blinkIntervalId);
    };
  }, []);
  
    
  const getRandomInterval = (min: number, max: number) => {
    return Math.random() * (max - min) + min;
  };

  return (
    <div>
<img
  className="w-100 h-100 my-4 mx-auto z-50 absolute bottom-0 left-0"
  src={`/art/tutorialMonkey/${imageArray[currentImageIndex]}`}
  alt="filler image"
/>
      <div
        className="w-full h-20 transform bg-custom-dark-main absolute z-50 bottom-0 right-0 flex justify-end items-center p-2"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.9)" }}
      >
        <div className="flex space-x-4">
          <button className="w-8 h-8 flex items-center justify-center bg-white rounded-full hover:bg-gray-200 mt-3 ml-2">
            &#8592; 
          </button>
          <button className="w-12 h-12 flex items-center justify-center bg-white rounded-full hover:bg-gray-200">
            &#8594;
          </button>
        </div>
      </div>

      <div
        className="w-80 bg-off-white absolute z-50 bottom-60 left-96 round-full"
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
