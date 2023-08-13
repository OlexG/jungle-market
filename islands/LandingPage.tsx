import Footer from "../components/Footer.tsx";

function Panel({
  title,
  description,
  image,
  isLeft,
}: {
  title: string;
  description: string;
  image: string;
  isLeft: boolean;
}) {
  return (
    <div className="flex flex-col w-1/2 items-center justify-center mx-auto mt-20 text-custom-gray pointer-events-auto">
      <div className="flex flex-row gap-8">
        {isLeft && <img src={image} className="h-[400px]" alt="Panel Image" />}
        <div className="flex flex-col">
          <h1 className="self-start text-xl">{title}</h1>
          <p className="font-light text-lg mt-4">{description}</p>
        </div>
        {!isLeft && <img src={image} className="h-[400px]" alt="Panel Image" />}
      </div>
    </div>
  );
}

export default function LandingPage() {
  return (
    <>
      <div className="relative w-screen h-[400px]">
        <div
          className="absolute w-screen h-full bg-center bg-cover flex flex-row items-center bg-no-repeat -z-20"
          style={{
            backgroundImage: "url('/art/landingPage1.jpeg')",
            pointerEvents: "none",
          }}
        />
        <div className="w-[400px] absolute -bottom-[160px] py-6 px-4 flex flex-col items-center justify-center bg-custom-bg self-end ml-[50px] mx-auto text-center rounded-t-lg transform transition-transform duration-300 text-white hover:text-custom-tan hover:-translate-y-3/4 z-10" style={
          {
            pointerEvents: "auto",
          }
        }>
          <div className="absolute top-0 left-0 right-0 h-10 flex items-center justify-center">
            <span className="text-4xl text-custom-tan font-bold animate-bounce mt-4">&#8593;</span>
          </div>
          <h1 className="text-4xl font-light text-custom-tan pt-10">
            Jungle Market
          </h1>
          <p className="text-xl text-custom-tan font-light mt-2">
            A simulated stocks trading app for kids.
          </p>
          <a className="mt-2 bg-custom-tan hover:bg-custom-light-tan text-white font-bold py-2 px-4 rounded-full" href="/home">
            Get Started
          </a>
        </div>
      </div>
      <div className="relative min-h-screen bg-custom-bg font-sans pointer-events-none pt-2 pb-20 z-20 border-t-1 border-gray-300 "
        style={{
          pointerEvents: "none",
        }}
      >
        <div className="pt-10 font-light text-5xl text-custom-tan text-center pointer-events-auto">
          <h1>Finance for Kids.</h1>
          <p className="text-lg">
            Teaching kids about investing has never been easier.
          </p>
        </div>

        <div className="flex flex-col items-center justify-center mx-auto mt-10 z-10 pointer-events-auto">
          <Panel
            title="Educational Value"
            description="In today's rapidly evolving digital world, financial literacy is more essential than ever. Jungle Market offers an unparalleled opportunity for children to get ahead by understanding the basics of stock trading. The platform is designed not just as a game but as a powerful educational tool. Through real-time simulation, your child will grasp fundamental financial concepts, market dynamics, and the importance of informed decision-making, all of which are crucial skills for their future."
            image="/art/landingPage2.png"
            isLeft={false}
          />
          <Panel
            title="Safe and Controlled Environment"
            description="We understand that the world of stock trading can be overwhelming and, at times, risky. That's why Jungle Market is engineered to be a risk-free zone. Here, your child can experiment, make mistakes, learn, and refine their strategies without any real-world financial consequences. With Jungle Market, you can be confident that while your child is navigating the intricacies of the stock market, they are doing so in a safe and controlled virtual environment."
            image="/art/landingPage3.png"
            isLeft={true}
          />
          <Panel
            title="Building Confidence for the Future"
            description="Beyond the immediate educational benefits, Jungle Market empowers children by boosting their confidence. By successfully navigating the simulated stock market, they not only acquire knowledge but also develop self-assurance in their abilities to make sound financial decisions. This confidence, coupled with a strong foundation in financial literacy, will set them on a path to make informed, strategic choices in real-life situations as they grow older, ensuring a secure and prosperous future."
            image="/art/landingPage4.png"
            isLeft={false}
          />
        </div>
      </div>
      <Footer />
    </>
  );
}
