function RadioBtns({ selected, setSelected, handleChange, header, data }) {
  return (
    <div className="paymentDelivery-container p-4">
      <label className="text-lg font-semibold mb-4 ">Choose {header} Method</label>
      <div className="flex flex justify-start items-center gap-4">
        {/* Cash Option */}
        {data.map((ele) => {
          return (
            <label key={ele.value} className="flex items-center space-x-3">
              <input
                type="radio"
                value={ele.value}
                checked={selected === ele.value}
                onChange={handleChange}
                className="form-radio h-5 w-5 text-indigo-600"
              />
              <span className="text-gray-700">{ele.label}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
}

export default RadioBtns;
