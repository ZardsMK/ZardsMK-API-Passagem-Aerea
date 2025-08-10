<template>
    <div class="offers">
        <PageTitle icon="fa fa-tag" main="Ofertas" sub="Ofertas de hoje"></PageTitle>
    </div>
    
    <div class="container mt-4">
        <h2>Buscar Voos</h2>

        <b-row class="mb-3">
        <b-col>
            <b-form-input v-model="origem" placeholder="Origem" />
        </b-col>
        <b-col>
            <b-form-input v-model="destino" placeholder="Destino" />
        </b-col>
        <b-col>
            <b-form-input v-model="data" type="date" />
        </b-col>
        <b-col>
            <b-button variant="primary" @click="buscarVoos">Buscar</b-button>
        </b-col>
        </b-row>

        <b-alert variant="warning" v-if="voosFiltrados.length === 0 && buscou" show>
        Nenhum voo encontrado com esses critérios.
        </b-alert>

        <b-list-group v-if="voosFiltrados.length > 0">
        <b-list-group-item v-for="voo in voosFiltrados" :key="voo.flight_id" class="d-flex justify-content-between align-items-center">
            <div>
                <strong>{{ voo.origin }}</strong> → <strong>{{ voo.destination }}</strong> <br />
                Partida: {{ formatarData(voo.departure_time) }}
                Assentos disponíveis: {{ voo.available_seats }}
            </div>
            <router-link :to="`/flights/${voo.flight_id}`" class="btn btn-outline-primary">
                Ver detalhes
            </router-link>
        </b-list-group-item>
        </b-list-group>
    </div>
  
</template>

<script>

import PageTitle from "../template/PageTitle.vue"
import { axiosInstance } from "../../config/axios"
import { showError } from "../../config/msgs";

export default {
    
    name: 'Offers',
    components: {PageTitle},
    data() {
        return {
        origem: '',
        destino: '',
        data: '',
        voos: [],
        voosFiltrados: [],
        buscou: false
        };
    }, 
    methods: {
        buscarVoos() {

            this.voosFiltrados = this.voos.filter(voo => {
                const origemOk = this.origem === '' || voo.origin.toLowerCase().includes(this.origem.toLowerCase());
                const destinoOk = this.destino === '' || voo.destination.toLowerCase().includes(this.destino.toLowerCase());
                
                const dataSelecionada = this.data ? new Date(this.data).toISOString().split('T')[0] : '';
                const dataVoo = new Date(voo.departure_time).toISOString().split('T')[0];
                const dataOk = this.data === '' || dataSelecionada === dataVoo;

                return origemOk && destinoOk && dataOk;
            });
            
            this.buscou = true;

        }, 
        async fetchData() {
            try {
                const resp = await axiosInstance.get(`/flights`);
                this.voos = resp.data;
            } catch (err) {
                showError('Erro ao buscar dados.');
            }
        },
        formatarData(dataIso) {
            const data = new Date(dataIso);
            return data.toLocaleString("pt-BR", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
            });
            }
    },
    mounted() {
        this.fetchData();
        this.buscarVoos();
    }
}
</script>


<style scoped>

</style> 