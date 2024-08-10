// import React from 'react';

const Table = () => (
  <div className="overflow-x-auto p-4">
    <table className="min-w-full bg-gray-800 text-white">
      <thead>
        <tr>
          <th className="py-2 px-4 border-b">Header 1</th>
          <th className="py-2 px-4 border-b">Header 2</th>
          <th className="py-2 px-4 border-b">Header 3</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="py-2 px-4 border-b">Data 1</td>
          <td className="py-2 px-4 border-b">Data 2</td>
          <td className="py-2 px-4 border-b">Data 3</td>
        </tr>
        <tr>
          <td className="py-2 px-4 border-b">Data 4</td>
          <td className="py-2 px-4 border-b">Data 5</td>
          <td className="py-2 px-4 border-b">Data 6</td>
        </tr>
        {/* Add more rows as needed */}
      </tbody>
    </table>
  </div>
);

export default Table;
