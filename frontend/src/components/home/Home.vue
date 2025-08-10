<template>
    <div class="home">
        <PageTitle icon="fa fa-home" main="Dashboard" :sub="`Bem vindo, ${userName}!`"></PageTitle>
        <div class="stats">
            <Stat title="Usúarios" :value="stat.users" icon="fa fa-user" color="#d54d50"></Stat>
            <Stat title="Voos" :value="stat.flights" icon="fa fa-plane" color="#3bc480"></Stat>
        </div>
    </div>
</template>

<script>
import PageTitle from "../template/PageTitle.vue";
import Stat from "./Stats"
import axios from "axios"  
import { baseApiURL } from "@/global" 
import { showError } from "../../config/msgs";

export default {
    name: 'Home', 
    components: {PageTitle, Stat}, 
    data: function () {
        return {
            stat: { 
                users: 0,
                flights: 0
            }
        }
    },
    computed: {
        userName(){
            return this.$store.state.user?.name || 'Visitante';
        }
    },
    methods: {
        getStats() {
            axios.get(`${baseApiURL}/stats`)
              .then(res => this.stat = res.data)
              .catch(_ => showError('Erro ao buscar stats.'));
        }
    },
    mounted() {
        this.getStats();
    }
}
</script>

<style scopeds>
    .stats {
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
    }
</style>