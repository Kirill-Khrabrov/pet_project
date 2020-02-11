const Spend = Vue.component('spend', {
    
    props: ['id', 'tripid', 'description', 'date', 'spendcash', 'status'],
    template: `
                <tr>
                    <td>
                     <img class="deleteButton" v-on:click="removeSpend" src="public/img/X_Button.svg" v-if="!status.finished">
                    </td>
                    <td>{{ description }}</td>
                    <td>{{ date }}</td>
                    <td>{{ spendcash }}</td>
                    <td>
                        <img class="editButton" src="public/img/icon_money.svg" v-on:click="showSpend" v-if="!status.finished">
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