export default function TableHeader({colsName}) {
  return (
    <th scope="col" className="px-6 py-3">
      {colsName}
    </th>
  );
}
