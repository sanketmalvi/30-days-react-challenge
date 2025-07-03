function AmortizationTable({ data }) {
  return (
    <div className="overflow-auto mt-6 max-h-80">
      <table className="w-full text-sm text-white">
        <thead className="bg-white/10">
          <tr>
            <th className="p-2">Month</th>
            <th>EMI</th>
            <th>Principal</th>
            <th>Interest</th>
            <th>Balance</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.month} className="text-center border-b border-white/10">
              <td className="p-2">{row.month}</td>
              <td>₹{row.emi}</td>
              <td>₹{row.principal}</td>
              <td>₹{row.interest}</td>
              <td>₹{row.balance}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AmortizationTable;
