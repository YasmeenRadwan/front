import UserCard from "./UserCard";
import { useState } from "react";
function UsersTable({ users, setDelet, setShowC }) {
   
  const tableHeaders = ["Name", "Email", "Role", "Delete"];
  return (
    <table className="w-full mt-5 table-auto overflow-x-auto border-collapse border border-gray-200 text-[14px] md:text-[16px] text-center">
      <thead>
        <tr className="bg-gray-100">
          {tableHeaders.map((head) => (
            <th key={head} className="border border-gray-300 text-start py-2 px-1">
              {head}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {users.map((user,index) => (
          <tr key={user._id} className="bg-white border-b p-1">
            <UserCard
              setDelet={setDelet}
              id={user._id}
              key={user._id}
              user={user}
              order={index}
              name={user.firstName + " " + user.lastName}
              role={user.role}
              email={user.email}
              setShowC={setShowC}
            />
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default UsersTable;
