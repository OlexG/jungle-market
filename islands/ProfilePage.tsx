import { useGraphQLQuery } from "../hooks/useGraphQLQuery.ts";
import { useEffect, useState } from "preact/hooks";
import { User } from "../routes/models/user.ts";
import { makeCent } from "../generation/priceGeneration.ts";
import { IS_BROWSER } from "$fresh/runtime.ts";
import useuserId from "../hooks/useUserID.ts";
// TODO: Look into properly rounding

interface IProps {
  id: string;
}

interface OrderProps {
  numberOfShares: number;
  price: number;
  type: string;
  ticker: string;
  companyId: string;
}

function Order(props: OrderProps) {
  return (
    <div
      className={`${
        props.type === "buy" ? "bg-custom-dark-green" : "bg-custom-red"
      } rounded shadow flex flex-col justify-center h-40 px-5 my-2 flex-shrink-0`}
    >
      <a href={`/${props.companyId}/trading`} className="underline text-custom-off-white font-bold">${props.ticker}</a>
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

  const userId = useuserId();
  const isUser = userId === props.id;


  return (
    <div className="bg-gray-200 h-screen pt-0.5 flex flex-row justify-center w-full gap-4 px-96">
      <div className="flex flex-col h-full pb-10">
        <div className="bg-white shadow-lg shadow-gray-200 w-96 h-30 rounded self-start mt-20 py-10 shadow flex flex-row items-center">
          <img
            className="w-20 h-20 rounded-full mx-5 z-10 border-2 shadow border-custom-light-main"
            src={data?.user.icon}
          />
          <div>
            <h1 className="font-bold text-custom-light-main text-xl">
              {data?.user.name}
            </h1>
            <div className="font-bold text-custom-light-main">
              <span className="text-custom-light-main">Current cash balance: </span>
              <span className="text-custom-dark-green">
                {data?.user.balance ? '$' + makeCent(data.user.balance) : "$0.00"}
              </span>
            </div>
            <div className="font-bold text-custom-light-main">
              <span className="text-custom-light-main">Total profits and losses: </span>
              <span className="text-custom-dark-green">$0.00</span>
            </div>
          </div>
        </div>
        <div className="shadow-lg bg-white w-96 mt-5 rounded shadow flex flex-col flex-grow overflow-y-auto pt-5 px-5">
          <h1 className="text-custom-light-main text-xl font-bold mx-auto mb-5">
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
              companyId={order.company.id}
            />
          ))}
        </div>
      </div>
      {isUser && (
        <div className="shadow-lg shadow-gray-200 bg-white w-96 mt-20 rounded shadow flex flex-col flex-grow overflow-y-auto pt-5 px-5 mb-10">
          <h1 className="text-custom-light-main text-xl font-bold mx-auto mb-5">
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
