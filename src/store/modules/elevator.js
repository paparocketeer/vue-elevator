import ELEVATOR_STATUS from "./elevator-status";

const state = {
  currentFloor: 0,
  processingRequest: false,
  status: ELEVATOR_STATUS.INITIAL,
  queue: [],
  current: 0
};

const getters = {
  currentFloor: (state) => state.currentFloor,
  current: (state) => state.current,
  isQueueEmpty: (state) => state.queue.length === 0,
  firstFromQueue: (state) => state.queue[0],
  status: (state) => state.status,
  queue: (state) => state.queue,
  processingRequest: (state) => state.processingRequest,
  isOnLazyState: (state) =>
    state.status === ELEVATOR_STATUS.INITIAL ||
    state.status === ELEVATOR_STATUS.TRAVEL_ENDED,
  isMoving: (state) =>
    state.status === ELEVATOR_STATUS.ON_TRAVEL_UP ||
    state.status === ELEVATOR_STATUS.ON_TRAVEL_DOWN
};

let timeoutId = null;

const actions = {
  requestElevator: ({ dispatch, commit, getters }, {floor, directionDown}) => {
    if (getters.isOnLazyState) {
      if (floor !== 0) {
        dispatch("goToFloor", floor);
      } else {
        commit("setStatus", ELEVATOR_STATUS.WAITING_FOR_INPUT);
      }
      return;
    }

    if (!getters.queue.includes(floor)) {
      console.log('directionDown ' + directionDown);
      commit("addToQueue", floor);
      // getters.status === ELEVATOR_STATUS.ON_TRAVEL_UP && getters.current < floor ? commit("addToQueueAsc", floor) : commit("addToQueue", floor);
      // getters.status === ELEVATOR_STATUS.ON_TRAVEL_DOWN && getters.current > floor ? commit("addToQueueDesc", floor) : commit("addToQueue", floor);
    }
  },
  goToFloor: ({ commit, getters }, floor) => {
    clearTimeout(timeoutId);
      floor > getters.currentFloor ? commit("setStatus", ELEVATOR_STATUS.ON_TRAVEL_UP) : commit("setStatus", ELEVATOR_STATUS.ON_TRAVEL_DOWN)
      commit("goToFloor", floor);    
  },
  processNextFromQueue: ({ commit, dispatch, getters }) => {
    const nextFloor = getters.firstFromQueue;

    if (nextFloor !== undefined) {
      commit("removeFromQueue");
    }

    if (nextFloor !== getters.currentFloor) {
      dispatch("goToFloor", nextFloor || 0);

      if (!nextFloor) {
        commit("setStatus", ELEVATOR_STATUS.TRAVEL_ENDED);
      }
    }
  },
  onTravelEnded: ({ commit, dispatch, getters }, floor) => {
    if (getters.processingRequest || floor === 0) {
      const nextStatus =
        getters.firstFromQueue === floor
          ? ELEVATOR_STATUS.WAITING_FOR_INPUT
          : ELEVATOR_STATUS.TRAVEL_ENDED;

      commit("setProcessingRequest", false);
      commit("setStatus", nextStatus);
      dispatch("processNextFromQueue");

      return;
    }

    commit("setStatus", ELEVATOR_STATUS.WAITING_FOR_INPUT);

    timeoutId = setTimeout(() => {
      dispatch("processNextFromQueue");
    }, 2000);
  },
  setProcessingRequest: ({ commit }, value) => {
    commit("setProcessingRequest", value);
  },
  setStatus: ({ commit }, value) => {
    commit("setStatus", value);
  },
  setCurrent: ({ commit }, value) => {
    commit("setCurrent", value);
  },
};

const mutations = {
  goToFloor: (state, floor) => (state.currentFloor = floor),
  setStatus: (state, status) => (state.status = status),
  setCurrent: (state, current) => (state.current = current),
  addToQueue: (state, floor) => (state.queue.push(floor)),
  addToQueueAsc: (state, floor) => {
    state.queue.push(floor)
    state.queue.sort((a,b) => a - b)
  },
  addToQueueDesc: (state, floor) => {
    state.queue.push(floor)
    state.queue.sort((a,b) => b - a)
  },
  addBeforeQueue: (state, floor) => (state.queue.unshift(floor)),
  setProcessingRequest: (state, value) => (state.processingRequest = value),
  removeFromQueue: (state) => {
    state.queue.shift();
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
