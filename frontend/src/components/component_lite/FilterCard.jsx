import React, { useEffect, useState } from "react";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { useDispatch } from "react-redux";
import { setSearchedQuery } from "@/redux/jobSlice";

const filterData = [
  {
    filterType: "Location",
    array: [
      "Delhi",
      "Mumbai",
      "Kolhapur",
      "Pune",
      "Bangalore",
      "Hyderabad",
      "Chennai",
      "Remote",
    ],
  },
  {
    filterType: "Technology",
    array: [
      "Mern",
      "React",
      "Data Scientist",
      "Fullstack",
      "Node",
      "Python",
      "Java",
      "frontend",
      "backend",
      "mobile",
      "desktop",
    ],
  },
  {
    filterType: "Experience",
    array: ["0-3 years", "3-5 years", "5-7 years", "7+ years"],
  },
  {
    filterType: "Salary",
    array: ["0-50k", "50k-100k", "100k-200k", "200k+"],
  },
];

const Filter = () => {
  const [selectedValue, setSelectedValue] = useState("");
  const dispatch = useDispatch();

  const handleChange = (value) => {
    setSelectedValue(value);
  };

  useEffect(() => {
    dispatch(setSearchedQuery(selectedValue));
  }, [selectedValue, dispatch]);

  return (
    <div
      className="
      w-full 
      p-5 
      rounded-xl 
      bg-slate-800/70
      backdrop-blur-lg
      border border-indigo-500/20
      shadow-xl
      text-white
      "
    >
      <h1 className="font-bold text-xl mb-3 text-indigo-300">
        Filter Jobs
      </h1>

      <hr className="border-gray-600 mb-4" />

      <RadioGroup value={selectedValue} onValueChange={handleChange}>

        {filterData.map((data, index) => (
          <div key={index} className="mb-5">

            <h2 className="font-semibold text-lg text-gray-200 mb-2">
              {data.filterType}
            </h2>

            {data.array.map((item, indx) => {
              const itemId = `Id${index}-${indx}`;

              return (
                <div
                  key={itemId}
                  className="flex items-center space-x-2 my-2"
                >
                  <RadioGroupItem
                    value={item}
                    id={itemId}
                    className="border-gray-400 text-indigo-500"
                  />

                  <label
                    htmlFor={itemId}
                    className="text-sm text-gray-300 cursor-pointer hover:text-indigo-300"
                  >
                    {item}
                  </label>
                </div>
              );
            })}

          </div>
        ))}

      </RadioGroup>
    </div>
  );
};

export default Filter;