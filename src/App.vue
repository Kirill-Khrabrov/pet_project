<template>
  <div class="app">
          
      <!-- Row for Trip Details/Expense Details/Trip info Sections-->
      <div class="row text-center">
        
        <!-- Trip Details Section -->   
        <trip-details>
        </trip-details>

<!--
        <!-- Trip Info section 
        <trip-info>
        </trip-info>
       

        <!-- Expense Details Section
        <expense-details>
        </expense-details>
        
-->
      </div>     

      <!-- Global container for Trip list    
      <div id="TripsListSection" class="row py-1 text-center">
        
        <details class="col my-auto">
          
          <summary class="col my-auto font-weight-bold">SCHEDULE OF TRIPS</summary>

          <div class="TripList row py-1 text-center"> 
            
            <div class="col mb-auto">
              
              <table class="table table-md table-striped">
                
                <thead>
                  <th></th>
                  <th>Description</th>
                  <th>Trip Starts</th>
                  <th>Trip Ends</th>
                  <th>Cash</th>          
                </thead>
                
                <tbody id="TripList" class="overflow-auto">
                  <tr is = "trip" 
                      v-on:remove-trip = "removeTripFromDatabase"
                      v-on:show-trip = "getSpecificTrip"
                      v-for = "trip in tripsList"
                      v-bind:id = "trip.id"
                      v-bind:description = "trip.description"
                      v-bind:datestart = "trip.trip_start"
                      v-bind:dateend = "trip.trip_end"
                      v-bind:totalcash = "trip.total_cash"
                      v-bind:class="{ activeRow: trip.id == specifiedTripId }"></tr>
                  </tr>
                </tbody>
              
              </table>
        
            </div>
          
          </div>

        </details>

      </div>
-->       
   
  </div>  
</template>

<script>

import * as utils from './js/utils.js';
import TripDetails from './components/TripDetails.vue';
import TripInfo from './components/TripInfo.vue';
import ExpenseDetails from './components/ExpenseDetails.vue';

export default {
  name: 'App',
  data () {
    return {

      


      //>>>Helper vars
      // these vars are replaced with ID of specified Trip / specified Spend,
      // when it is not 0, the Trip / Spend with specified ID is able to be deleted or updated
      specifiedTripId: 0,
      specifiedSpendId: 0,
      
      // vars for caching retrieved data from DB
      tripsList: [],  // cach for all Trips from Trip DB
      spendsList: [], // cach all Spends connected with specified Trip      
  
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

components: {
  TripDetails: TripDetails,
  TripInfo: TripInfo,
  ExpenseDetails: ExpenseDetails

}

};

</script>