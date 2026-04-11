import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import { Button } from "../ui/button";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setSearchedQuery } from "@/redux/jobSlice";

const Category = [
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "MERN Developer",
  "Data Scientist",
  "DevOps Engineer",
  "Machine Learning Engineer",
  "Artificial Intelligence Engineer",
  "Cybersecurity Engineer",
  "Product Manager",
  "UX/UI Designer",
  "Graphic Designer",
  "Video Editor",
];

const Categories = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const searchjobHandler = (query) => {
    dispatch(setSearchedQuery(query));
    navigate("/browse");
  };

  return (
    <div className="mt-20">
      {/* HEADING */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-center text-white">
          Categories
        </h1>
        <p className="text-center text-gray-300">
          Explore our extensive job market
        </p>
      </div>

      {/* CAROUSEL */}
      <Carousel className="w-full max-w-3xl mx-auto">
        <CarouselContent>
          {Category.map((category, index) => (
            <CarouselItem
              key={index}
              className="basis-1/2 md:basis-1/3 flex justify-center"
            >
              <Button
                onClick={() => searchjobHandler(category)}
                className="
                  bg-white/10 backdrop-blur-md text-white 
                  border border-white/20
                  hover:bg-indigo-600 hover:text-white
                  transition-all duration-200
                "
              >
                {category}
              </Button>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* ARROWS */}
        <CarouselPrevious className="bg-white/20 text-white hover:bg-white/30" />
        <CarouselNext className="bg-white/20 text-white hover:bg-white/30" />
      </Carousel>
    </div>
  );
};

export default Categories;
