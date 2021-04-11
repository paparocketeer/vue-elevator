<template>
  <section>
    <div class="elevator" ref="elevator">
      <div class="elevator__door" ref="door"></div>
    </div>
    <div class="elevator__buttons">
      <button v-for="floor in floors" :key="floor" @click="onButtonPressed(floor)" class="elevator__button button--flat">
        {{floor + 1}}
      </button>
      <span>{{Math.round(current) + 1}}</span>
    </div>
  </section>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { TimelineLite } from 'gsap'
import ELEVATOR_STATUS from '../store/modules/elevator-status';

const timeline = new TimelineLite()

export default {
  name: 'elevator',
  props: {
    floors: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      current: 0,
    }
  },
  computed: {
    ...mapGetters(['currentFloor', 'status'])
  },
  watch: {
    currentFloor(newVal, oldVal) {
      this.goToCurrentFloor(Math.abs(oldVal - newVal));
    },
    current(newVal) {
      // console.log(newVal)
      // if (Number.isInteger(newVal)) {
        // console.log(newVal)
        this.setCurrent(newVal)
      // }
    }
  },
  methods: {
    ...mapActions(['onTravelEnded', 'requestElevator', 'setProcessingRequest', 'setStatus', 'processNextFromQueue', 'setCurrent']),
    onButtonPressed(floor) {
      if (floor !== this.currentFloor) {
        this.setProcessingRequest(true)
        floor > this.currentFloor ? this.requestElevator({floor, directionDown: false}) : this.requestElevator({floor, directionDown: true})        
      }
    },
    openDoor() {
      const { door } = this.$refs; 
      
      this.setStatus(ELEVATOR_STATUS.DOOR_WORKING);

      timeline.clear();

      timeline.to(door, {
        x: '100px',
        duration: 1,
        ease: "linear",
        onComplete: this.closeDoor
      }, 0);

      timeline.play();
    },
    closeDoor() {
      const { door } = this.$refs;

      timeline.clear();

      timeline.to(door, {
        x: '0px',
        duration: 1,
        ease: "linear",
        delay: 3,
        onComplete: this.onTravelEnded,
        onCompleteParams: [this.currentFloor],
      }, 0);

      timeline.play();
    },
    checkFloor() {
      this.current = this.currentFloor;
    },
    goToCurrentFloor(path) {
      const { elevator } = this.$refs;

      timeline.clear();

      timeline.to(elevator, {
        y: `${(this.currentFloor * -100)}px`,
        duration: path * 2,
        ease: "linear",
        onComplete: this.openDoor
      }, 0);

      timeline.to(this.$data, { 
        duration: path * 2, 
        current: this.currentFloor, 
        ease: "linear", 
        progress: 1,
        onComplete: this.checkFloor
      }, 0);

      timeline.play();
    }
  }
}
</script>

<style scoped lang="scss">
  .elevator {
    bottom: 0;
    right: -100px;
    width: 100px;
    height: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    background-color: #b8c6db;
    background-image: linear-gradient(315deg, #b8c6db 0%, #f5f7fa 74%);
    overflow: hidden;

    &__door {
      width: 100px;
      height: 100px;
      background-color: yellow;
    }

    &__buttons {
      grid-template-columns: 1fr 1fr;
      position: fixed;
      display: grid;
      grid-gap: 4px;
      padding: 4px;
      bottom: 0;
      right: 0;
      left: 100px;
      top: 100px;
      width: 200px;
      height: 200px;

      & span {
        position: absolute;
        top: -40px;
        left: 80px;
        width: 40px;
        height: 30px;
        border-radius: 10px;
        border: 1px solid;
        font-size: 24px;
        line-height: 30px;
      }
    }

    &__button {
      border-radius: 10px;
      border: 1px solid;
    }
  }
</style>