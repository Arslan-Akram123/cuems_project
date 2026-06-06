// src/components/UniversityFeeStructure.jsx
import { useParams } from 'react-router-dom';

const allFees = {
  MUL: [
    { program: 'BS - Artificial Intelligence', duration: '4 Years', fee: '47800', date: '25-12-2023' },
    { program: 'BS - Chemistry', duration: '4 Years', fee: '63800', date: '25-12-2023' },
    { program: 'B.Sc. [Engg.] - Civil', duration: '4 Years', fee: '56800', date: '15-08-2023' },
  ],
  UMT: [
     { program: 'BS - Computer Science', duration: '4 Years', fee: '95000', date: '01-09-2023' },
     { program: 'MS - Finance & Investment', duration: '2 Years', fee: '120000', date: '12-01-2024' },
  ],
  UCP: [
     { program: 'BS - Computer Science', duration: '4 Years', fee: '95000', date: '01-09-2023' },
     { program: 'MS - Finance & Investment', duration: '2 Years', fee: '120000', date: '12-01-2024' },
  ]
};

const UniversityFeeStructure = () => {
  const { universityId } = useParams();
  const fees = allFees[universityId] || [];

  return (
    <div className="overflow-x-auto">
      <div className="flex justify-end mb-4">
        <input type="text" placeholder="Search Fee..." className="w-full md:w-1/3 border-gray-300 rounded-md shadow-sm focus:border-teal-500 focus:ring-teal-500" />
      </div>
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-3 px-4 text-left font-semibold text-gray-600">Program</th>
            <th className="py-3 px-4 text-left font-semibold text-gray-600">Duration</th>
            <th className="py-3 px-4 text-left font-semibold text-gray-600">Fee</th>
            <th className="py-3 px-4 text-left font-semibold text-gray-600">Date</th>
            <th className="py-3 px-4 text-left font-semibold text-gray-600">Links</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {fees.map((item, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="py-3 px-4">{item.program}</td>
              <td className="py-3 px-4">{item.duration}</td>
              <td className="py-3 px-4">{item.fee}</td>
              <td className="py-3 px-4">{item.date}</td>
              <td className="py-3 px-4">
                <a href="#" className="text-teal-600 hover:underline">View Info</a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {fees.length === 0 && <p className="text-center text-gray-500 py-8">No fee structure found for this university.</p>}
    </div>
  );
};

export default UniversityFeeStructure;