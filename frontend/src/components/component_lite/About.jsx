import React from "react";

const About = () => {
return ( <div className="flex items-center justify-center px-6 py-24">


  <div className="max-w-3xl w-full bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl p-10 text-center">

    <h1 className="text-4xl font-bold text-white mb-6">
      About HireFlow
    </h1>

    <p className="text-gray-300 leading-relaxed mb-6">
      HireFlow is a modern hiring platform designed to simplify the
      recruitment process for both recruiters and job seekers.
      Recruiters can post job opportunities and manage applicants,
      while candidates can discover and apply to jobs easily through
      a clean and intuitive interface.
    </p>

    <p className="text-gray-300 leading-relaxed mb-8">
      The platform focuses on scalable backend services and a smooth
      user experience, making the hiring workflow efficient and
      accessible.
    </p>

    <div className="border-t border-white/20 pt-6">
      <h2 className="text-xl font-semibold text-white mb-3">
        Creator
      </h2>

    <p className="text-2xl font-semibold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
  Harshit Wadiya
  </p>

      <p className="text-gray-400 text-sm mt-1">
        MCA Student | NIT Jamshedpur
      </p>
    </div>

  </div>

</div>

);
};

export default About;
