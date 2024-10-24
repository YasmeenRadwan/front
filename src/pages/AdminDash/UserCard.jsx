function UserCard(data, setShowC, setDelet) {
  function delet() {
    if (data.role != "Admin") {
      data.setShowC(true);

      data.setDelet(data.id);
    }
  }

  return (
    <>
      <td className="text-start border border-gray-300 p-1">{data.name}</td>
      <td className="text-start border border-gray-300 p-1">{data.email}</td>
      <td className="align-middle border border-gray-300 p-1">{data.role}</td>
      <td className="align-middle border border-gray-300 p-1"><button className="text-primary-hover">
        <i className="fa-solid fa-user-slash" onClick={delet}></i>
      </button></td>
      
    </>
  );
}

export default UserCard;
