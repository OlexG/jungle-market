import { useGraphQLQuery } from "../hooks/useGraphQLQuery.ts";
import { useEffect, useState } from "preact/hooks";
import { User } from "../routes/models/user.ts";
import { makeCent } from "../generation/priceGeneration.ts";
// TODO: Look into properly rounding

interface IProps {
  id: string;
}

interface OrderProps {
  numberOfShares: number;
  price: number;
  type: string;
  ticker: string;
  companyID: string;
}

function Order(props: OrderProps) {
  return (
    <div
      className={`${
        props.type === "buy" ? "bg-custom-dark-green" : "bg-custom-red"
      } rounded shadow flex flex-col justify-center h-40 px-5 my-2 flex-shrink-0`}
    >
      <a href={`/${props.companyID}/trading`} className="underline text-custom-off-white font-bold">${props.ticker}</a>
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
        balance
        portfolio {
          numberOfShares
          totalSpent
          company {
            ticker
            name
            id
          }
        }
        orders {
          numberOfShares
          createdAt
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
        <div className="bg-custom-light-main shadow-lg shadow-gray-200 w-96 h-30 rounded self-start mt-20 py-10 shadow flex flex-row items-center">
          <img
            className="w-20 h-20 rounded-full mx-5 z-10 border-2 shadow border-custom-white"
            src={data?.user.icon}
          />
          <div>
            <h1 className="font-bold text-custom-off-white text-xl">
              {data?.user.name}
            </h1>
            <div className="font-bold text-custom-off-white">
              <span className="text-custom-off-white">Current balance: </span>
              <span className="text-custom-dark-green">
                {data?.user.balance ? '$' + makeCent(data.user.balance) : "$0.00"}
              </span>
            </div>
            <div className="font-bold text-custom-off-white">
              <span className="text-custom-off-white">Total profits and losses: </span>
              <span className="text-custom-dark-green">$0.00</span>
            </div>
          </div>
        </div>
        <div className="shadow-lg shadow-gray-200 bg-custom-light-main w-96 mt-5 rounded shadow flex flex-col flex-grow overflow-y-auto pt-5 px-5">
          <h1 className="text-custom-off-white text-xl font-bold mx-auto mb-5">
            Order History
          </h1>
          {data?.user.orders.sort((a, b) => {
            if (a.createdAt < b.createdAt) {
              return 1;
            }
            if (a.createdAt > b.createdAt) {
              return -1;
            }
            return 0;
          }).map((order, index) => (
            <Order
              key={index}
              numberOfShares={order.numberOfShares}
              price={order.price}
              type={order.type}
              ticker={order.company.ticker}
              companyID={order.company.id}
            />
          ))}
        </div>
      </div>
      {isUser && (
        <div className="shadow-lg shadow-gray-200 bg-custom-light-main w-96 mt-20 rounded shadow flex flex-col flex-grow overflow-y-auto pt-5 px-5 mb-10">
          <h1 className="text-custom-off-white text-xl font-bold mx-auto mb-5">
            Portfolio
          </h1>
          {
            data?.user.portfolio.map((stock, index) => (
              <div className="bg-custom-light-green rounded shadow flex flex-col justify-center py-10 px-5 my-2 h-46 flex-shrink-0">
                <a href={`/${stock.company.id}/trading`} className="text-custom-off-white font-bold underline">{stock.company.name}</a>
                <p className="text-custom-off-white">Shares: {stock.numberOfShares}</p>
                <p className="text-custom-off-white">Total spent: ${makeCent(stock.totalSpent)}</p> 
              </div>
            ))
          }
        </div>
      )}
    </div>
  );
}
