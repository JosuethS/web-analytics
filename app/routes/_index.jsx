import React, { useEffect, useState } from 'react';

export const meta = () => {
  return [
    { title: "Testing Web Analytics" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

const Index = () => {

  return (
    <div className="p-4">
      <header className="text-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          Testing Web Analytics
        </h1>
      </header>
    </div>
  );
};

export default Index;
