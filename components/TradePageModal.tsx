interface ModalProps {
  type: string;
  amount: number;
  closeModal: () => void;
  executeOrder: Function;
  companyId: string;
  userId: string | null;
}

export default function Modal({
  type,
  amount,
  closeModal,
  executeOrder,
  companyId,
  userId
}: ModalProps) {

  return (
    <div className="text-custom-gray fixed z-50 inset-0 bg-white bg-opacity-90 flex items-center justify-center">
      <div className="shadow-lg bg-white rounded px-10 py-5 w-96 w-full text-center">
        <h2 className="text-2xl mb-2">
          {type === "buy" ? "Confirm Purchase" : "Confirm Sale"}
        </h2>
        <p className="mb-4">
          {`Are you sure you want to ${type} ${amount} shares?`}
        </p>
        <div className="w-full flex flex-row items-center justify-center">
          <button
            className="px-3 py-2 bg-red-600 text-white rounded mr-2 hover:bg-red-700"
            onClick={closeModal}
          >
            Cancel
          </button>
          <button
            className={`${
              amount === 0 ? "opacity-50" : ""
            } px-3 py-2 bg-green-600 text-white rounded ${
              amount === 0 ? "cursor-not-allowed" : "hover:bg-green-700"
            }`}
            onClick={() => {
              executeOrder(
                userId,
                companyId,
                amount,
                type === "buy" ? "buy" : "sell"
              );
              closeModal();
            }}
            disabled={amount === 0}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}