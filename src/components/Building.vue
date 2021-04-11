<template>
  <section class="building">
    <div class="building__floor" v-for="floor in floorsArray" :key="floor">
      <span>{{floor + 1}}</span>
      <button class="floor__button button--flat button--up" v-if="floor !== floors - 1" v-on:click="requestElevator({floor, directionDown: false})" type="button">
        <img src="../assets/up.svg" alt="">
      </button>
      <button class="floor__button button--flat button--down" v-if="floor !== 0" v-on:click="requestElevator({floor, directionDown: true})" type="button">
        <img src="../assets/down.svg" alt="">
      </button>
    </div>
    <elevator :floors="floorsArray"/>
  </section>
</template>

<script>
import { mapActions } from 'vuex'
import Elevator from './Elevator'

export default {
  name: 'building',
  props: {
    floors: {
      type: Number,
      required: true
    }
  },
  components: {
    Elevator,
  },
  computed: {
    floorsArray() {
      return Array.from(Array(this.floors).keys()).reverse()
    },
  },
  methods: {
    ...mapActions(['requestElevator'])
  }
}
</script>

<style scoped lang="scss">
  .building {
    position: relative;
    display: inline-block;

    &__floor {
      width: 400px;
      height: 100px;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #5b6467;
      background-image: linear-gradient(315deg, #5b6467 0%, #8b939a 74%);

      & span {
        position: absolute;
        left: 130px;
        font-size: 24px;
      }

      .floor__button {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background-color: #f8f9d2;
        background-image: linear-gradient(315deg, #f8f9d2 0%, #e8dbfc 74%);

        & img {
          width: 20px;
          vertical-align: middle;
        }
      }
    }
  }
</style>
