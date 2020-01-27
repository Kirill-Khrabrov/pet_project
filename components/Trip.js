const Trip = Vue.component('trip', {
    

    props: ['id', 'description', 'datestart', 'dateend', 'totalcash'],
    template: `
                <tr>
                    <td>
                     <img class="deleteButton" src="public/img/X_Button.svg">
                    </td>
                    <td>{{ description }}</td>
                    <td>{{ datestart }}</td>
                    <td>{{ dateend }}</td>
                    <td>{{ totalcash }}</td>
                    <td>
                        <img class="editButton" src="public/img/icon_money.svg" v-on:click="chooseTrip">
                    </td>
                </tr>`,
    methods: {
        chooseTrip: function() {
            console.log(`This trip info:
            ID: ${this.id}
            Descr: ${this.description}
            DTStrt: ${this.datestart}
            DTEnd: ${this.dateend}
            TTLCAsh: ${this.totalcash}
            `);
        }
    },

   
   


});