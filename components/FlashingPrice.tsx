import { useEffect, useState } from "preact/hooks";

const FlashingPrice = ({ price }: {
  price: number | undefined;
}) => {
  const [greenFlash, setGreenFlash] = useState(false);
  const [redFlash, setRedFlash] = useState(false);
  const [previousPrice, setPreviousPrice] = useState(0);
  useEffect(() => {
    if (price === undefined) {
      return;
    }

    if (price >= previousPrice) {
      setGreenFlash(true);
      setRedFlash(false);
    } else {
      setGreenFlash(false);
      setRedFlash(true);
    }
    const timer = setTimeout(() => {
      setGreenFlash(false);
      setRedFlash(false);
      setPreviousPrice(price);
    }, 1000); // match the duration of the animation

    // Cleanup function to clear the timer when the component unmounts
    return () => clearTimeout(timer);
  }, [price]);

  return (
    <span className={`text-custom-dark-green ${greenFlash ? 'flash-green' : ''} ${redFlash ? 'flash-red' : ''}`}>
      $
      {price}
    </span>
  );
};

export default FlashingPrice;