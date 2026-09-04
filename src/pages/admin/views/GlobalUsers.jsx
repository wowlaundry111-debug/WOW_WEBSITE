import React from 'react';
import { Mail, MapPin, Phone, Trash2 } from 'lucide-react';

export default function GlobalUsers({ users, deleteUser }) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-4xl font-black text-black uppercase">User Directory</h1>
          <p className="font-bold text-gray-500 mt-2">Managing {users.length} total users.</p>
        </div>
      </div>

      <div className="bg-white border-4 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] rounded-xl overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-gray-50 border-b-4 border-black">
                <th className="p-4 font-black uppercase text-sm">User</th>
                <th className="p-4 font-black uppercase text-sm">Role</th>
                <th className="p-4 font-black uppercase text-sm">Contact</th>
                <th className="p-4 font-black uppercase text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, i) => (
                <tr key={user._id} className={`hover:bg-[#9AE600]/10 transition-colors ${i !== users.length - 1 ? 'border-b-2 border-gray-200' : ''}`}>
                  <td className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-black text-white border-2 border-black rounded-full flex items-center justify-center font-black">
                        {user.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-black text-lg">{user.name}</p>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                          <MapPin size={12}/> {user.address || 'No Address'}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 border-2 border-black font-black text-xs uppercase ${
                      user.role === 'SuperAdmin' ? 'bg-purple-300' : 
                      user.role === 'ShopAdmin' ? 'bg-[#0D8DE3] text-white' : 
                      user.role === 'Delivery' ? 'bg-[#9AE600]' : 'bg-gray-200'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="p-4">
                    <p className="font-bold text-sm flex items-center gap-2"><Phone size={14} className="text-gray-400"/> {user.phone}</p>
                    <p className="font-bold text-sm flex items-center gap-2 mt-1"><Mail size={14} className="text-gray-400"/> {user.email}</p>
                  </td>
                  <td className="p-4">
                    <button 
                      onClick={() => { if(window.confirm('Delete user?')) deleteUser(user._id); }}
                      className="p-2 border-2 border-transparent hover:border-black hover:bg-red-500 hover:text-white rounded transition-all"
                    >
                      <Trash2 size={18}/>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
