<template>
  <div class="app">
          
      <!-- Row for Trip Details/Expense Details/Trip info Sections-->
      <div class="row text-center">
        
        <!-- Trip Details Section -->   
        <trip-details>
        </trip-details>

        <!-- Trip Info section -->
        <trip-info>
        </trip-info>
       

        <!-- Expense Details Section-->
        <expense-details>
        </expense-details>
        

      </div>     

      <!-- Global container for Trip list  -->   
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

      //>>> Trip properties
      // this trip properties are entered by user 
      // and saved to DB if user enters " + " button, 
      // or updated when user eters " save " button
      description: '',
      dateStart: '',        
      dateEnd: '',          
      totalCash: 0,

      // status of the trip calculated each time
      // when the site updates. Connected with VUE "Updated" lifecircle hook
      status: {
        notStarted: false,
        inProcess: false,
        finished: false
      },

      //>>> Spend properties
      // this spend properties are entered by user 
      // and saved to DB if user enters " + " button, 
      // or updated when user eters " save " button
      spendDescription: '',
      spendDate: new Date().toLocaleDateString(),  //for the state of the App all spends have this property equals to current Date
      spendCash: 0,

      //>>>Helper vars
      // these vars are replaced with ID of specified Trip / specified Spend,
      // when it is not 0, the Trip / Spend with specified ID is able to be deleted or updated
      specifiedTripId: 0,
      specifiedSpendId: 0,
      
      // vars for caching retrieved data from DB
      tripsList: [],  // cach for all Trips from Trip DB
      spendsList: [], // cach all Spends connected with specified Trip      
  
    
      computed: {
        // control all fields of Trip form to be filled by user,
        // otherwise it is unable to save Trip to DB
        startFormIsValid () {
          return this.description && this.dateStart && this.dateEnd && this.totalCash;
        },

        // convert entered start Trip date to number
        dayStart () {
          return Math.floor(new Date(this.dateStart) / (1000 * 3600 * 24));
        },

        // convert entered end Trip date to number
        dayEnd () {
          return Math.floor(new Date(this.dateEnd) / (1000 * 3600 * 24));
        },

        // calculate trip length 
        totalDays () {
          if ((this.dayEnd - this.dayStart) > 0) {
            return this.dayEnd - this.dayStart + 1;
          }
        },

        // calculate number of days, remaining till trip ends
        daysLeft () {
          return this.dayEnd - this.dayNow() + 1;
        },

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
    
      methods: {
  
        // return current date, converted into days number
        dayNow () {
          return Math.floor(new Date() / (1000 * 3600 * 24));
        },

        // return current Date
        dateNow () {
          return new Date().toLocaleDateString();
        },

        // reset Trip form to default values
        resetStrtForm () {    
          this.resetSpendingForm();
          this.spendsList.length = 0;
          this.specifiedTripId = 0;
          this.description = '';
          this.dateStart = '';
          this.dateEnd = '';
          this.totalCash = 0;       
        },

        // reset Spend form to default values
        resetSpendingForm () {      
          this.specifiedSpendId = 0;
          this.spendDescription = '';
          this.spendCash = 0;
        },

      },
    
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
      
      // cache all Trips from DB at the very start of the App
      created () {
        this.getAllTrips();
      },
  
      // control Trip status at the every User's step
      updated () {
    
        if (this.startFormIsValid) {
      
          if (this.dayNow() - this.dayStart < 0) {
            this.status.notStarted = true;
            this.status.inProcess = false;
            this.status.finished = false;
  
          } else if (this.dayNow() - this.dayStart >= 0 && this.dayNow() - this.dayEnd <= 0) {
            this.status.notStarted = false;
            this.status.inProcess = true;
            this.status.finished = false;

          } else if (this.dayNow() - this.dayEnd > 0) { 
            this.status.notStarted = false;
            this.status.inProcess = false;
            this.status.finished = true;

          }
    
        }

    }


  };

},

components: {
  TripDetails: TripDetails,
  TripInfo: TripInfo,
  ExpenseDetails: ExpenseDetails

}

};

</script>