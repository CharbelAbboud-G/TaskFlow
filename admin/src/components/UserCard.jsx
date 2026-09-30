function UserCard({ name, role }) {
  return (
    <div>
      <h2>{name}</h2>
      <p>Role: {role}</p>
    </div>
  );
}

export default UserCard;