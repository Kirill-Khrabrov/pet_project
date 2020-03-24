<template>
  <div  class="col-lg-12 order-md-3 py-lg-1">
    
    <!-- Row for all Trip info (DAYS LEFT / CASH PER DAY / CASH REST / TOTAL EXPENSES-->
    <div class="row pt-4 text-center">

      <div class="col mx-auto" v-bind:class="{inactive: !status.inProcess}">
        <label for="daysLeft">DAYS LEFT</label>
        <p class="font-weight-bold text-white" id="daysLeft"> {{ daysLeft }} </p>
      </div>
            
      <div class="col mx-auto" v-bind:class="{inactive: !status.inProcess}">
        <label class="everydayCash" for="everydayCash">CASH PER DAY</label>         
        <p class="everydayCash font-weight-bold text-white" id="everydayCash">{{ everydayCash }} </p>
      </div>

      <div class="col mx-auto" v-bind:class="{inactive: status.notStarted}">
        <label for="cashLeft">CASH REST</label>
        <p class="font-weight-bold text-white" id="cashLeft"> {{ cashLeft }} </p>
      </div>
    
      <div class="col mx-auto" v-bind:class="{inactive: !status.finished}">
        <label for="totalSpends">TOTAL EXPENSES</label>
        <p class="font-weight-bold text-white" id="totalSpends"> {{ totalSpends }} </p>
      </div>
            
      </div>          
    
  </div>
</template>

<script>
export default {
  
  name: 'TripInfo',
  
  props: {

  },
  
  data () {
    return {
      
    };
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
