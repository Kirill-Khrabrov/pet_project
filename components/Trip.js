const Trip = Vue.component('trip', {
    

    props: ['id', 'description', 'datestart', 'dateend', 'totalcash'],
    template: `
                <tr>
                    <td>
                     <img class="deleteButton" v-on:click="removeTrip" src="public/img/X_Button.svg">
                    </td>
                    <td>{{ description }}</td>
                    <td>{{ datestart }}</td>
                    <td>{{ dateend }}</td>
                    <td>{{ totalcash }}</td>
                    <td>
                        <img class="editButton" src="public/img/icon_money.svg" v-on:click="showTrip">
                    </td>
                </tr>`,
    methods: {
        //get specific Trip from DB
        showTrip: function() {
            this.$emit('show-trip', {
                tripId: this.id,
            });
        },

        //delete from DB
        removeTrip: function() {
            //generate 'remove' event and transfer Trip's ID
            this.$emit('remove', {
                tripId: this.id,
            });
        },

        },

   
   


});