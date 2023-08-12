import Header from "./Header.tsx";

export default function AdminPanel() {
  const sendClearRequest = () => {
    const adminKey = document.querySelector("input")?.value;
    if (adminKey) {
      fetch("/api/clearAllRecords", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Admin-Key': adminKey,
        },
      });
    }
  }

  const sendAddRequest = () => {
    const adminKey = document.querySelector("input")?.value;
    if (adminKey) {
      fetch("/api/addAllRecords", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Admin-Key': adminKey,
        },
      });
    }
  }

  return (
    <div className="mt-16 p-4 flex flex-col items-center gap-4">
      <input className="border-black border-2 p-1" type="text" placeholder="Enter admin key"/>
      <button onClick={sendClearRequest} className="border-black border-2 p-4">Clear all records</button>
      <h1>When creating records, call this one a few times, it might fail</h1>
      <button onClick={sendAddRequest} className="border-black border-2 p-4">Refill companies and add news story</button>
    </div>
  );
}
