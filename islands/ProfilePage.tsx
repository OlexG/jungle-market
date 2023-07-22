import { useGraphQLQuery } from "../hooks/useGraphQLQuery.ts";
import { useEffect, useState } from "preact/hooks";
import { User } from "../routes/models/user.ts";
interface IProps {
  id: string;
}

interface OrderProps {
  numberOfShares: number;
  price: number;
  type: string;
  ticker: string;
}

function Order(props: OrderProps) {
  return (
    <div
      className={`${
        props.type === "buy" ? "bg-custom-dark-green" : "bg-custom-red"
      } rounded shadow flex flex-col justify-center flex-grow py-10 px-5 my-2`}
    >
      <h2 className="text-custom-off-white font-bold">${props.ticker}</h2>
      <p className="text-custom-off-white">Shares: {props.numberOfShares}</p>
      <p className="text-custom-off-white">Price: ${props.price}</p>
    </div>
  );
}

export default function ProfilePage(props: IProps) {
  const { data, error, loading } = useGraphQLQuery<{ user: User } | null>(
    `{
      user(id: "${props.id}") {
        name
        id
        icon
        orders {
          numberOfShares
          price
          type
          company {
            id
            name
            ticker
          }
        }
      } 
    }`
  );

  console.log(data, error, loading);

  const [isUser, setIsUser] = useState<boolean>(false);
  useEffect(() => {
    const user = localStorage.getItem("userData");
    if (user) {
      const parsedUser = JSON.parse(user);
      if (parsedUser.id === props.id) {
        setIsUser(true);
      }
    }
  }, [props.id]);

  return (
    <div className="bg-custom-dark-main h-screen pt-0.5 flex flex-row justify-center w-full gap-4 px-96">
      <div className="flex flex-col h-full pb-10">
        <div className="bg-custom-light-main w-96 h-30 rounded self-start mt-20 py-10 shadow flex flex-row items-center">
          <img
            className="w-20 h-20 rounded-full mx-5 z-10 border-2 shadow border-custom-white"
            src={data?.user.icon}
          />
          <div>
            <h1 className="font-bold text-custom-off-white text-xl">
              {data?.user.name}
            </h1>
            <p className="font-bold text-custom-off-white">In 4 classes</p>
            <div className="font-bold text-custom-off-white">
              <span>Total profits and losses: </span>
              <span className="text-custom-dark-green">$0.00</span>
            </div>
          </div>
        </div>
        <div className="bg-custom-light-main w-96 mt-5 rounded shadow flex flex-col flex-grow overflow-y-auto pt-5 px-5">
          <h1 className="text-custom-off-white text-xl font-bold mx-auto mb-5">
            Order History
          </h1>
          {data?.user.orders.map((order: any) => (
            <Order
              numberOfShares={order.numberOfShares}
              price={order.price}
              type={order.type}
              ticker={order.company.ticker}
            />
          ))}
        </div>
      </div>
      {isUser && (
        <div className="flex flex-col bg-custom-light-main w-96 mt-20 mb-10 rounded shadow flex-grow overflow-y-auto">
          <h1 className="text-custom-off-white text-xl font-bold mx-auto pt-5">
            Portfolio
          </h1>
        </div>
      )}
    </div>
  );
}
