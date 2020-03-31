<template>
  <div id="TripSection" class="col-lg-6 order-md-1 p-lg-4 mx-auto" >
    <div class="container">
      
      <!-- Row for Trip Details Section Header and Reset Trip Form Button  -->
      <div class="row py-2">
      
        <div class="col p-0 text-left">
          <h3 class="my-auto font-weight-bold"> Trip Details </h3>
        </div>
              
        <div class="col p-0 text-right">
          <button class="rounded-circle my-1" @click="resetTripForm"> <img class="mb-1" src="/assets/img/quit.svg"> </button>
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
            <input class="m-auto" type="date" :value="tripDateStart" @input="updateTripDateStart" />
          </div>
        </div>       

        <div class="col">
          <div class="row text-center">
            <p class="col my-auto pb-2">DATE END</p>
          </div>
          <div class="row text-center">
            <input class="m-auto" type="date" :value="tripDateEnd" @input="updateTripDateEnd" />
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
            <input class="col-5 my-auto mr-auto" type="number" min="0" max="999999" :value="tripTotalCash" @input="updateTripTotalCash" />
          </div>
        </div>              
        <textarea  class="col-6 ml-auto" :value="tripDescription" @input="updateTripDescription"></textarea>
      
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
          <img class="mb-1" src="public/img/add-icon.svg"> 
        </button>
        <button class="col-2 rounded-pill mr-auto ml-3 my-1 py-1 px-0"
         @click="updateTrip" 
         :disabled="!startFormIsValid"> 
          <img class="mb-1" src="public/img/diskette.svg"> 
        </button>

      </div>   
    

    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex';

export default {
  
  name: 'TripDetails',

  data(){
    return  {
       
    
    };

  },
      
  computed: {
    ...mapGetters([
      'tripDescription',
      'tripDateStart',
      'tripDateEnd',
      'tripTotalCash',
      'chosenTrip',
      'tripStatus'
    ]),
  
    // control all fields of Trip form to be filled by user,
    // otherwise it is unable to save Trip to DB
    startFormIsValid () {
      return this.tripDescription && this.tripDateStart && this.tripDateEnd && this.tripTotalCash;
    },

    // convert entered start Trip date to number
    dayStart () {
      return Math.floor(new Date(this.tripDateStart) / (1000 * 3600 * 24));
    },

    // convert entered end Trip date to number
    dayEnd () {
      return Math.floor(new Date(this.tripDateEnd) / (1000 * 3600 * 24));
    },

    // calculate trip length 
    totalDays () {
      if ((this.dayEnd - this.dayStart) >= 0) {
        return this.dayEnd - this.dayStart + 1;
      }
    },

    // calculate number of days, remaining till trip ends
    daysLeft () {
      return this.dayEnd - Math.floor(new Date() / (1000 * 3600 * 24)) + 1;
    },

  },

  methods: {
    updateTripDescription(e) {
      this.$store.commit('updateTripDescription', e.target.value);
    },

    updateTripDateStart(e) {
      this.$store.commit('updateTripDateStart', e.target.value);
    },

    updateTripDateEnd(e) {
      this.$store.commit('updateTripDateEnd', e.target.value);
    },

    updateTripTotalCash(e) {
      this.$store.commit('updateTripTotalCash', e.target.value);
    },    

    resetTripForm () {    
      this.$store.commit('resetTripForm');       
    },
    

    addNewTrip() {
      this.$store.dispatch('fetchNewTrip', { 
        description: this.tripDescription, 
        dateStart: this.tripDateStart, 
        dateEnd: this.tripDateEnd, 
        totalCash: this.tripTotalCash });
    },

    updateTrip() {
      this.$store.dispatch('fetchUpdateTrip', { 
        description: this.tripDescription, 
        dateStart: this.tripDateStart, 
        dateEnd: this.tripDateEnd, 
        totalCash: this.tripTotalCash,
        tripId: this.chosenTrip });
    },    

  },

  // control Trip status at the every User's step
  updated () {
    console.log(this.tripStatus);
    this.$store.commit('updateTripStatus');
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
