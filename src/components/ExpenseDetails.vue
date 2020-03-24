<template>
  <div class="col-lg-6 order-md-2 pt-lg-4 px-lg-4 mx-auto"
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
</template>

<script>
export default {
  
  name: 'ExpenseDetails',
  
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
