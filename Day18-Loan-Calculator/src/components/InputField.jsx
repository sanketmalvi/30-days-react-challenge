function InputField({ label, value, onChange }) {
  return (
    <div className="mb-4">
      <label className="block text-white/80 font-medium mb-2">{label}</label>
      <input
        type="number"
        className="w-full px-4 py-2 rounded-lg bg-white/70 text-gray-800 shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-300"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  );
}

export default InputField;
