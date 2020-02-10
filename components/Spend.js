const Spend = Vue.component('spend', {
    
    props: ['id', 'tripid', 'description', 'date', 'spendcash'],
    template: `
                <tr>
                    <td>
                     <img class="deleteButton" v-on:click="removeSpend" src="public/img/X_Button.svg">
                    </td>
                    <td>{{ description }}</td>
                    <td>{{ date }}</td>
                    <td>{{ spendcash }}</td>
                    <td>
                        <img class="editButton" src="public/img/icon_money.svg" v-on:click="showSpend">
                    </td>
                </tr>`,
   
                methods: {
        //get specific Spend from DB
        showSpend: function() {
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