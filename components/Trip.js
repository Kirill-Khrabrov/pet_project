const Trip = Vue.component('trip', {
    props: ['description', 'datestart', 'dateend', 'totalcash'],
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
                        <img class="editButton" src="public/img/icon_money.svg">
                    </td>
                </tr>`
   });