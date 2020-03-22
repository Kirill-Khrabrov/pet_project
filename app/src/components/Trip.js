const Trip = Vue.component('trip', {
    
    props: ['id', 'description', 'datestart', 'dateend', 'totalcash'],
    template: `
                <tr>
                    <td>
                     <img src="public/img/x-circle.svg" v-on:click="removeTrip" >
                    </td>
                    <td v-on:click="showTrip"> {{ description }}</td>
                    <td v-on:click="showTrip">{{ datestart }}</td>
                    <td v-on:click="showTrip">{{ dateend }}</td>
                    <td v-on:click="showTrip">{{ totalcash }}</td>
                    
                </tr>`,
    methods: {
        
        //get specific Trip from DB
        showTrip: function() {
        
            // generate 'show-trip' event and transfer Trip's ID
            this.$emit('show-trip', {
                tripId: this.id,
            });
        
        },

        //delete from DB
        removeTrip: function() {
        
            // generate 'remove-trip' event and transfer Trip's ID
            this.$emit('remove-trip', {
                tripId: this.id,
            });
        },

    },

});