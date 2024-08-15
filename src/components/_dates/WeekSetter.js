import {ArrowLeft, ArrowRight} from "@phosphor-icons/react";
import React, {useState} from "react";
import {useRootContext} from "../../contexts/RootContext";

const WeekSetter = ({onChange, hideWeekend, defaultDate}) => {
    const {locale} = useRootContext()

    if (!defaultDate) {
        defaultDate = new Date();
    }

    const [date, setDate] = useState(defaultDate);

    const day = date.getDay();
    const date_monday = date.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(structuredClone(date).setDate(date_monday));
    const days = [...Array(hideWeekend ? 5 : 7).keys()];
    const dates = [];
    days.forEach(day => {
        dates.push(new Date(structuredClone(date).setDate(date_monday + day)));
    });
    const last_day = new Date(structuredClone(date).setDate(monday.getDate() + days.length -1));

    return (
        <>
            <button className="btn btn-text"
                    onClick={() => setDate(prev => {
                        const newDate = date_monday - 7;
                        if (onChange) {
                            onChange(new Date(structuredClone(prev).setDate(newDate)));
                        }
                        return new Date(structuredClone(prev).setDate(newDate))
                    })}
            >
                <ArrowLeft/>
            </button>
            {monday.getDate()}.
            - {last_day.getDate()}. {locale._months_fullname[monday.getMonth()]} {monday.getFullYear()}

            <button className="btn btn-text"
                    onClick={() => setDate(prev => {
                        const newDate = date_monday + 7;
                        if (onChange) {
                            onChange(new Date(structuredClone(prev).setDate(newDate)));
                        }
                        return new Date(structuredClone(prev).setDate(newDate))
                    })}
            >
                <ArrowRight/>
            </button>
        </>
    )
};

export default WeekSetter;