<template>
  <div id="TripSection" class="col-lg-6 order-md-1 p-lg-4 mx-auto" >
    <div class="container">
      
      <!-- Row for Trip Details Section Header and Reset Trip Form Button  -->
      <div class="row py-2">
      
        <div class="col p-0 text-left">
          <h3 class="my-auto font-weight-bold"> Trip Details </h3>
        </div>
              
        <div class="col p-0 text-right">
          <button class="rounded-circle my-1" @click="resetStrtForm"> <img class="mb-1" src="/assets/img/quit.svg"> </button>
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
            <input class="m-auto" type="date" v-model="dateStart" />
          </div>
        </div>       

        <div class="col">
          <div class="row text-center">
            <p class="col my-auto pb-2">DATE END</p>
          </div>
          <div class="row text-center">
            <input class="m-auto" type="date" v-model="dateEnd" />
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
            <input class="col-5 my-auto mr-auto" type="number" min="0" max="999999" v-model="totalCash" />
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

      <!-- Row for Developer Buttons -->
      <div class="row py-lg-4 pb-lg-5">
        <button class="col-2 rounded-pill ml-auto mr-3 my-1 py-1 px-0"
          @click="showData" 
          :disabled="!startFormIsValid"> 
          Show Data 
        </button>
      </div>
    
      <!-- Row for Trip functions Buttons 
      <div class="row py-lg-4 pb-lg-5">
        
        <button class="col-2 rounded-pill ml-auto mr-3 my-1 py-1 px-0"
          @click="saveTripToDatabase" 
          :disabled="!startFormIsValid"> 
          <img class="mb-1" src="public/img/add-icon.svg"> 
        </button>
        <button class="col-2 rounded-pill mr-auto ml-3 my-1 py-1 px-0"
         @click="saveTripChangesToDatabase" 
         :disabled="!startFormIsValid"> 
          <img class="mb-1" src="public/img/diskette.svg"> 
        </button>

      </div>   
    -->

    </div>
  </div>
</template>

<script>

export default {
  
  name: 'TripDetails',
  
  props: {

  },
  
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
      
    };
    
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
      return this.dayEnd - Math.floor(new Date() / (1000 * 3600 * 24)) + 1;
    },

  },

  methods: {
    resetStrtForm () {    
      //this.resetSpendingForm();
      //this.spendsList.length = 0;
      //this.specifiedTripId = 0;
      this.description = '';
      this.dateStart = '';
      this.dateEnd = '';
      this.totalCash = 0;       
    },



    // developer
    showData() {
      console.log(this);
    }

  },

  // control Trip status at the every User's step
  updated () {
    const dayNow = Math.floor(new Date() / (1000 * 3600 * 24));

    if (this.startFormIsValid) {
      if (dayNow - this.dayStart < 0) {
        this.status.notStarted = true;
        this.status.inProcess = false;
        this.status.finished = false;
  
      } else if (dayNow - this.dayStart >= 0 && dayNow - this.dayEnd <= 0) {
        this.status.notStarted = false;
        this.status.inProcess = true;
        this.status.finished = false;

      } else if (dayNow - this.dayEnd > 0) { 
        this.status.notStarted = false;
        this.status.inProcess = false;
        this.status.finished = true;

      }
    
    }

  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
