<template>
<!-- Row for Expenses List -->
    <div class="row py-1 text-center" v-if="tripStatus.inProcess || tripStatus.finished">
            
    <details class="col my-auto">
        
        <!-- Expenses List Name -->
        <summary class="col my-auto font-weight-bold">LIST OF EXPENSES</summary>
        
        <!-- Expenses List Container -->
        <div class="row py-1 text-center" :class="{ShortList: !tripStatus.finished, LongList: tripStatus.finished}">
            
            <table class="table table-sm table-striped" 
                v-if="allSpends.length !== 0">
                <thead>
                    <th></th>
                    <th>Description</th>
                    <th>Date</th>
                    <th>Expense Amount</th>              
                </thead>                    
                
                <tbody >
                    <tr v-for="spend in allSpends" :key="spend.id" :class="{activeRow: specifiedSpendId === spend.id && tripStatus.inProcess}">
                        <td>
                           <img src="@/assets/img/quit.svg" @click="removeSpend(spend)" v-if="!tripStatus.finished"> 
                        </td>
                        <td @click="chooseSpend(spend)">{{ spend.description }}</td>
                        <td @click="chooseSpend(spend)">{{ spend.date }}</td>
                        <td @click="chooseSpend(spend)">{{ spend.spends_sum | currency('RUB') }}</td>
                    </tr>
                </tbody>
            </table>
           

        </div>

    </details>

    </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
    name: 'ExpensesList',
    
    props: {
        allSpends: {
            required: true,
            type: Array
        }
    },

    computed: {
        ...mapState({
            tripStatus: state => state.trip.tripStatus,
            specifiedTripId: state => state.trip.specifiedTripId,
            specifiedSpendId: state => state.spend.specifiedSpendId
        }),
    },

    methods: {      
      chooseSpend(spend) {               
        this.$store.commit('updateChosenSpendId', spend.id);
        this.$store.commit('updateSpendDescription', spend.description);        
        this.$store.commit('updateSpendCash', spend.spends_sum);        
      },

      removeSpend(spend) {
        this.$store.dispatch('fetchDeleteSpend', {
            tripId: this.specifiedTripId,
            spendId: spend.id,
        })

        if (this.specifiedSpendId === spend.id) {
            this.$store.commit('resetSpendForm');
        }
      }
      
    }

}
</script>
<style scoped>
    /* Styling SpendsList visualisation */
    .ShortList {
        height: 7.5em;
        overflow-y: auto;
    }

    .LongList {
        height: 21em;
        overflow-y: auto;
    }
</style>