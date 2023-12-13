import { useState } from "react";

export default function Setting({ name, type, data, state }: { name: string, type: string, data: any, state: (value: any) => void }) {
    const [rangeValue, setRangeValue] = useState(data != null ? data.min : 0);
    const [checkboxValue, setCheckboxValue] = useState(false);

    function handleRangeChange(event: any) {
        const newRangeValue = parseInt(event.target.value);
        setRangeValue(newRangeValue)
        state(newRangeValue);
    }

    function handleBooleanChange() {
        state(!checkboxValue ? data.true : data.false);
        setCheckboxValue(!checkboxValue);
    }

    const getElement = () => {
        switch (type) {
            case "number":
                return (
                    <input className="w-full" type="number" />
                );
            case "range":
                return (
                    <>
                        <div className="setting-data flex justify-between mb-1">
                            <h3 className="text-xl accent-to-primary-text">{name}</h3>
                            <h4 className="text-xl text-white/60">{data.prefix + rangeValue + data.suffix}</h4>
                        </div>
                        <input
                            className="w-full"
                            type="range"
                            value={rangeValue}
                            min={data.min}
                            max={data.max}
                            step={data.step}
                            onChange={event => handleRangeChange(event)}
                        />
                    </>

                );
            case "boolean":
                return (
                    <>
                        <div className="setting-data flex justify-between mb-2">
                            <h3 className="text-xl accent-to-primary-text">{name}</h3>
                            <h4 className="text-xl text-white/60">{checkboxValue ? data.true : data.false}</h4>
                        </div>
                        <button className="w-full font-light bg-[#306EB5]/40 hover:bg-[#306EB5]/50 duration-200 rounded"
                            onClick={() => handleBooleanChange()}
                        >Click To Toggle</button>
                    </>
                );
            case "list":
                return (
                    <>
                        <div className="setting-data flex justify-between mb-2">
                            <h3 className="text-xl accent-to-primary-text">{name}</h3>
                        </div>
                        <select className="bg-transparent w-full">
                            <option value="">--Please choose an option--</option>
                            {
                                (data.modes as string[]).map((mode, index) => {
                                    return (
                                        <option key={index} value={mode}>{mode}</option>
                                    )
                                })
                            }
                        </select>
                    </>
                )
            default:
                return (
                    <p>error {name}</p>
                );
        }
    }

    return (
        <>
            <div className="setting bg-black/10 border border-white/20 rounded-md p-2">
                {
                    getElement()
                }
            </div>
        </>
    )
}