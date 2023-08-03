interface IProps {
  id: string;
  title: string;
  createdAt: string;
  companyId: string;
  companyTicker: string;
  companyName: string;
}

const getTimeOutOfDate = (date: Date) => {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "pm" : "am";
  const hour = hours % 12;
  const minute = minutes < 10 ? `0${minutes}` : minutes;
  return `${hour}:${minute}${ampm}`;
}

export default function NewsStoriesPageComponent(props: IProps) {
  const createdAtDate = new Date(parseInt(props.createdAt));
  return (
    <a
      className="mx-10 text-custom-grey flex mt-4 flex-row border border-custom-light-green items-center justify-between rounded shadow py-4
      hover:bg-custom-light-green hover:text-white hover:border-custom-light-green hover:shadow-lg"
      href={`/news/${props.id}`}
    >
      <div>
        <h1 className="text-xl px-4">{props.title}</h1>
        <h1 className="px-4">
          ${props.companyTicker} - {props.companyName}
        </h1>
      </div>
      <p className="h-full text-white bg-custom-light-green rounded-l px-4 self-end flex flex-row items-center justify-center">
        {getTimeOutOfDate(createdAtDate) +
          " " +
          createdAtDate.toLocaleDateString()}
      </p>
    </a>
  );
}
