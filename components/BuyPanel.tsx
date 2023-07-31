interface IProps {
  handleBuyClick: () => void;
  handleSellClick: () => void;
  handleInputNumberChange: (e: any) => void;
  amount: number;
}

export default function BuyPanel(props: IProps) {
  return (
    <div className="rounded border border-red-500 bg-white flex flex-col items-center pb-4 shadow-lg">
      <div className="flex flex-row h-10 gap-3 mt-5">
        <button
          className="bg-custom-light-green hover:bg-green-700 px-8 py-2 text-white rounded font-bold"
          onClick={props.handleBuyClick}
        >
          Buy
        </button>
        <button
          className="bg-red-600 hover:bg-red-500 px-8 py-2 text-white rounded font-bold"
          onClick={props.handleSellClick}
        >
          Sell
        </button>
      </div>
      <h1 className="text-custom-gray text-lg mt-5">Amount</h1>
      <input
        className="w-20 p-2 rounded-md shadow bg-white hover:scale-105 flex flex-row items-center justify-center border border-red-500"
        type="number"
        step="1"
        onChange={(e) => props.handleInputNumberChange(e)}
        value={props.amount}
      />
    </div>
  );
}
