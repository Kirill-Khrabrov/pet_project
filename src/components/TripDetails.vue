<template>
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
</template>

<script>
export default {
  
  name: 'TripDetails',
  
  props: {

  },
  
  data () {
    return {
      
    };
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
