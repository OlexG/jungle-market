import { useState } from "preact/hooks";
import Footer from "../components/Footer.tsx";

function Panel({
  title,
  description,
  image,
  isLeft,
  buttonText, // Assuming you pass the button text as a prop
  hasButton, // Boolean prop to conditionally show/hide the button
}: {
  title: string;
  description: string;
  image: string;
  isLeft: boolean;
  buttonText: string; // Adding buttonText as a prop
  hasButton: boolean; // Adding hasButton as a prop
}) {
  return (
    <div className="flex flex-col w-1/2 items-center justify-center mx-auto mt-20 text-custom-gray pointer-events-auto">
      <div className="flex flex-row gap-8">
        {isLeft && <img src={image} className="w-[300px]" alt="Panel Image" />}
        <div className="flex flex-col w-[300px] flex-shrink-0">
          <h1 className="self-start text-xl">{title}</h1>
          <p className="font-light text-lg mt-4">{description}</p>
          {hasButton && ( // Conditionally render the button based on hasButton
            <a
              className="bg-custom-tan w-3/5 hover:bg-custom-light-tan text-white font-bold py-2 px-4 rounded-full mt-2 ml-14 flex items-center justify-center"
              href="/home"
            >
              {buttonText}
            </a>
          )}
        </div>
        {!isLeft && <img src={image} className="h-[300px]" alt="Panel Image" />}
      </div>
    </div>
  );
}

function TriplePanel({ text, image }: { text: string; image: string }) {
  return (
    <div className="part w-1/5 p-2 flex flex-col justify-between items-center gap-4 h-66">
      <img
        src={image}
        className="max-w-full h-auto w-36 h-36 rounded-full flex-shrink-0"
      />
      <p className="mt-2 font-light text-lg mt-4">{text}</p>
    </div>
  );
}
export default function LandingPage() {
  const [isStarted, setIsStarted] = useState(true);

  const handleMouseEnter = () => {
    setIsStarted(false);
  };

  return (
    <>
      <div className="relative w-screen h-[350px] overflow-x-hidden">
        <div
          className="absolute w-screen bg-center bg-cover flex flex-row items-center bg-no-repeat -z-20"
          style={{
            backgroundImage: "url('/art/landingPage/landingPage1.jpeg')",
            pointerEvents: "none",
            backgroundPosition: "top",
            height: "100%",
          }}
        />
        {/*<div
          className="w-[400px] absolute -bottom-[160px] py-6 px-4 flex flex-col items-center justify-center bg-custom-bg self-end ml-[50px] mx-auto text-center rounded-t-lg transform transition-transform duration-300 text-white hover:text-custom-tan hover:-translate-y-3/4 z-10"
          style={{
            pointerEvents: "auto",
          }}
          onMouseEnter={handleMouseEnter}
        >
          <div className="absolute top-0 left-0 right-0 h-10 flex items-center justify-center">
            <span
              className={`text-4xl text-custom-tan font-bold mt-4 ${
                isStarted ? "animate-bounce" : ""
              }`}
            >
              &#8593;
            </span>
          </div>
          <h1 className="text-4xl font-light text-custom-tan pt-10">
            Jungle Market
          </h1>
          <p className="text-xl text-custom-tan font-light mt-2">
            A simulated stocks trading app for kids.
          </p>
          <a
            className="mt-2 bg-custom-tan hover:bg-custom-light-tan text-white font-bold py-2 px-4 rounded-full"
            href="/home"
          >
            Get Started!
          </a>
            </div>*/}
      </div>
      <div
        className="relative min-h-screen bg-custom-bg font-sans pointer-events-none pt-2 pb-20 z-20 border-t-1 border-gray-300 "
        style={{
          pointerEvents: "none",
        }}
      >
        <div className="pt-10 font-light text-5xl text-custom-tan text-center pointer-events-auto">
          <h1>Finance for Kids.</h1>
          <p className="text-lg">
            Teaching kids about investing has never been easier.
          </p>
          <a
            className="mt-2 bg-custom-tan hover:bg-custom-light-tan text-white font-bold py-2 px-4 rounded-full text-lg"
            href="/home"
          >
            Get Started!
          </a>
        </div>

        <div className="flex items-center justify-center mx-auto mt-10 gap-8">
          <TriplePanel
            text="Completely simulated yet realistic companies that are fun to trade"
            image="/art/articleArt/2/ilikebirds82_Cooreprate_meeting_with_cartoon_monkies_in_an_offi_fb228024-525b-44ff-8516-5ee408b720eb.png"
          />
          <TriplePanel
            text="Invest using virtual money that can be easily reset"
            image="/art/articleArt/3/ilikebirds82_A_group_of_cartoon_monkies_crying_with_cartoon_dol_25fb1e19-49a2-453c-96d0-49fa380961e0.png"
          />
          <TriplePanel
            text="Learn important concepts such as company fundamentals, news analysis, and much more!"
            image="/art/articleArt/2/ilikebirds82_cartoon_monkies_standing_with_their_hands_and_bala_fd8924b0-ea6c-4de3-bd0c-6da1202f3423.png"
          />
        </div>

        <div className="flex flex-col items-center justify-center mx-auto mt-10 z-10 pointer-events-auto">
          <Panel
            title="Educational Value"
            description="In our digital age, financial literacy is crucial. Jungle Market is not just a game; it's a powerful educational tool. Through real-time simulations, children learn stock trading basics, financial concepts, market dynamics, and decision-making skills. Prepare them for the future with Jungle Market."
            image="/art/landingPage/landingPage2.png"
            isLeft={false}
            hasButton={false}
            buttonText=""
          />
          <Panel
            title="Safe and Controlled Environment"
            description="We make stock trading safe and simple. Jungle Market is a risk-free zone where your child can experiment, learn, and refine strategies without real-world consequences. Trust that Jungle Market provides a safe and controlled environment for exploring the stock market."
            image="/art/landingPage/landingPage3.png"
            isLeft={true}
            hasButton={false}
            buttonText=""
          />
          <Panel
            title="Building Confidence for the Future"
            description="Jungle Market empowers kids beyond academics. Navigating our simulated stock market builds confidence, enhancing financial decision-making skills. This, combined with strong financial literacy, ensures a secure, prosperous future."
            image="/art/landingPage/landingPage4.png"
            isLeft={false}
            hasButton={false}
            buttonText=""
          />
        </div>
      </div>
      <Footer />
    </>
  );
}
