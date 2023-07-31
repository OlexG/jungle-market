interface IProps {
  title: string;
  id: string;
  date: string;
}

const getTimeOutOfDate = (date: Date) => {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "pm" : "am";
  const hour = hours % 12;
  const minute = minutes < 10 ? `0${minutes}` : minutes;
  return `${hour}:${minute}${ampm}`;
}

export default function TradepageNewsComponent(props: IProps) {
  const createdAtDate = new Date(parseInt(props.date));
  return (
    <a className="flex flex-row border border-yellow-500 items-center justify-between rounded shadow py-4 transform hover:mx-2" href={`/news/${props.id}`}>
      <h1 className="text-xl text-custom-gray px-4">{props.title}</h1>
      <p className="text-white bg-yellow-500 rounded-l px-4 self-end">{getTimeOutOfDate(createdAtDate) + " " + createdAtDate.toLocaleDateString()}</p>
    </a>
  )
}