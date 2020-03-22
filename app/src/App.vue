<template>
  <div class="app">
  <!-- Application Header -->
    <header class="py-1 sticky-top">
      <h1 class="font-weight-bold">Pocket Cash Calculator</h1>
    </header>
    
    <!-- ClobalContainer for Trip Details/Expense Details/Trip info/Trips list Sections-->
    <div class="container-fluid">    
      
      <!-- Row for Trip Details/Expense Details/Trip info Sections-->
      <div class="row text-center">
        
        <!-- Trip Details Section -->   
        <div id="TripSection" class="col-lg-6 order-md-1 p-lg-4 mx-auto" >
          <div class="container">
            
            <!-- Row for Trip Details Section Header and Reset Trip Form Button  -->
            <div class="row py-2">
              
              <div class="col p-0 text-left">
                <h3 class="my-auto font-weight-bold"> Trip Details </h3>
              </div>
              
              <div class="col p-0 text-right">
                <button class="rounded-circle my-1" v-on:click="resetStrtForm"> <img class="mb-1" src="public/img/quit.svg"> </button>
              </div>
            
            </div>
        
            <!-- Trip Form -->
            <!-- Row for Trip Data Start & Trip Data End -->    
            <div class="row py-2">
              
              <div class="col">
                <div class="row text-center">
                  <p class="col my-auto pb-2">DATE START</p>
                </div>
                <div class="row text-center">
                  <input class="m-auto" type="date" id="dateStart" v-model="dateStart" />
                </div>
              </div>       

              <div class="col">
                <div class="row text-center">
                  <p class="col my-auto pb-2">DATE END</p>
                </div>
                <div class="row text-center">
                  <input class="m-auto" type="date" id="dateEnd" v-model="dateEnd" />
                </div>            
              </div>

            </div>       
      
            <!-- Row for Trip Description & Cash -->
            <div class="row py-3">
            
              <div class="col-6">
                <div class="row py-2 text-left">
                  <p class="col ml-auto">DESCRIPTION</p>
                </div>
                <div class="row py-2 text-left">
                  <p class="col-6 my-auto">YOUR CASH</p>
                  <input class="col-5 my-auto mr-auto" type="number" id="totalCash" min="0" max="999999" v-model="totalCash" />
                </div>
              </div>              
              <textarea  class="col-6 ml-auto" v-model.trim="description"></textarea>
            
            </div>  
                
            <!-- Row for Trip total days & Trip Status -->        
            <div class="row py-3 pb-5" v-if="startFormIsValid">

              <div class="col">
                <div class="row text-left">
                  <label class="col-6 my-auto" for="totalDays">DAYS TOTAL</label>
                  <p class="col-6 my-auto font-weight-bold text-white"> {{ totalDays }} </p>
                </div>
              </div>
              <div class="col">
                <div class="row text-center">
                  <label class="co my-auto" for="tripStatus" v-if="status.notStarted || status.inProcess || status.finished">TRIP STATUS</label>
                  <p class="col my-auto text-white" id="tripStatus" v-if="status.notStarted"> NOT STARTED </p>
                  <p class="col my-auto text-white" id="tripStatus" v-if="status.inProcess"> IN PROCESS </p>
                  <p class="col my-auto text-white" id="tripStatus" v-if="status.finished"> FINISHED </p>
                </div>
              </div>

            </div>
    
            <!-- Row for Trip functions Buttons -->
            <div class="row py-lg-4 pb-lg-5">

              <button class="col-2 rounded-pill ml-auto mr-3 my-1 py-1 px-0" 
                      v-on:click="saveTripToDatabase" 
                      v-bind:disabled="!startFormIsValid"> 
                <img class="mb-1" src="public/img/add-icon.svg"> 
              </button>
              <button class="col-2 rounded-pill mr-auto ml-3 my-1 py-1 px-0" 
                      v-on:click="saveTripChangesToDatabase" 
                      v-bind:disabled="!startFormIsValid"> 
                <img class="mb-1" src="public/img/diskette.svg"> 
              </button>

            </div>   
                
          </div>
        </div>

        <!-- Trip Info section -->
        <div id="TripInfoSection" 
             class="col-lg-12 order-md-3 py-lg-1" 
             v-bind:class="{inactive: !startFormIsValid}">
          
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

        <!-- Expense Details Section-->
        <div id="SpendSection" 
             class="col-lg-6 order-md-2 pt-lg-4 px-lg-4 mx-auto" 
             v-bind:class="{inactive: !startFormIsValid || status.notStarted}">
          
          <div class="container">
           
           <!-- Row for Header of Expense Details -->           
            <div class="row py-2">
              
              <div class="col p-0 text-left">
                <h3 class="my-auto font-weight-bold"> Expense Details </h3>
              </div>

              <div class="col p-0 text-right">
                <button class="rounded-circle my-1" v-on:click="resetSpendingForm"> <img class="mb-1" src="public/img/quit.svg"> </button>
              </div>

            </div>

            <!-- Row for Expense Current Date -->  
            <div class="row py-3" v-if="status.inProcess">
              <label class="col my-auto py-2" for="currentDate">CURRENT DATE</label>
              <p class="col my-auto py-2 text-white" id="currentDate"> {{ dateNow() }} </p>
            </div>
  
            <!-- Row for Expense Description & Expense Amount -->
            <div class="row py-3" v-if="status.inProcess">
              
              <div class="col-6">
                
                <div class="row py-1 text-left">
                  <p class="col ml-auto">EXPENSE DESCRIPTION</p>
                </div>                    
                
                <div class="row py-1 text-left">
                  <p class="col-6 my-auto">EXPENSE AMOUNT</p>
                  <input class="col-5 my-auto mr-auto" type="number" id="todaySpendings" min="0" max="999999" v-model="spendCash" />
                </div>      
              
              </div>
              
              <textarea  class="col-6 ml-auto" v-model.trim="spendDescription"></textarea>
            
            </div>       
        
            <!-- Row for Expense functions Buttons -->
            <div class="row py-2" v-if="status.inProcess">

              <button class="col-2 rounded-pill ml-auto mr-3 my-1 py-1 px-0" 
                      v-on:click="saveSpendToDatabase" 
                      v-bind:disabled="this.specifiedTripId == 0 || !spendDescription"> 
                <img class="mb-1" src="public/img/add-icon.svg"> 
              </button>
              
              <button class="col-2 rounded-pill mr-auto mr-3 my-1 py-1 px-0" 
                      v-on:click="saveSpendChangesToDatabase"
                      v-bind:disabled="this.specifiedTripId == 0 || !spendDescription"> 
                <img class="mb-1" src="public/img/diskette.svg"> 
              </button>
            
            </div>
  
            <!-- Row for Expenses List -->
            <div class="row py-1 text-center" v-if="status.inProcess || status.finished">
              
              <details class="col my-auto">
                
                <!-- Expenses List Name -->
                <summary class="col my-auto font-weight-bold">LIST OF EXPENSES</summary>
                
                <!-- Expenses List Container -->
                <div class="row py-1 text-center">

                  <div class="col my-auto" 
                       v-bind:class="{ShortList: !status.finished, LongList: status.finished}">
                    
                    <table class="table table-sm table-striped" 
                           v-if="spendsList.length !== 0">
                           
                      <thead>
                        <th></th>
                        <th>Description</th>
                        <th>Date</th>
                        <th>Expense Amount</th>              
                      </thead>                    
                      
                      <tbody >
                        <tr is = "spend" 
                            v-on:remove-spend = "removeSpendFromDatabase"
                            v-on:show-spend = "getSpecificSpend"
                            v-for = "spend in spendsList"
                            v-bind:status = "status"
                            v-bind:id = "spend.id"
                            v-bind:tripid = "specifiedTripId"
                            v-bind:description = "spend.description"
                            v-bind:date = "spend.date"
                            v-bind:spendcash = "spend.spends_sum"
                            v-bind:class="{ activeRow: spend.id == specifiedSpendId }">
                        </tr>
                      </tbody>

                    </table>

                  </div>

                </div>

              </details>

            </div>        
  
          </div>  
    
        </div>

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
  </div>  
</template>

<script>

import * as utils from './js/utils.js';

export default {
  name: 'App',
  data: {

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
  },
    
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


}

</script>