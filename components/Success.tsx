interface IProps {
  message: string;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function SuccessAlert(props: IProps) {
  const { message, isOpen, setIsOpen } = props;

  if (!isOpen) {
    return null;
  }

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <div
      className="fixed top-0 flex justify-center z-50 w-full"
      style={{
        pointerEvents: "none",
      }}
    >
      <div
        className="bg-custom-light-green border border-custom-dark-green text-white py-2 px-4 rounded mt-4 flex flex-row items-center gap-1"
        role="alert"
      >
        <span className="block sm:inline">{message}</span>
        <button
          onClick={handleClose}
          className="py-2"
          style={{
            pointerEvents: "auto",
          }}
        >
          <svg
            className="fill-current h-6 w-6 text-white"
            role="button"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <title>Close</title>
            <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
