import React, {useEffect, useState} from "react";
import useDebounce from "../debounce";

function Search({ search }: { search: (value: string) => void }) {
    const [value, setValue] = useState('');
    const debouncedValue = useDebounce<string>(value, 500);

    useEffect(() => {
        if (debouncedValue?.length >= 3) {
            search(debouncedValue);
        }
    }, [debouncedValue])

    const input = (val: string) => {
        if (val?.length <= 0) {
            search('');
        }
        setValue(val);
    }

    return <span className='search-container'>
        <input autoComplete="off" value={value} onChange={event => input(event.target.value)}></input>
        { value?.length ? <span className='clear' onClick={() => {
            setValue('');
            search('');
        }}></span> : null }
    </span>
}

export default Search;