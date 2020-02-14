const Trip = Vue.component('trip', {
    

    props: ['id', 'description', 'datestart', 'dateend', 'totalcash'],
    template: `
                <tr>
                    <td>
                     <img class="deleteButton" v-on:click="removeTrip" src="public/img/x-circle.svg">
                    </td>
                    <td>
                        <img class="editButton" src="public/img/play.svg" v-on:click="showTrip">
                    </td>
                    <td>{{ description }}</td>
                    <td>{{ datestart }}</td>
                    <td>{{ dateend }}</td>
                    <td>{{ totalcash }}</td>
                    
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
            this.$emit('remove-trip', {
                tripId: this.id,
            });
        },

        },

   
   


});