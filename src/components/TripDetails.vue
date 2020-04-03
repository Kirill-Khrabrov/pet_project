<template>
  <div id="TripSection" class="col-lg-6 order-md-1 p-lg-4 mx-auto" >
    <div class="container">
      
      <!-- Row for Trip Details Section Header and Reset Trip Form Button  -->
      <div class="row py-2">
      
        <div class="col p-0 text-left">
          <h3 class="my-auto font-weight-bold"> Trip Details </h3>
        </div>
              
        <div class="col p-0 text-right">
          <button class="rounded-circle my-1" @click="resetTripForm"> <img class="mb-1" src="@/assets/img/refresh.svg"> </button>
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
            <input class="m-auto" type="date" v-model="tripDateStart"/>
          </div>
        </div>       

        <div class="col">
          <div class="row text-center">
            <p class="col my-auto pb-2">DATE END</p>
          </div>
          <div class="row text-center">
            <input class="m-auto" type="date" v-model="tripDateEnd"/>
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
            <input class="col-5 my-auto mr-auto" type="number" min="0" max="999999" v-model="tripTotalCash"/>
          </div>
        </div>              
        <textarea  class="col-6 ml-auto" v-model="tripDescription"></textarea>
      
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
            <label class="co my-auto" for="tripStatus" v-if="tripStatus.notStarted || tripStatus.inProcess || tripStatus.finished">TRIP STATUS</label>
            <p class="col my-auto text-white" id="tripStatus" v-if="tripStatus.notStarted"> NOT STARTED </p>
            <p class="col my-auto text-white" id="tripStatus" v-if="tripStatus.inProcess"> IN PROCESS </p>
            <p class="col my-auto text-white" id="tripStatus" v-if="tripStatus.finished"> FINISHED </p>
          </div>
        </div>
      
      </div>
      
      <!-- Row for Trip functions Buttons -->
      <div class="row py-lg-4 pb-lg-5">
        
        <button class="col-2 rounded-pill ml-auto mr-3 my-1 py-1 px-0"
                @click="addNewTrip" 
                :disabled="!startFormIsValid"> 
          <img class="mb-1" src="@/assets/img/add-icon.svg"> 
        </button>

        <button class="col-2 rounded-pill mr-auto ml-3 my-1 py-1 px-0"
                @click="updateTrip" 
                :disabled="!startFormIsValid"> 
          <img class="mb-1" src="@/assets/img/diskette.svg"> 
        </button>

      </div>   
    

    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  
  name: 'TripDetails',
       
  computed: {
    ...mapState({
      tripStatus: state => state.trip.tripStatus,
      specifiedTripId: state => state.trip.specifiedTripId,         
    }),

    // computed properties for v-model
    tripDateStart: {
      get() {
        return this.$store.state.trip.tripDateStart;
      },
      set(value) {
        this.$store.commit('updateTripDateStart', value);
      }
    },
    
    tripDateEnd: {
      get() {
        return this.$store.state.trip.tripDateEnd;
      },
      set(value) {
        this.$store.commit('updateTripDateEnd', value);
      }
    },
    
    tripDescription: {
      get() {
        return this.$store.state.trip.tripDescription;
      },
      set(value) {
        this.$store.commit('updateTripDescription', value);
      }
    },

    tripTotalCash: {
      get() {
        return this.$store.state.trip.tripTotalCash;
      },
      set(value) {
        this.$store.commit('updateTripTotalCash', value);
      }
    },

    // control all fields of Trip form to be filled by user,
    // otherwise it is unable to save Trip to DB
    startFormIsValid () {
      return this.tripDescription && this.tripDateStart && this.tripDateEnd && this.tripTotalCash;
    },    

    // calculate trip length 
    totalDays () {
      const dayEnd = Math.floor(new Date(this.tripDateEnd) / (1000 * 3600 * 24));
      const dayStart = Math.floor(new Date(this.tripDateStart) / (1000 * 3600 * 24));

      if ((dayEnd - dayStart) >= 0) {
        return dayEnd - dayStart + 1;
        
      } else {
        return 'The Trip cannot end before start';
      }

    },
    
  },

  methods: {
    resetTripForm () {    
      this.$store.commit('resetTripForm');       
    },    

    addNewTrip() {
      this.$store.dispatch('fetchNewTrip', { 
        description: this.tripDescription, 
        dateStart: this.tripDateStart, 
        dateEnd: this.tripDateEnd, 
        totalCash: this.tripTotalCash });
      this.$store.commit('updateSpendList', []);
    },

    updateTrip() {
      this.$store.dispatch('fetchUpdateTrip', { 
        description: this.tripDescription, 
        dateStart: this.tripDateStart, 
        dateEnd: this.tripDateEnd, 
        totalCash: this.tripTotalCash,
        tripId: this.specifiedTripId });
    },    

  },

  // control Trip status at the every User's step
  updated () {
    this.$store.commit('updateTripStatus');
  }

}
</script>