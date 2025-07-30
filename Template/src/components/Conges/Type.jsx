import { useState } from "react";

export default function Type({ lists, setRadioValue }) {
  const [selectedValue, setSelectedValue] = useState("");

  const getValue = (e) => {
    setSelectedValue(e.target.value); 
    setRadioValue(e.target.value)
  }; 
  return (
    <div className="grid grid-cols bg-white p-5 rounded-lg">
      {lists &&
        lists.map((list, key) => (
          <div className="flex mt-3 mb-3 items-center gap-5" key={key}>
            <div className="flex items-center h-5">
              <input
                id={key}
                aria-describedby="helper-radio-text"
                type="radio"
                value={list.valeur}
                name="type"
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500  focus:ring-2 " 
                onChange={getValue} 
                checked={selectedValue === list.valeur}
              />
            </div>
            <div className="ms-2 text-sm">
              <label
                htmlFor="helper-radio"
                className="font-medium text-lg font-semibold"
              >
                {" "}
                {list.name}{" "}
              </label>
              <p
                id="helper-radio-text"
                className="text-md font-normal text-gray-500 "
              >
                {list.label}
              </p>
            </div>
          </div>
        ))}
    </div>
  );
}
