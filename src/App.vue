<template>
  <div class="app">
          
      <!-- Row for Trip Details/Expense Details/Trip info Sections-->
      <div class="row text-center">
        
        <!-- Trip Details Section -->   
        <trip-details />
<!--
        <!-- Trip Info section 
        <trip-info>
        </trip-info>
       

        <!-- Expense Details Section
        <expense-details>
        </expense-details>
        
-->
      </div>  

      <!-- Global container for Trip list -->
      <div id="TripsListSection" class="row py-1 text-center">
        <trips-list :allTrips="allTrips" />        
      </div>
      

             
      
    
   
  </div>  
</template>

<script>
import { mapActions } from 'vuex';
import TripDetails from './components/TripDetails.vue';
import TripInfo from './components/TripInfo.vue';
import ExpenseDetails from './components/ExpenseDetails.vue';
import TripsList from './components/TripsList.vue';

export default {
  name: 'App',
  data () {
    return {

      //>>>Helper vars
      // these vars are replaced with ID of specified Trip / specified Spend,
      // when it is not 0, the Trip / Spend with specified ID is able to be deleted or updated
      specifiedTripId: 0,
      specifiedSpendId: 0,
      
           
  
 /*   
  
      computed: {
        

        

        // calculate remaining cash-on-hand
        cashLeft () {
        
          if (this.spendsList.length == 0) {
            return this.totalCash;
        
          } else {
            let copiedTotalCash = this.totalCash;
          
            this.spendsList.forEach(spend => {
              copiedTotalCash -= spend.spends_sum;
            });

            return copiedTotalCash;
          }
          
        },

        // calculate total expenses of the specified Trip
        totalSpends () {
          if (this.spendsList.length == 0) {
            return 0;
        
          } else {
            let totalSpends = 0;
          
            this.spendsList.forEach(spend => {
              totalSpends += spend.spends_sum;
            });

            return totalSpends;
          }
      
        },

        // calculate recommended daily cash amount
        everydayCash () {
          return Math.round(this.cashLeft / this.daysLeft);
        },
      
      },

*/
/*

      methods: {
  
        // return current date, converted into days number
        dayNow () {
          return ;
        },

        // return current Date
        dateNow () {
          return new Date().toLocaleDateString();
        },

        // reset Trip form to default values
        

        // reset Spend form to default values
        resetSpendingForm () {      
          this.specifiedSpendId = 0;
          this.spendDescription = '';
          this.spendCash = 0;
        },

      },

*/
/*

      watch: {
    
        // when user clicks on prefered Trip, specifiedTripId changes
        // this automatically refreshes the SpendsList for prefered Trip
        specifiedTripId () {
      
          if (this.specifiedTripId !== 0) {
        
            fetch(`http://localhost:4001/api/trips/${this.specifiedTripId}/spends`).
              then(response => {
        
                if (response.ok){
                  return response.json();
                }
        
                throw new Error('Request failed!');
        
              }, networkError => console.log(networkError.message)).
          
                then(jsonResponse => {
              
                  // refresh cached Spends List with rows from DB
                  this.spendsList = jsonResponse;
            
                });
          
            }

        },

      },

*/
/*

      // cache all Trips from DB at the very start of the App
      created () {
        //this.getAllTrips();
        console.log(`App started ${this.data}`);
      },

*/
/*
  
      

*/
  };
  

},

computed: {
  allTrips() {
    return this.$store.getters.allTrips;
  }
},

methods: mapActions(['fetchTrips']),

async mounted() {
  this.fetchTrips();
},

components: {
  TripDetails,
  TripInfo,
  ExpenseDetails,
  TripsList

}

};

</script>