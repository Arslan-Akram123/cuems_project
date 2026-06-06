// src/components/UniversityPrograms.jsx
import { useParams } from 'react-router-dom';

const allPrograms = {
  MUL: ["BS Biotechnology", "BS Botany", "BS Software Engineering", "BS Mathematics", "BS Public Administration", "BS Statistics"],
  UMT: ["BS Electrical Engineering", "BS Computer Science", "BSc (Honours) in Management Science", "BA (Honours) in English", "BA-LL.B (Honours)"],
  UCP: ["BS Computer Science", "BS Mathematics", "BS Physics", "BS Chemistry", "BS Biology"]
};

const UniversityPrograms = () => {
    const { universityId } = useParams();
    const programs = allPrograms[universityId] || [];
    
    return (
        <div>
            <div className="flex justify-end mb-4">
                <input type="text" placeholder="Search Programs..." className="w-full md:w-1/3 border-gray-300 rounded-md shadow-sm focus:border-teal-500 focus:ring-teal-500"/>
            </div>
            {programs.length > 0 ? (
                <div className="flex flex-wrap gap-3">
                    {programs.map((program, index) => (
                        <span key={index} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-full font-medium cursor-pointer hover:bg-teal-200">
                            {program}
                        </span>
                    ))}
                </div>
            ) : (
                <p className="text-center text-gray-500 py-8">No programs found for this university.</p>
            )}
        </div>
    );
};

export default UniversityPrograms;