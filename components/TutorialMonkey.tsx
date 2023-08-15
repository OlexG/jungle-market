import { useState, useEffect } from "preact/hooks";

export default function TutorialMonkey() {
  const imageArray: string[] = [
    "DALL_E_2023-08-15_11.28.01_-_Please_open_the_monkies_mouth-removebg-preview.png", // closed mouth
    "ilikebirds82_a_high_quality_picture_of_a_cartoon_monkey_with_gl_7dfb7f53-be0d-453d-b916-7a3475cebed7-removebg-preview.png", // open mouth
    "DALL_E_2023-08-15_11.30.12_-_Please_close_the_monkies_eyes-removebg-preview.png", // blink
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);


  const [isTalking, setIsTalking] = useState(false);

  useEffect(() => {
    let randomIndex = 0;
    const intervalId = setInterval(() => {
      randomIndex = Math.floor(Math.random() * 2);
      setCurrentImageIndex(randomIndex);
    }, getRandomInterval(250, 500));

    const timeoutId = setTimeout(() => {
      setCurrentImageIndex(2); 
      const restoreImageIndex = setTimeout(() => {
        setCurrentImageIndex(randomIndex);
      }, 1000);

      return () => {
        clearInterval(intervalId);
        clearTimeout(restoreImageIndex);
      };
    }, 20000); 

    return () => {
      clearInterval(intervalId);
      clearTimeout(timeoutId);
    };
  }, []);

  const getRandomInterval = (min: number, max: number) => {
    return Math.random() * (max - min) + min;
  };

  return (
    <img
    className="w-100 h-100 my-4 mx-auto z-50 absolute bottom-0 left-0"
    src={
      isTalking
        ? `/art/tutorialMonkey/${imageArray[currentImageIndex]}`
        : `/art/tutorialMonkey/${imageArray[1]}`
    }
    alt="Monkey"
  />
  );
}
