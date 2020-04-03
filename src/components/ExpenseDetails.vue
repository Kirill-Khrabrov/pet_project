<template>
  <div class="col-lg-6 order-md-2 pt-lg-4 px-lg-4 mx-auto">
    
    <div class="container">
           
      <!-- Row for Header of Expense Details -->           
      <div class="row py-2">
              
        <div class="col p-0 text-left">
          <h3 class="my-auto font-weight-bold"> Expense Details </h3>
        </div>
        <div class="col p-0 text-right">
          <button class="rounded-circle my-1" @click="resetSpendForm"> <img class="mb-1" src="@/assets/img/refresh.svg"> </button>
        </div>

      </div>

      <!-- Row for Expense Current Date -->  
      <div class="row py-3" v-if="tripStatus.inProcess">
        <label class="col my-auto py-2">CURRENT DATE</label>
        <p class="col my-auto py-2 text-white"> {{ spendDate }} </p>
      </div>
  
      <!-- Row for Expense Description & Expense Amount -->
      <div class="row py-3" v-if="tripStatus.inProcess">
              
        <div class="col-6">
          <div class="row py-1 text-left">
            <p class="col ml-auto">EXPENSE DESCRIPTION</p>
          </div>                    
          <div class="row py-1 text-left">
            <p class="col-6 my-auto">EXPENSE AMOUNT</p>
            <input class="col-5 my-auto mr-auto" type="number" min="0" max="999999" v-model="spendCash"/>
          </div>      
        </div>
        <textarea  class="col-6 ml-auto" v-model="spendDescription"></textarea>
      
      </div>

      <!-- Row for Expense functions Buttons -->
      <div class="row py-2" v-if="tripStatus.inProcess">
        
        
        <button class="col-2 rounded-pill ml-auto mr-3 my-1 py-1 px-0" @click="saveSpendToDatabase" :disabled="!spendFormIsValid || enoughCash <= 0"> 
          <img class="mb-1" src="@/assets/img/add-icon.svg"> 
        </button>
        
        <button class="col-2 rounded-pill mr-auto mr-3 my-1 py-1 px-0" @click="updateSpend" :disabled="specifiedSpendId == 0 || !spendDescription"> 
          <img class="mb-1" src="@/assets/img/diskette.svg"> 
        </button>
            
      </div>

      <expenses-list v-if="tripStatus.inProcess || tripStatus.finished" :allSpends="spendsList"/>    
      
    </div>  
    
  </div>
</template>

<script>
import { mapState } from 'vuex';
import ExpensesList from './ExpensesList.vue';

export default {
  
  name: 'ExpenseDetails', 
  
  computed: {
    ...mapState({
      spendDate: state => state.spend.spendDate,
      specifiedSpendId: state => state.spend.specifiedSpendId,
      specifiedTripId: state => state.trip.specifiedTripId,
      tripStatus: state => state.trip.tripStatus,
      tripTotalCash: state => state.trip.tripTotalCash,
      spendsList: state => state.spendsList,
    }),

    // computed properties for v-model
    spendDescription: {
      get() {
        return this.$store.state.spend.spendDescription;
      },
      set(value) {
        this.$store.commit('updateSpendDescription', value);
      }
    },

    spendCash: {
      get() {
        return this.$store.state.spend.spendCash;
      },
      set(value) {
        this.$store.commit('updateSpendCash', value);
      }
    },

    // control all fields of Spend form to be filled by user,
    // otherwise it is unable to save Spend to DB
    spendFormIsValid() {
      return this.spendDescription && this.spendCash;
    },

    //property for calculating all expenses amount
    //if it exceeds the budget, spend button "+" will be disabled
    enoughCash() {
      let totalSpends = 0;
      
      this.spendsList.forEach(spend => {
          totalSpends += spend.spends_sum;
      });

      return this.tripTotalCash - totalSpends;
    }
  
  },

  methods: {
    resetSpendForm() {
      this.$store.commit('resetSpendForm')
    },

    saveSpendToDatabase() {
      this.$store.dispatch('fetchNewSpend', {
        tripId: this.specifiedTripId,
        description: this.spendDescription,
        date: this.spendDate,
        spendCash: this.spendCash
      });
    },

    updateSpend() {
      this.$store.dispatch('fetchUpdateSpend', { 
        spendId: this.specifiedSpendId,
        tripId: this.specifiedTripId,
        description: this.spendDescription,
        date: this.spendDate,
        spendCash: this.spendCash });
    },
  },

  components: {
    ExpensesList
  }

}

</script>

