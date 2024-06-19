export const TIMETRACKER_ACTIONS = {
    START: "START",
    STOP: "STOP",
    SET_START: "SET_START"
};

export const timetrackerReducer = (state, {action, ...args}) => {
    switch (action) {
        case TIMETRACKER_ACTIONS.SET_START: {
            const {start, taskId} = args;
            return {
                start: start,
                taskId: taskId
            };
        }

        case TIMETRACKER_ACTIONS.START: {
            const {taskId} = args;
            return {
                start: (new Date()).getTime() - ((new Date()).getTimezoneOffset() * 60000),
                taskId: taskId
            };
        }

        case TIMETRACKER_ACTIONS.STOP: {
            return {
                start: null,
                taskId: null
            };
        }

        default:
            return state;
    }
};
