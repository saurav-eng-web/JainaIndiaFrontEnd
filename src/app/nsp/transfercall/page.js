'use client';
import { useTheme } from '@/theme/ThemeContext';
import SideBar from '@/components/SideBar';


export default function TransferCallForm() {

      const { colors } = useTheme();
  return (

    
    <div className="flex min-h-screen bg-white ml-40">
      <div className="w-full max-w-2xl p-6">
        {/* Title */}
        <h2 className="text-lg font-semibold mb-6">Transfer Call</h2>

        {/* Form */}
        <form className="grid grid-cols-2 gap-6">
          {/* Name */}
          <div className="flex flex-col">
            <label className="mb-2 text-sm font-medium">Job Id</label>
            <input
              type="text"
              placeholder="Input Field"
              className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          {/* Email */}
          <div className="flex flex-col">
            <label className="mb-2 text-sm font-medium">Asc Name</label>
            <select
              className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
            >
              <option>Dropdown</option>
              <option>test1@example.com</option>
              <option>test2@example.com</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="col-span-2 flex justify-center gap-4 mt-4">
            <button
              type="button"
              className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 transition" style={{background:colors.primary}}
            >
              Back
            </button>
            <button
              type="submit"
              className="text-white px-6 py-2 rounded-md hover:bg-gray-800 transition" style={{background:colors.primary}}
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
