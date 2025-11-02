<template>
  <div class="homeNumBox">
    <div class="numBox">
      <li
        :class="{
          'number-item': !isNaN(item),
          'mark-item': isNaN(item),
        }"
        v-for="(item, index) in orderNum"
        :key="index"
      >
        <span v-if="!isNaN(item)">
          <i ref="numItems">0123456789</i>
        </span>
        <span class="comma" v-else>{{ item }}</span>
      </li>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      // 传入数字
      num: {
        type: [String, Number],
        default: undefined,
      },
    },
    watch: {
      num: {
        handler(newVal, oldVal) {
          if (newVal != undefined && newVal != null && newVal != 0) {
            this.$nextTick(() => {
              let res = newVal.toString()
              this.toOrderNum(res)
              this.setNumberTransform()
            })
          }
        },
        immediate: true,
      },
    },
    data() {
      return {
        orderNum: ['0', '0', '0'],
      }
    },
    methods: {
      toOrderNum(num) {
        this.orderNum = num.split('')
      },
      setNumberTransform() {
        const numberItems = this.$refs.numItems
        const numberArr = this.orderNum.filter((item) => !isNaN(item))

        for (let index = 0; index < numberItems.length; index++) {
          const elem = numberItems[index]
          elem.style.transform = `translate(-50%, -${numberArr[index] * 10}%)`
        }
      },
    },
  }
</script>

<style lang="scss" scoped>
  .homeNumBox {
    display: inline-block;
  }

  .numBox {
    display: flex;
    text-align: center;
  }

  .number-item {
    width: 18px;
    height: 50px;
    list-style: none;
    border-radius: 4px;
    margin: 0px;
  }
  .number-item > span {
    position: relative;
    display: inline-block;
    margin-right: 0px;
    width: 100%;
    height: 100%;
    writing-mode: vertical-rl;
    text-orientation: upright;
    overflow: hidden;
    font-family: AgencyFB-Bold;
    color: red;
  }
  .number-item > span > i {
    font-style: normal;
    position: absolute;
    top: 11px;
    left: 50%;
    transform: translate(-50%, 0);
    transition: transform 1s ease-in-out;
    letter-spacing: 10px;
    font-size: 40px;
  }
  .number-item:last-child {
    margin-right: 0;
  }
</style>
