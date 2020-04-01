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
            <input class="col-5 my-auto mr-auto" type="number" min="0" max="999999" :value="spendCash" @input="updateSpendCash" />
          </div>      
        </div>
        <textarea  class="col-6 ml-auto" :value="spendDescription" @input="updateSpendDescription"></textarea>
      
      </div>

      <!-- Row for Expense functions Buttons -->
      <div class="row py-2" v-if="tripStatus.inProcess">
        
        
        <button class="col-2 rounded-pill ml-auto mr-3 my-1 py-1 px-0" @click="saveSpendToDatabase" :disabled="!spendFormIsValid || enoughCash <= 0"> 
          <img class="mb-1" src="@/assets/img/add-icon.svg"> 
        </button>
        
        <button class="col-2 rounded-pill mr-auto mr-3 my-1 py-1 px-0" @click="updateSpend" :disabled="chosenSpend == 0 || !spendDescription"> 
          <img class="mb-1" src="@/assets/img/diskette.svg"> 
        </button>
            
      </div>

      <expenses-list v-if="tripStatus.inProcess || tripStatus.finished" :allSpends="allSpends"/>    
      
    </div>  
    
  </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex';
import ExpensesList from './ExpensesList.vue';

export default {
  
  name: 'ExpenseDetails', 
  
  computed: {
    ...mapGetters([
      'spendDescription',
      'spendDate',
      'spendCash',
      'chosenSpend',
      'chosenTrip',
      'tripStatus',
      'allSpends',
      'tripTotalCash'
    ]),

    spendFormIsValid() {
      return this.spendDescription && this.spendCash;
    },

    enoughCash() {
      let totalSpends = 0;
      
      this.allSpends.forEach(spend => {
          totalSpends += spend.spends_sum;
      });

      return this.tripTotalCash - totalSpends;
    }
  
  },

  methods: {
    resetSpendForm() {
      this.$store.commit('resetSpendForm')
    },

    updateSpendDescription(e) {
      this.$store.commit('updateSpendDescription', e.target.value);
    },

    updateSpendCash(e) {
      this.$store.commit('updateSpendCash', e.target.value);
    },

    saveSpendToDatabase() {
      this.$store.dispatch('fetchNewSpend', {
        tripId: this.chosenTrip,
        description: this.spendDescription,
        date: this.spendDate,
        spendCash: this.spendCash
      });
    },

    updateSpend() {
      this.$store.dispatch('fetchUpdateSpend', { 
        spendId: this.chosenSpend,
        tripId: this.chosenTrip,
        description: this.spendDescription,
        date: this.spendDate,
        spendCash: this.spendCash });
    },



  },

  components: {
    ExpensesList
  }

};

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
