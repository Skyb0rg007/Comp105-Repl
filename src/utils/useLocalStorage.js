import React from 'react';

// Can store anything that is JSON-serializable
export const useLocalStorage = (key, initialValue) => {
    const [value, setValueReal] = React.useState(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (e) {
            console.log(e);
            return initialValue;
        }
    });
    const setValue = val => {
        if (val instanceof Function)
            val = val(value);
        setValueReal(val);
        window.localStorage.setItem(key, JSON.stringify(val));
    };
    return [value, setValue];
};

