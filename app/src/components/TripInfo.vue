<template>
  <div  class="col-lg-12 order-md-3 py-lg-1">
    
    <!-- Row for all Trip info (DAYS LEFT / CASH PER DAY / CASH REST / TOTAL EXPENSES-->
    <div class="row pt-4 text-center">

      <div class="col mx-auto" :class="{inactive: !tripStatus.inProcess}">
        <label for="daysLeft">DAYS LEFT</label>
        <p class="font-weight-bold text-white" id="daysLeft"> {{ daysLeft }} </p>
      </div>
            
      <div class="everydayCash col mx-auto" :class="{inactive: !tripStatus.inProcess}">
        <label>CASH PER DAY</label>         
        <p class="font-weight-bold text-white">{{ everydayCash | currency('RUB') }} </p>
      </div>

      <div class="col mx-auto" :class="{inactive: tripStatus.notStarted}">
        <label>CASH REST</label>
        <p class="font-weight-bold text-white"> {{ cashLeft | currency('RUB') }} </p>
      </div>
    
      <div class="col mx-auto" :class="{inactive: !tripStatus.finished}">
        <label>TOTAL EXPENSES</label>
        <p class="font-weight-bold text-white"> {{ totalSpends | currency('RUB') }} </p>
      </div>
            
      </div>          
    
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';

export default {

  name: 'TripInfo',

  computed: {
    ...mapState({
      tripStatus: state => state.trip.tripStatus,
      tripTotalCash: state => state.trip.tripTotalCash,
      tripDateEnd: state => state.trip.tripDateEnd,
      spendsList: state => state.spendsList 
    }),    

    // calculate remaining cash-on-hand
    cashLeft () {
        
      if (this.spendsList.length === 0) {
        return +this.tripTotalCash;
    
      } else {
        let copiedTotalCash = this.tripTotalCash;
      
        this.spendsList.forEach(spend => {
          copiedTotalCash -= spend.spends_sum;
        });

        if (copiedTotalCash < 0) {
          return "Nothing left";

        } else {
          return copiedTotalCash;
        }
      }
      
    },

    // calculate total expenses of the specified Trip
    totalSpends () {

      if (this.spendsList.length === 0) {
        return 0;
    
      } else {
        let totalSpends = 0;
      
        this.spendsList.forEach(spend => {
          totalSpends += spend.spends_sum;
        });

        return totalSpends;
      }

    },
        
    // calculate number of days, remaining till trip ends
    daysLeft () {
      const dayEnd = Math.floor(new Date(this.tripDateEnd) / (1000 * 3600 * 24));
      let today = Math.floor(new Date() / (1000 * 3600 * 24));     
      return dayEnd - today + 1;           
    },

    // calculate recommended daily cash amount
    everydayCash () {
      
      if (typeof this.cashLeft === 'number') {
        return Math.round(this.cashLeft / this.daysLeft);

      } else {
        return 'You are out of budget';
      }

    },
      
  },
  
}
</script>

<style scoped>
  .everydayCash {
      font-size: 1.3em!important;
  }
</style>
