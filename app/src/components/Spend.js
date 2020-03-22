const Spend = Vue.component('spend', {
    
    props: ['id', 'tripid', 'description', 'date', 'spendcash', 'status'],
    
    template: `
                <tr>
                    <td>
                     <img src="public/img/x-circle.svg" v-on:click="removeSpend" v-if="!status.finished">
                    </td>
                    <td v-on:click="showSpend">{{ description }}</td>
                    <td v-on:click="showSpend">{{ date }}</td>
                    <td v-on:click="showSpend">{{ spendcash }}</td>                   
                </tr>`,
   
    methods: {
        
        //get specific Spend from DB
        showSpend: function() {
            //generate 'show-spend' event and transfer Spend's ID
            this.$emit('show-spend', {
                spendId: this.id,
            });

        },

        //delete from DB
        removeSpend: function() {
            //generate 'remove' event and transfer Spend's ID
            this.$emit('remove-spend', {
                spendId: this.id,
            });
        },

    },

});